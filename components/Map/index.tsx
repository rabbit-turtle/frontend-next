import Head from 'next/head';
import Image from 'next/image';
import Typography from '@material-ui/core/Typography';
import Skeleton from 'components/Skeleton';
import NavigationBar from 'components/NavigationBar';
import ProgressBar from 'components/ProgressBar';
import { ICoords } from 'types';

interface IMap {
  loading: boolean;
  title: string;
  minuteLeft: number;
  currentLocation: ICoords;
  received: string;
  distanceProgress: [number, number];
}

function Map({ loading, title, minuteLeft, currentLocation, received, distanceProgress }: IMap) {
  return (
    <div className="relative flex flex-col justify-between h-screen overflow-hidden">
      <Head>
        <title>{title}</title>
      </Head>
      <NavigationBar title={title} />
      {minuteLeft >= 60 ? (
        <div className="relative flex justify-center items-center h-8">
          <span className="z-10 text-primary-dark">
            <Typography variant="subtitle2">
              아직 약속 시간이 되려면 한참 멀었네요! 조금 더 쉬어도 되겠어요~🥕
            </Typography>
          </span>
          <div className="absolute -bottom-3 animate-running z-0">
            <Image src="/images/turtle.png" alt="running-turtle" width="20" height="20" />
          </div>
        </div>
      ) : (
        <ProgressBar type="time" value={minuteLeft} />
      )}
      <div className="relative flex flex-col flex-grow">
        <div id="map" className="flex-grow z-0"></div>
        {loading && <Skeleton />}
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
