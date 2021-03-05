import Head from 'next/head';
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
      <ProgressBar type="time" value={minuteLeft} />
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
