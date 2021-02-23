import React, { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Skeleton from 'components/skeleton';
import { useNavermap } from 'hooks/useNavermap';

enum AnimalType {
  rabbit = 'rabbit',
  turtle = 'turtle',
}

function Map() {
  const [rabbitMarker, setRabbitMarker] = useState<any>(null);
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
      <div className="flex flex-col h-screen">
        <header className="flex justify-center items-center h-10">{router.query?.ROOM_ID}</header>
        <div className="relative flex flex-grow">
          <div id="map" className="flex-grow"></div>
          {loading && <Skeleton />}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ query }) {
  const { ROOM_ID } = query; // 현재 라우터 정보. ROOM_ID로부터 정보를 받아와서 props로 방 정보나,...그런걸 넘겨주도록 하면 될듯

  return {
    props: {},
  };
}

export default Map;
