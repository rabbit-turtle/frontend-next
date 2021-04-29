import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Input from '@material-ui/core/Input';
import dayjs from 'dayjs';
import { useNavermap } from 'hooks/useNavermap';
import { useClipboard } from 'hooks/useClipboard';
import { useMarker } from 'hooks/useMarker';
import { useCreateRoom } from 'apollo/mutations/createRoom';
import { ICoords } from 'types';
import { toast } from 'react-toastify';
import { isNotEmpty, isDate, isAfter, validate, isLocation } from 'utils/validator';

const DaumPostcode = dynamic(() => import('components/DaumPostcode'));
const Skeleton = dynamic(() => import('components/Skeleton'));
const Calendar = dynamic(() => import('components/Calendar'));

interface ICreateRoomModal {
  setIsCreateModalOn: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IinputData {
  title: string;
  reserved_time: string | Date;
}

function CreateRoomModal({ setIsCreateModalOn }: ICreateRoomModal) {
  const { map, isMapLoading } = useNavermap(null);
  const [location, setLocation] = useState<ICoords>();
  const [inputData, setInputData] = useState<IinputData>({
    title: '',
    reserved_time: new Date(dayjs().add(2, 'hour').startOf('hour').toISOString()),
  });
  const [isDaumPostcodeOn, setIsDaumPostcodeOn] = useState<boolean>(false);
  const [isCalendarOn, setIsCalendarOn] = useState<boolean>(false);
  const [address, setAddress] = useState<string>('');
  const modalRef = useRef<HTMLDivElement>(null);
  const { createRoom, createdRoom } = useCreateRoom();
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
  const { handleMapClick, setMarkerPosition } = useMarker({ map, setAddress, setLocation });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  };

  const handleDateChange = date => {
    setInputData({ ...inputData, reserved_time: date });
    setIsCalendarOn(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { title, reserved_time } = inputData;
    const errors = validate(
      {
        title,
        reserved_time,
        location,
      },
      {
        title: [isNotEmpty],
        reserved_time: [isNotEmpty, isDate, isAfter],
        location: [isNotEmpty, isLocation],
      },
    );

    if (errors.length) {
      errors.reverse().forEach(({ errorMessage }) =>
        toast.error(errorMessage, {
          position: 'bottom-center',
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
        }),
      );
      return;
    }

    createRoom({
      variables: {
        createRoomData: {
          title,
          reserved_time,
          location,
        },
      },
    });
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
      if (!map) return;

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

  useEffect(() => {
    if (!map) return;

    const { naver } = window;
    naver.maps.Event.addListener(map, 'click', handleMapClick);
  }, [map]);

  useEffect(() => {
    if (!createdRoom) return;
    if (!map) return;

    const { naver } = window;
    naver.maps.Event.clearInstanceListeners(map);

    setCopyContent(createdRoom.createRoom.id);
    toast.success('초대링크를 통해 채팅을 시작해 보세요', {
      position: 'bottom-center',
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
    });
  }, [map, createdRoom]);

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
            value={inputData.title}
            disabled={!!createdRoom}
            name="title"
          />
          <div
            className="flex items-center h-8 w-full text-base"
            onClick={() => setIsCalendarOn(true)}
          >
            {dayjs(inputData.reserved_time).format('YYYY. MM. DD hh:mm A')}
          </div>
          <Input
            type="text"
            fullWidth
            value={address}
            placeholder="주소로 검색하기 🥕"
            disabled={!!createdRoom}
            onClick={togglePostcodeSearch}
          />
        </div>
        {!createdRoom && isDaumPostcodeOn && (
          <DaumPostcode onComplete={handlePostcodeComplete} onClose={togglePostcodeSearch} />
        )}
        <div id="map" className="relative w-full h-44 bg-white">
          {isMapLoading && <Skeleton />}
        </div>
        {!!createdRoom ? (
          <div
            className="w-4/5 py-3 m-3 text-center bg-primary rounded-md shadow-md hover:bg-primary-dark transition-colors"
            onClick={handleClipboard}
          >
            📋 초대링크 복사하기
          </div>
        ) : (
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
              생성하기
            </button>
          </div>
        )}
        {!createdRoom && isCalendarOn && (
          <Calendar
            setIsCalendarOn={setIsCalendarOn}
            handleDateChange={handleDateChange}
            reservedDate={inputData.reserved_time}
          />
        )}
      </form>
    </div>
  );
}

export default CreateRoomModal;
