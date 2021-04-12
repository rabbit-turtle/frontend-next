import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Input from '@material-ui/core/Input';
import dayjs from 'dayjs';
import { useNavermap } from 'hooks/useNavermap';
import { useCreateRoom } from 'apollo/mutations/createRoom';
import { useUpdateRoom } from 'apollo/mutations/updateRoom';
import { ICoords } from 'types';
import { toast } from 'react-toastify';

const DaumPostcode = dynamic(() => import('components/DaumPostcode'));
const Skeleton = dynamic(() => import('components/Skeleton'));

interface ICreateRoomModal {
  type: string;
  room_id?: string;
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
  room_id,
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
  const modalRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef(null);
  const { createRoom, createdRoom } = useCreateRoom();
  const { updateRoom } = useUpdateRoom(room_id);
  const { naver } = window;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newInputData = { ...inputData, [name]: value };
    newInputData.title_valid = !!newInputData.title;
    setInputData(newInputData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { title, reserved_time } = inputData;
    if (!title) return;

    const JOBS = {
      list: () => {
        createRoom({
          variables: {
            createRoomData: {
              title,
              reserved_time,
              location,
            },
          },
        });
      },
      chat: () => {
        updateRoom({
          variables: {
            updateRoomData: {
              room_id,
              reserved_time,
              location,
            },
          },
        });

        setIsCreateModalOn(false);
      },
    };

    JOBS[type]();
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
    naver.maps.Event.addListener(map, 'click', handleMapClick);
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

  const handleClipboard = () => {
    const onSucced = () => {
      toast.info(`초대 링크가 클립보드에 복사되었습니다`, {
        position: 'bottom-center',
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
      });

      setIsCreateModalOn(false);
    };

    const onFailed = () => {
      toast.warning(`초대 링크가 복사되지 않았습니다. 다시 시도해 주세요 🐇`, {
        position: 'bottom-center',
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
      });
    };

    // clipboard API가 없는 브라우저 지원
    if (!navigator.clipboard) {
      let textarea = document.createElement('textarea');
      textarea.readOnly = true;
      textarea.style.position = 'fixed';
      textarea.value = `${window.location.origin}/invitation?ROOM_ID=${
        createdRoom?.createRoom.id || room_id
      }`;
      document.body.appendChild(textarea);

      textarea.select();

      const range = document.createRange();
      range.selectNodeContents(textarea);

      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);

      textarea.setSelectionRange(0, textarea.value.length);
      const result = document.execCommand('copy');
      textarea.remove();

      if (result) onSucced();
      else onFailed();

      return;
    }

    navigator.clipboard
      .writeText(
        `${window.location.origin}/invitation?ROOM_ID=${createdRoom?.createRoom.id || room_id}`,
      )
      .then(() => onSucced())
      .catch(() => onFailed());
  };

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
              {type === 'chat' ? '수정하기' : '생성하기'}
            </button>
          </div>
        )}
        {type === 'chat' && (
          <div
            className="w-9/12 py-3 m-3 text-center bg-primary rounded-md shadow-md hover:bg-primary-dark transition-colors"
            onClick={handleClipboard}
          >
            📋 초대링크 복사하기
          </div>
        )}
      </form>
    </div>
  );
}

export default CreateRoomModal;
