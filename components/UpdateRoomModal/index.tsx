import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Input from '@material-ui/core/Input';
import { useNavermap } from 'hooks/useNavermap';
import { useClipboard } from 'hooks/useClipboard';
import { useUpdateRoom } from 'apollo/mutations/updateRoom';
import { ICoords } from 'types';
import { toast } from 'react-toastify';
import CalendarTemplate from 'components/CreateRoomModal/CalendarTemplate';

import DatePicker, { registerLocale } from 'react-datepicker';
import ko from 'date-fns/locale/ko';
registerLocale('ko', ko);
import 'react-datepicker/dist/react-datepicker.css';

const DaumPostcode = dynamic(() => import('components/DaumPostcode'));
const Skeleton = dynamic(() => import('components/Skeleton'));

interface IUpdateRoomModal {
  room_id?: string;
  title: string;
  reserved_time: string;
  reserved_location: ICoords;
  setIsCreateModalOn: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IinputData {
  title: string;
  reserved_time: string | Date;
}

interface IMarkerInput {
  x: number;
  y: number;
  _lat: number; // y
  _lng: number; // x
}

function UpdateRoomModal({
  room_id,
  title,
  reserved_time,
  reserved_location,
  setIsCreateModalOn,
}: IUpdateRoomModal) {
  const { map, loading } = useNavermap(reserved_location || null);
  const [location, setLocation] = useState<ICoords>();
  const [inputData, setInputData] = useState<IinputData>({
    title: title || '',
    reserved_time: new Date(reserved_time),
  });
  const [isDaumPostcodeOn, setIsDaumPostcodeOn] = useState<boolean>(false);
  const [address, setAddress] = useState<string>('');
  const modalRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef(null);
  const { updateRoom } = useUpdateRoom(room_id);
  const { naver } = window;
  const { handleClipboard, setCopyContent } = useClipboard({
    defaultContent: `${window.location.origin}/invitation?ROOM_ID=`,
    onSucceed: () => {
      toast.info(`초대 링크가 클립보드에 복사되었어요`, {
        position: 'bottom-center',
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
      });
      setIsCreateModalOn(false);
    },
    onFailed: () => {
      toast.warning(`초대 링크가 복사되지 않았습니다. 다시 시도해 주세요 🐇`, {
        position: 'bottom-center',
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
      });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  };

  const handleDateChange = date => {
    setInputData({ ...inputData, reserved_time: date });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { title, reserved_time } = inputData;
    if (!title || !reserved_time) return;

    updateRoom({
      variables: {
        updateRoomData: {
          room_id,
          reserved_time,
          location,
        },
      },
    });

    toast.success('예약 정보가 변경되었어요', {
      position: 'bottom-center',
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
    });

    setIsCreateModalOn(false);
  };

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === modalRef.current) {
      setIsCreateModalOn(false);
    }
  };

  const togglePostcodeSearch = useCallback(() => {
    setIsDaumPostcodeOn(prev => !prev);
  }, []);

  const handlePostcodeComplete = useCallback(
    (_address: string) => {
      const mapSetCenter = (_map: any, x: number, y: number) => _map.panTo({ x, y });
      setAddress(_address);
      setIsDaumPostcodeOn(false);
      naver.maps.Service.geocode({ query: _address }, (status: any, response: any) => {
        if (status !== naver.maps.Service.Status.OK) return console.log('something wrong!');
        const { x, y } = response.v2.addresses[0];
        setLocation({
          longitude: Number(x),
          latitude: Number(y),
        });
        setMarkerPosition({ x: Number(x), y: Number(y), _lat: Number(y), _lng: Number(x) });
        mapSetCenter(map, x, y);
      });
    },
    [map],
  );

  const handleMapClick = useCallback(
    (e: any) => {
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

  const setMarkerPosition = (coord: IMarkerInput) => {
    if (!markerRef.current) {
      markerRef.current = new naver.maps.Marker({
        position: new naver.maps.LatLng(coord._lat, coord._lng),
        map,
      });
    }

    markerRef.current.setPosition(coord);
  };

  useEffect(() => {
    if (!map) return;

    setCopyContent(room_id);
    const { naver } = window;
    naver.maps.Event.addListener(map, 'click', handleMapClick);
  }, [map]);

  //넘어온 주소 띄우기
  useEffect(() => {
    if (!reserved_location || !map) return;
    const { latitude, longitude } = reserved_location;

    naver.maps.Service.reverseGeocode(
      {
        location: new naver.maps.LatLng(latitude, longitude),
      },
      (status: any, response: any) => {
        if (status !== naver.maps.Service.Status.OK) {
          return alert('Something wrong!');
        }
        const result = response.result;
        const { items } = result;
        setAddress(items[0].address);
        setMarkerPosition({ x: longitude, y: latitude, _lat: latitude, _lng: longitude });
      },
    );
  }, [reserved_location, map]);

  return (
    <div
      className="fixed inset-0 bg-black-op-3 z-20  overflow-auto"
      ref={modalRef}
      onClick={handleModalClick}
    >
      <form
        className="fixed inset-10 max-h-calc flex flex-col justify-center items-center min-h-520  max-w-md py-6 px-6 sm:px-12 m-auto bg-white rounded-3xl shadow-2xl overflow-scroll"
        onSubmit={handleSubmit}
      >
        <Image src="/favicon.png" width={110} height={110} alt="logo" />
        <div className="flex flex-col justify-between w-full h-40 py-4 mt-3">
          <Input
            placeholder="거래의 제목을 입력해주세요 🥕"
            fullWidth
            onChange={handleInputChange}
            value={title ? title : inputData.title}
            name="title"
          />
          <CalendarTemplate>
            <DatePicker
              selected={inputData.reserved_time}
              onChange={date => handleDateChange(date)}
              locale="ko"
              showTimeSelect
              timeFormat="p"
              timeIntervals={10}
              dateFormat="Pp"
            />
          </CalendarTemplate>
          <Input
            type="text"
            fullWidth
            value={address}
            placeholder="주소로 검색하기 🥕"
            onClick={togglePostcodeSearch}
          />
        </div>
        {isDaumPostcodeOn && (
          <DaumPostcode onComplete={handlePostcodeComplete} onClose={togglePostcodeSearch} />
        )}
        <div id="map" className="relative w-full h-44 bg-white">
          {loading && <Skeleton />}
        </div>
        <div className="flex justify-evenly m-3 w-full">
          <button
            className="w-5/12 py-3  bg-secondary rounded-md shadow-md hover:bg-secondary-dark transition-colors"
            onClick={() => setIsCreateModalOn(false)}
          >
            취소
          </button>
          <button
            className="w-5/12 py-3 bg-primary rounded-md shadow-md hover:bg-primary-dark  transition-colors"
            onClick={handleSubmit}
          >
            수정하기
          </button>
        </div>
        <div
          className="w-9/12 py-3 m-3 text-center bg-primary rounded-md shadow-md hover:bg-primary-dark transition-colors"
          onClick={handleClipboard}
        >
          📋 초대링크 복사하기
        </div>
      </form>
    </div>
  );
}

export default UpdateRoomModal;
