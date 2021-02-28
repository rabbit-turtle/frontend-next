import { useEffect, useState, useCallback, useRef } from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import Map from 'components/Map';
import NavigationBar from 'components/NavigationBar';
import { useNavermap } from 'hooks/useNavermap';
import { useWebsocket } from 'hooks/useWebsocket';
import { getDistancefromCoords } from 'utils/distance';

enum AnimalType {
  rabbit = 'rabbit',
  turtle = 'turtle',
}

interface ICoords {
  latitude: number;
  longitude: number;
}

function MapPage({ result, ROOM_ID }) {
  const [currentLocation, setCurrentLocation] = useState<ICoords>();
  const [isConnected, setIsConnected] = useState<[boolean, boolean]>([false, false]);
  const [distanceProgress, setDistanceProgress] = useState<[number, number]>([0, 100]);
  const { map, loading } = useNavermap();
  const { sendMessage, received } = useWebsocket(ROOM_ID);
  const rabbitMarker = useRef(null);
  const turtleMarker = useRef(null);

  const getMarkerOptions = useCallback((type: string, position: any, _map = map) => {
    const { naver } = window as any;
    return {
      position: position.destinationPoint(90, 15),
      map: _map,
      icon: {
        url: `/images/${type}.png`,
      },
      animation: naver.maps.Animation.BOUNCE,
    };
  }, []);

  const getNaverLatLng = ({ latitude, longitude }: ICoords) => {
    const { naver } = window as any;
    return new naver.maps.LatLng(latitude, longitude);
  };

  const onGeolocationError = useCallback((error: GeolocationPositionError) => {
    console.log(`Error(${error.code}) : ${error.message}`);
  }, []);

  const onGeolocationSuccess = (position: GeolocationPosition) => {
    if (!isConnected[0]) setIsConnected([true, isConnected[1]]);
    const { naver } = window as any;
    const { latitude, longitude } = position.coords;
    const newPosition = new naver.maps.LatLng(latitude, longitude);

    setCurrentLocation({ latitude, longitude });
    sendMessage(JSON.stringify({ latitude, longitude }));

    if (!rabbitMarker.current) {
      console.log('rabbit marker 없음', rabbitMarker.current);
      const rabbitMarkerOptions = getMarkerOptions(AnimalType.rabbit, newPosition, map);
      const _rabbitMarker = new naver.maps.Marker(rabbitMarkerOptions);
      rabbitMarker.current = _rabbitMarker;
      return;
    }
    rabbitMarker.current.setPosition(newPosition);
    console.log('움직임', latitude, longitude);
  };

  useEffect(() => {
    if (!map) return;
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
    const { naver } = window as any;
    console.log(result.lat, result.lng);
    const destinationMarker = new naver.maps.Marker({
      position: new naver.maps.LatLng(result.lat, result.lng),
      map: map,
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, [map]);

  //상대방 좌표가 변경됐을 때
  useEffect(() => {
    if (!received || !map) return;
    if (!isConnected[1]) setIsConnected([isConnected[0], true]);
    const { naver } = window as any;
    const { latitude, longitude } = JSON.parse(received);
    console.log('received', latitude, longitude, received);
    const newPosition = getNaverLatLng({ latitude, longitude });
    if (!turtleMarker.current) {
      const turtleMarkerOptions = getMarkerOptions(AnimalType.turtle, newPosition, map);
      turtleMarker.current = new naver.maps.Marker(turtleMarkerOptions);
      return;
    }
    turtleMarker.current.setPosition(newPosition);
  }, [received]);

  //처음 둘다 연결됐을 때 지도 bound 맞춤
  useEffect(() => {
    if (!isConnected[0] || !isConnected[1]) return;
    const { naver } = window as any;
    const { latitude, longitude } = JSON.parse(received);
    const { latitude: lat, longitude: lng } = currentLocation;

    const opponentPoint = getNaverLatLng({ latitude, longitude }).toPoint();
    const myPoint = getNaverLatLng({ latitude: lat, longitude: lng }).toPoint();
    const { x: x1, y: y1 } = myPoint;
    const { x: x2, y: y2 } = opponentPoint;

    const newPointBound = new naver.maps.PointBounds(
      new naver.maps.Point(Math.min(x1, x2), Math.min(y1, y2)),
      new naver.maps.Point(Math.max(x1, x2), Math.max(y1, y2)),
    );

    console.log(newPointBound);

    map!.fitBounds(newPointBound);
  }, [isConnected]);

  return (
    <>
      <Head>
        <title>지도</title>
      </Head>
      <NavigationBar title={result.title} />
      <Map loading={!(!loading && isConnected[0])} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { ROOM_ID } = query; // 현재 라우터 정보. ROOM_ID로부터 정보를 받아와서 props로 방 정보나,...그런걸 넘겨주도록 하면 될듯

  return {
    props: {
      result: {
        lat: 37.3662778,
        lng: 127.1081222,
        title: '나도 아이패드 에어가 갖고싶따',
        date: new Date().toString(),
      },
      ROOM_ID,
    },
  };
};

export default MapPage;
