import React, { useCallback, useRef } from 'react';
import { ICoords } from 'types';

interface useMarkerInput {
  map: any;
  setLocation: React.Dispatch<React.SetStateAction<ICoords>>;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
}

interface IMarkerInput {
  x: number;
  y: number;
  _lat: number; // y
  _lng: number; // x
}

type TUseMarker = (
  input: useMarkerInput,
) => {
  handleMapClick: (e: React.MouseEvent) => void;
  setMarkerPosition: (coord: IMarkerInput) => void;
};

export const useMarker: TUseMarker = ({ map, setLocation, setAddress }) => {
  const markerRef = useRef(null);
  const { naver } = window;

  const setMarkerPosition = (coord: IMarkerInput) => {
    if (!markerRef.current) {
      markerRef.current = new naver.maps.Marker({
        position: new naver.maps.LatLng(coord._lat, coord._lng),
        map,
      });
      return;
    }

    markerRef.current.setPosition(coord);
  };

  const handleMapClick = useCallback(
    (e: any) => {
      if (!map) return;

      const { _lat: latitude, _lng: longitude } = e.coord;
      setLocation({ latitude, longitude });
      setMarkerPosition(e.coord);
      naver.maps.Service.reverseGeocode(
        {
          coords: e.coord,
        },
        (status: any, response: any) => {
          if (status === naver.maps.Service.Status.ERROR) return console.log(status);
          setAddress(response.v2.address.jibunAddress);
        },
      );
    },
    [map],
  );

  return { handleMapClick, setMarkerPosition };
};
