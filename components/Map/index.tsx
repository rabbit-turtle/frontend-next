import Head from 'next/head';
import Image from 'next/image';
import Typography from '@material-ui/core/Typography';
import { TimeOutline } from 'react-ionicons';
import Skeleton from 'components/Skeleton';
import NavigationBar from 'components/NavigationBar';
import ProgressBar from 'components/ProgressBar';
import { ICoords } from 'types';

interface IMap {
  isMapLoading: boolean;
  title: string;
  minuteLeft: number;
  currentLocation: ICoords;
  received: string;
  distanceProgress: [number, number];
}

function Map({
  isMapLoading,
  title,
  minuteLeft,
  currentLocation,
  received,
  distanceProgress,
}: IMap) {
  return (
    <div className="relative flex flex-col justify-between h-screen overflow-hidden">
      <Head>
        <title>{title}</title>
      </Head>
      <NavigationBar title={title} />
      <div className="relative flex justify-center items-center h-8">
        <div className="absolute -bottom-3 animate-running z-0">
          <Image src="/images/turtle.png" alt="running-turtle" width="20" height="20" />
        </div>
        <TimeOutline color="#ffcdd2" rotate />
        {minuteLeft >= 60 ? (
          <span className="z-10 text-primary-dark pl-2">
            <Typography variant="subtitle2">약속 시간까지 한시간 이상 남았어요!</Typography>
          </span>
        ) : (
          <span className="pl-2 text-primary-dark"> 약속 시간까지 {minuteLeft} 분 남았어요!</span>
        )}
      </div>
      <div className="relative flex flex-col flex-grow">
        <div id="map" className="flex-grow z-0"></div>
        {isMapLoading && <Skeleton />}
      </div>
      {currentLocation && received && (
        <div className="sticky bottom-0 bg-white z-10">
          <ProgressBar type="distance" value={distanceProgress} />
        </div>
      )}
    </div>
  );
}

export default Map;
