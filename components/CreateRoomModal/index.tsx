import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Input from '@material-ui/core/Input';
import { toast } from 'react-toastify';
import Skeleton from 'components/Skeleton';
import DaumPostcode from 'components/DaumPostcode';
import { useNavermap } from 'hooks/useNavermap';
import { CreateRoomInput, useCreateRoom } from 'apollo/mutations/createRoom';
import { ICoords } from 'types';

interface ICreateRoomModal {
  setIsCreateModalOn: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IinputData {
  title: string;
  reserved_time: string;
  title_valid: boolean;
}

function CreateRoomModal({ setIsCreateModalOn }: ICreateRoomModal) {
  const { map, loading } = useNavermap();
  const [location, setLocation] = useState<ICoords>();
  const [inputData, setInputData] = useState<IinputData>({
    title: '',
    reserved_time: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16),
    title_valid: true,
  });
  const [isDaumPostcodeOn, setIsDaumPostcodeOn] = useState<boolean>(false);
  const [address, setAddress] = useState<string>('');
  const modalRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef(null);
  const { createRoom, createdRoom } = useCreateRoom();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newInputData = { ...inputData, [name]: value };
    newInputData.title_valid = !!newInputData.title;
    setInputData(newInputData);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const { title, reserved_time } = inputData;
    if (!title) return;
    const queryObj = { title, reserved_time, location };
    const createRoomData = Object.keys(queryObj).reduce((acc, key, idx) => {
      if (idx !== 2) return queryObj[key] ? { ...acc, [key]: queryObj[key] } : acc;
      return queryObj[key] ? { ...acc, [key]: JSON.stringify(queryObj[key]) } : acc;
    }, {});

    console.log('createRoomd', createRoomData);

    createRoom({
      variables: {
        createRoomData: createRoomData as CreateRoomInput,
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
      const mapSetCenter = (_map: any, x: number, y: number) => _map.panTo({ x, y });
      const { naver } = window;
      setAddress(_address);
      setIsDaumPostcodeOn(false);
      naver.maps.Service.geocode({ query: _address }, (status: any, response: any) => {
        if (status !== naver.maps.Service.Status.OK) return console.log('something wrong!');
        const { x, y } = response.v2.addresses[0];
        setLocation({ latitude: x, longitude: y });
        setMarkerPosition({ x, y });
        mapSetCenter(map, x, y);
      });
    },
    [map],
  );

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
          setAddress(response.v2.address.jibunAddress);
        },
      );
    },
    [map],
  );

  const setMarkerPosition = (coord: ICoords | { x: number; y: number }) => {
    const { naver } = window;
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
    naver.maps.Event.addListener(map, 'click', handleMapClick);
  }, [map]);

  //방이 생성되었을 때
  useEffect(() => {
    if (!createdRoom) return;
    navigator.clipboard
      .writeText(`${window.location.origin}/invitation/${createdRoom.createRoom.id}`)
      .then(() => {
        console.log('copy completed');
      }, console.log);
    setIsCreateModalOn(false);

    toast.info(`초대 링크가 클립보드에 복사되었습니다`, {
      position: 'bottom-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
    });
  }, [createdRoom]);

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
            value={inputData.title}
            name="title"
          />
          <Input
            type="datetime-local"
            fullWidth
            onChange={handleInputChange}
            value={inputData.reserved_time}
            name="reserved_time"
          />
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
        <div className="flex items-center justify-around m-3 w-full">
          <button
            className=" w-1/3 py-3  bg-secondary rounded-md shadow-md hover:bg-secondary-dark transition-colors"
            onClick={() => setIsCreateModalOn(false)}
          >
            취소
          </button>
          <button
            className=" w-1/3 py-3 bg-primary rounded-md shadow-md hover:bg-primary-dark  transition-colors"
            onClick={handleSubmit}
          >
            확인
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateRoomModal;
