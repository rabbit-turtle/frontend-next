import { ChangeEvent, MouseEvent, useState, useRef, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';
import Skeleton from 'components/Skeleton';
import { useNavermap } from 'hooks/useNavermap';
import { ICoords } from 'types';
import { useMutation, gql } from '@apollo/client';

const CREATE_ROOM = gql`
  mutation CreateRoom($createRoomData: CreateRoomInput!) {
    createRoom(createRoomData: $createRoomData)
  }
`;

function CreateRoomModal() {
  const { map, loading } = useNavermap();
  const [location, setLocation] = useState<ICoords>();
  const [inputData, setInputData] = useState({
    title: '',
    reserved_time: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString(),
  });
  const markerRef = useRef(null);
  const [createRoom, { data, error }] = useMutation(CREATE_ROOM);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  };

  const handleSubmit = (e: MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const { title, reserved_time } = inputData;
    createRoom({
      variables: {
        createRoomData: {
          title,
          reserved_time,
          location: JSON.stringify(location),
        },
      },
    });
    console.log({ title, reserved_time, location });
  };

  useEffect(() => {
    if (!map) return;
    const { naver } = window as any;

    const handleMapClick = (e: any) => {
      const { _lat: latitude, _lng: longitude } = e.coord;
      setLocation({ latitude, longitude });

      if (!markerRef.current) {
        markerRef.current = new naver.maps.Marker({
          position: e.coord,
          map,
        });
        return;
      }
      markerRef.current.setPosition(e.coord);
    };

    naver.maps.Event.addListener(map, 'click', handleMapClick);
  }, [map]);

  console.log(inputData);
  console.log('data', data);
  if (error) return <div>{error}</div>;
  return (
    <div className="h-screen bg-lightgray z-20">
      <form
        className="fixed left-10 right-10 top-10 bottom-10 my-auto  flex flex-col justify-center items-center p-8 bg-white rounded-3xl shadow-2xl"
        onSubmit={handleSubmit}
      >
        <Typography variant="h6">새로운 거래</Typography>
        <div className="flex flex-col justify-between w-full h-28 py-4 mt-3">
          <Input
            placeholder="거래 품목"
            fullWidth
            onChange={handleChange}
            value={inputData.title}
            name="title"
          />
          <Input
            type="datetime-local"
            fullWidth
            onChange={handleChange}
            value={inputData.reserved_time}
            name="reserved_time"
          />
        </div>
        <div id="map" className="relative w-full h-44 m-8 bg-white">
          {loading && <Skeleton />}
        </div>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </form>
    </div>
  );
}

export default CreateRoomModal;
