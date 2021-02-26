import { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Map from 'components/Map';
import NavigationBar from 'components/NavigationBar';
import { useNavermap } from 'hooks/useNavermap';

enum AnimalType {
  rabbit = 'rabbit',
  turtle = 'turtle',
}

function MapPage() {
  const [rabbitMarker, setRabbitMarker] = useState<any>(null);
  const [turtleMarker, setTurtleMarker] = useState<any>(null);
  const router = useRouter();
  const { map, loading } = useNavermap();

  const getMarkerOptions = useCallback((type: string, position: any, _map = map) => {
    return {
      position: position.destinationPoint(90, 15),
      map: _map,
      icon: {
        url: `/images/${type}.png`,
      },
    };
  }, []);

  const onGeolocationError = useCallback((error: GeolocationPositionError) => {
    console.log(`Error(${error.code}) : ${error.message}`);
  }, []);

  const onGeolocationSuccess = (position: GeolocationPosition) => {
    const { naver } = window as any;
    const newPosition = new naver.maps.LatLng(position.coords.latitude, position.coords.longitude);
    if (!rabbitMarker) {
      const rabbitMarkerOptions = getMarkerOptions(AnimalType.rabbit, newPosition, map);
      const _rabbitMarker = new naver.maps.Marker(rabbitMarkerOptions);

      setRabbitMarker(_rabbitMarker);
      return;
    }
    rabbitMarker.setPosition(newPosition);
    console.log('움직임', position.coords.latitude, position.coords.longitude);
  };

  useEffect(() => {
    const optionObj = {
      maximumAge: 30000,
      timeout: 27000,
    };
    const watchId = navigator.geolocation.watchPosition(
      onGeolocationSuccess,
      onGeolocationError,
      optionObj,
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [map]);

  return (
    <>
      <Head>
        <title>지도</title>
      </Head>
      <NavigationBar title={`뭐 나중엔 상품이름이 들가겟지...`} />
      <Map loading={loading} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { ROOM_ID } = query; // 현재 라우터 정보. ROOM_ID로부터 정보를 받아와서 props로 방 정보나,...그런걸 넘겨주도록 하면 될듯

  return {
    props: {},
  };
};

export default MapPage;
