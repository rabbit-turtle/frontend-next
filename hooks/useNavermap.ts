import { useEffect, useState, useCallback } from 'react';

//사용하실 때 <div id='map' /> 하나 지정해두시면 그 안으로 네이버지도가 쏙 들어갑니다
export const useNavermap = () => {
  const [map, setMap] = useState();
  const [loading, setLoading] = useState<boolean>(true);

  const onGeolocationError = useCallback((error: GeolocationPositionError) => {
    console.log(`Error(${error.code}) : ${error.message}`);
  }, []);

  useEffect(() => {
    const { naver } = window as any;
    const optionObj = {
      maximumAge: 30000,
      timeout: 27000,
    };

    navigator.geolocation.getCurrentPosition(
      position => {
        const currentLocation = new naver.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude,
        );

        const _map = new naver.maps.Map('map', {
          center: currentLocation,
          zoom: 16,
        });

        setMap(_map);
        setLoading(false);
      },
      onGeolocationError,
      optionObj,
    );
  }, []);

  return { map, loading };
};
