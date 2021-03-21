import { useState, useEffect, useCallback } from 'react';
import { ICoords } from 'types';
import { useNavermap } from 'hooks/useNavermap';

interface Position {
  type?: string;
  markerRef?: React.MutableRefObject<any>;
  reserved_location?: ICoords;
}

export const useMarker = ({ type, markerRef, reserved_location }: Position) => {
  const { map, loading } = useNavermap(null);
  const [location, setLocation] = useState<ICoords>();
  const [markedAddress, setMarkedAddress] = useState<string>('');

  const { naver } = window as any;
  useEffect(() => {
    //좌표 보내줄 때
    if (location) {
      new naver.maps.Marker({
        position: new naver.maps.LatLng(reserved_location.latitude, reserved_location.longitude),
        map,
      });
      return;
    }
  }, []);

  const handleMapClick = useCallback(
    (e: any) => {
      const { naver } = window;
      const { _lat: latitude, _lng: longitude } = e.coord;
      setLocation({ latitude, longitude });
      setMarkerPosition(e.coord);
      naver.maps.Service.reverseGeocode(
        {
          coords: e.coord,
        },
        (status: any, response: any) => {
          if (status === naver.maps.Service.Status.ERROR) return console.log(status);
          setMarkedAddress(response.v2.address.jibunAddress);
        },
      );
    },
    [map],
  );

  const setMarkerPosition = (coord: ICoords | { x: number; y: number }) => {
    const { naver } = window;
    if (!markerRef?.current) {
      markerRef.current = new naver.maps.Marker({
        position: coord,
        map,
      });
      return;
    }
    markerRef.current.setPosition(coord);
  };

  return { markedAddress, handleMapClick, setMarkerPosition };
};
