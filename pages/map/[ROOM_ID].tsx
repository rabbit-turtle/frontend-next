import { useEffect, useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useLazyQuery } from '@apollo/client';
import { useNavermap } from 'hooks/useNavermap';
import { useWebsocket } from 'hooks/useWebsocket';
import { useChatReceived } from 'hooks/useChatReceived';
import { getDistancefromCoords } from 'utils/distance';
import { ICoords } from 'types';
import { useRouter } from 'next/router';
import { GET_ROOM } from 'apollo/queries';
import { SOCKET_MESSAGE_TYPE } from 'constants/index';
const Map = dynamic(() => import('components/Map'));

enum AnimalType {
  rabbit = 'rabbit',
  turtle = 'turtle',
}

function MapPage() {
  const [currentLocation, setCurrentLocation] = useState<ICoords>();
  const [isBothConnected, setIsBothConnected] = useState<boolean>(false);
  const [distanceProgress, setDistanceProgress] = useState<[number, number]>([0, 100]);
  const [minuteLeft, setMinuteLeft] = useState<number>(123);
  const { map, loading } = useNavermap();
  const router = useRouter();
  const { enterRoom, sendMessage, isSocketConnected, received } = useWebsocket();
  const rabbitMarker = useRef(null);
  const turtleMarker = useRef(null);
  // const watchIdRef = useRef<number>(null);
  const { ROOM_ID } = router.query;

  const [getRoom, { data }] = useLazyQuery(GET_ROOM); //waiting for graphql server...

  useEffect(() => {
    if (!ROOM_ID) return;
    getRoom({
      variables: {
        room_id: ROOM_ID,
      },
    });
  }, []);

  useEffect(() => {
    console.log('room', data);
    console.log(new Date(data.room.reserved_time).valueOf() - new Date().valueOf());
    console.log(data.room.reserved_time, new Date().toISOString());
    console.log(new Date(data.room.reserved_time), new Date().toISOString());
    const msdif = new Date(data.room.reserved_time).valueOf() - new Date().valueOf();
    console.log(Math.floor(msdif / 1000 / 60));
  }, [data]);

  useEffect(() => {
    if (!ROOM_ID || !isSocketConnected) return;

    enterRoom(ROOM_ID as string);
  }, [ROOM_ID, isSocketConnected]);
  useChatReceived(received);

  const getMarkerOptions = useCallback((type: string, position: any, _map = map) => {
    const { naver } = window;
    return {
      position: position.destinationPoint(90, 15),
      map: _map,
      icon: {
        url: `/images/${type}.png`,
        // scaledSize: naver.maps.Size(50, 30),
      },
      animation: naver.maps.Animation.BOUNCE,
    };
  }, []);

  const getDistanceProgress = (type: string, lat: number, lng: number) => {
    const distance = getDistancefromCoords(lat, lng, result.lat, result.lng);
    const _distance = distance > 1 ? 1 : distance;
    console.log(type, distance);
    if (type === 'rabbit') {
      const converted = Math.floor((1 - _distance) * 50);
      setDistanceProgress(prev => [converted, prev[1]]);
      return;
    }
    const converted = Math.floor((1 + _distance) * 50);
    setDistanceProgress(prev => [prev[0], converted]);
  };

  const getNaverLatLng = ({ latitude, longitude }: ICoords) => {
    const { naver } = window;
    return new naver.maps.LatLng(latitude, longitude);
  };

  const fitBoundsMap = (_map: any, ...naverpoints: any[]) => {
    const { naver } = window;
    const destPoint = getNaverLatLng({ latitude: result.lat, longitude: result.lng }).toPoint();
    let minx = 999,
      miny = 999,
      maxx = 0,
      maxy = 0;

    [...naverpoints, destPoint].forEach((point: { x: number; y: number }) => {
      minx = point.x < minx ? point.x : minx;
      miny = point.y < miny ? point.y : miny;
      maxx = point.x > maxx ? point.x : maxx;
      maxy = point.y > maxy ? point.y : maxy;
    });

    const newPointBound = new naver.maps.PointBounds(
      new naver.maps.Point(minx, miny),
      new naver.maps.Point(maxx, maxy),
    );

    _map.fitBounds(newPointBound);
  };

  const onGeolocationError = useCallback((error: GeolocationPositionError) => {
    console.log(`Error(${error.code}) : ${error.message}`);
  }, []);

  const onGeolocationSuccess = (position: GeolocationPosition) => {
    const { naver } = window;
    const { latitude, longitude } = position.coords;
    const newPosition = new naver.maps.LatLng(latitude, longitude);

    setCurrentLocation({ latitude, longitude });
    sendMessage({
      ROOM_ID: ROOM_ID as string,
      message: { latitude, longitude },
      created_at: new Date(),
    });
    getDistanceProgress(AnimalType.rabbit, latitude, longitude);

    if (!rabbitMarker.current) {
      fitBoundsMap(map, newPosition.toPoint());
      const rabbitMarkerOptions = getMarkerOptions(AnimalType.rabbit, newPosition, map);
      const _rabbitMarker = new naver.maps.Marker(rabbitMarkerOptions);
      rabbitMarker.current = _rabbitMarker;
      return;
    }
    rabbitMarker.current.setPosition(newPosition);
    console.log('움직임', latitude, longitude);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMinuteLeft(min => min - 1);
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!map || !isSocketConnected) return;
    const optionObj = {
      maximumAge: 30000,
      timeout: 27000,
    };
    //geolocation setting
    const watchId = navigator.geolocation.watchPosition(
      onGeolocationSuccess,
      onGeolocationError,
      optionObj,
    );

    //목적지 좌표
    const { naver } = window;
    console.log(result.lat, result.lng);
    const destinationMarker = new naver.maps.Marker({
      position: new naver.maps.LatLng(result.lat, result.lng),
      map: map,
    });

    console.log('useEffect watchId>>', watchId);

    return () => navigator.geolocation.clearWatch(watchId);
  }, [map, isSocketConnected]);

  //상대방 좌표가 변경됐을 때
  useEffect(() => {
    if (!received || !map || minuteLeft > 60) return;
    const { message, messageType } = JSON.parse(received);
    if (messageType !== SOCKET_MESSAGE_TYPE.map) return;
    const { naver } = window as any;
    const { latitude, longitude } = message;
    console.log('received', latitude, longitude);

    getDistanceProgress(AnimalType.turtle, latitude, longitude);

    const newPosition = getNaverLatLng({ latitude, longitude });
    if (!turtleMarker.current) {
      const turtleMarkerOptions = getMarkerOptions(AnimalType.turtle, newPosition, map);
      turtleMarker.current = new naver.maps.Marker(turtleMarkerOptions);
      return;
    }
    turtleMarker.current.setPosition(newPosition);
  }, [received, minuteLeft]);

  //처음 둘다 연결됐을 때 지도 bound 맞춤
  useEffect(() => {
    if (isBothConnected || !currentLocation || !received || !map) return;
    const { latitude, longitude } = JSON.parse(received);
    const { latitude: lat, longitude: lng } = currentLocation;

    const opponentPoint = getNaverLatLng({ latitude, longitude }).toPoint();
    const myPoint = getNaverLatLng({ latitude: lat, longitude: lng }).toPoint();

    fitBoundsMap(map, myPoint, opponentPoint);
    setIsBothConnected(true);
  }, [currentLocation, received, isBothConnected]);

  return (
    <Map
      loading={loading}
      title={data?.room?.title}
      minuteLeft={minuteLeft}
      currentLocation={currentLocation}
      received={received}
      distanceProgress={distanceProgress}
    />
  );
}

export default MapPage;
