import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Input from '@material-ui/core/Input';
import dayjs from 'dayjs';
import { useNavermap } from 'hooks/useNavermap';
import { CreateRoomInput, useCreateRoom } from 'apollo/mutations/createRoom';
import { UpdateRoomInput, useUpdateRoom } from 'apollo/mutations/updateRoom';
import { ICoords } from 'types';
import { useClipboard } from 'hooks/useClipboard';
import { toast } from 'react-toastify';

const DaumPostcode = dynamic(() => import('components/DaumPostcode'));
const Skeleton = dynamic(() => import('components/Skeleton'));

interface ICreateRoomModal {
  type: string;
  id?: string;
  title?: string;
  reserved_time?: string;
  reserved_location?: ICoords;
  setIsCreateModalOn: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IinputData {
  title: string;
  reserved_time: string | Date;
  title_valid: boolean;
}

function CreateRoomModal({
  type,
  id,
  title,
  reserved_time,
  reserved_location,
  setIsCreateModalOn,
}: ICreateRoomModal) {
  const { map, loading } = useNavermap(type === 'chat' ? reserved_location : null);
  const [location, setLocation] = useState<ICoords>();
  const [inputData, setInputData] = useState<IinputData>({
    title: type === 'chat' ? title : '',
    reserved_time: type === 'chat' ? dayjs(reserved_time).format('YYYY-MM-DDThh:mm') : '',
    title_valid: true,
  });
  const [isDaumPostcodeOn, setIsDaumPostcodeOn] = useState<boolean>(false);
  const [address, setAddress] = useState<string>('');
  const mapEventRef = useRef(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef(null);
  const { createRoom, createdRoom } = useCreateRoom();
  const { updateRoom } = useUpdateRoom(id);
  const { naver } = window;
  const { copyToClipBoard } = useClipboard(setIsCreateModalOn);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newInputData = { ...inputData, [name]: value };
    newInputData.title_valid = !!newInputData.title;
    setInputData(newInputData);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const { title, reserved_time } = inputData;
    const room_id = id;
    if (!title) return;
    const queryObj =
      type !== 'chat' ? { title, reserved_time, location } : { room_id, reserved_time, location };
    const createOrUpdateRoomData = Object.keys(queryObj).reduce((acc, key, idx) => {
      // if (idx !== 2) return queryObj[key] ? { ...acc, [key]: queryObj[key] } : acc;
      if (key === 'reserved_time') queryObj[key] = new Date(queryObj[key]);
      return queryObj[key] ? { ...acc, [key]: queryObj[key] } : acc;
    }, {});

    if (type === 'list') {
      createRoom({
        variables: {
          createRoomData: createOrUpdateRoomData as CreateRoomInput,
        },
      });
    }

    if (type === 'chat') {
      updateRoom({
        variables: {
          updateRoomData: createOrUpdateRoomData as UpdateRoomInput,
        },
      });
      setIsCreateModalOn(false);
    }
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
        setMarkerPosition({ x, y });
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

  const setMarkerPosition = (coord: ICoords | { x: number; y: number }) => {
    if (!markerRef.current) {
      markerRef.current = new naver.maps.Marker({
        position: coord,
        map,
      });
      return;
    }

    markerRef.current.setPosition(coord);
  };

  useEffect(() => {
    if (!map) return;

    const { naver } = window;
    const mapListner = naver.maps.Event.addListener(map, 'click', handleMapClick);
    mapEventRef.current = mapListner;
  }, [map]);

  useEffect(() => {
    if (!createdRoom) return;
    if (!map) return;

    const { naver } = window;
    naver.maps.Event.clearInstanceListeners(map);

    toast.success('방이 생성되었습니다! 초대링크를 복사해 주세요', {
      position: 'bottom-center',
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
    });
  }, [map, createdRoom]);

  //Chat에서 기본 주소 띄우기
  useEffect(() => {
    if (type === 'list') return;
    naver.maps.Service.reverseGeocode(
      {
        location: new naver.maps.LatLng(reserved_location.latitude, reserved_location.longitude),
      },
      function (status, response) {
        if (status !== naver.maps.Service.Status.OK) {
          return alert('Something wrong!');
        }
        var result = response.result,
          items = result.items;
        setAddress(items[0].address);
      },
    );
  }, []);

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
            error={!inputData.title_valid}
            onChange={handleInputChange}
            value={title ? title : inputData.title}
            disabled={!!createdRoom}
            name="title"
          />
          <Input
            type="datetime-local"
            fullWidth
            onChange={handleInputChange}
            value={inputData.reserved_time}
            disabled={!!createdRoom}
            name="reserved_time"
          />
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
          {loading && <Skeleton />}
        </div>
        {!!createdRoom ? (
          <div
            className="w-4/5 py-3 m-3 text-center bg-primary rounded-md shadow-md hover:bg-primary-dark transition-colors"
            onClick={() => copyToClipBoard(createdRoom.createRoom.id)}
          >
            📋 초대링크 복사하기
          </div>
        ) : (
          <div className="flex items-center justify-around m-3 w-full">
            <button
              className="w-1/3 py-3  bg-secondary rounded-md shadow-md hover:bg-secondary-dark transition-colors"
              onClick={() => setIsCreateModalOn(false)}
            >
              취소
            </button>
            <button
              className="w-1/3 py-3 bg-primary rounded-md shadow-md hover:bg-primary-dark  transition-colors"
              onClick={handleSubmit}
            >
              {type === 'chat' ? '수정하기' : '생성하기'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default CreateRoomModal;
