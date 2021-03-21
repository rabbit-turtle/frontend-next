import { isNullableType } from 'graphql';
import { useEffect, useRef, useState, useCallback } from 'react';
import { ICoords } from 'types';
// import { useMarker } from 'hooks/useMarker';

//사용하실 때 <div id='map' /> 하나 지정해두시면 그 안으로 네이버지도가 쏙 들어갑니다
export const useNavermap = (reserved_location: ICoords | null) => {
  const [map, setMap] = useState();
  const [loading, setLoading] = useState<boolean>(true);
  // const markerRef = useRef(null);

  const onGeolocationError = useCallback((error: GeolocationPositionError) => {
    console.log(`Error(${error.code}) : ${error.message}`);
  }, []);

  useEffect(() => {
    const { naver } = window as any;
    const optionObj = {
      maximumAge: 30000,
      timeout: 27000,
    };

    if (reserved_location) {
      const reservedLocation = new naver.maps.LatLng(
        reserved_location.latitude,
        reserved_location.longitude,
      );
      const _map = new naver.maps.Map('map', {
        center: reservedLocation,
        zoom: 16,
        logoControl: false,
      });

      new naver.maps.Marker({
        position: new naver.maps.LatLng(reserved_location.latitude, reserved_location.longitude),
        map,
      });

      setMap(_map);
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async position => {
        const currentLocation = new naver.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude,
        );

        const _map = new naver.maps.Map('map', {
          center: currentLocation,
          zoom: 16,
          logoControl: false,
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
