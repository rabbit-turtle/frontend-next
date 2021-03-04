import Skeleton from 'components/Skeleton';

interface IMap {
  loading: boolean;
}

function Map({ loading }: IMap) {
  return (
    <div className="relative flex flex-col flex-grow">
      <div id="map" className="flex-grow z-0"></div>
      {loading && <Skeleton />}
    </div>
  );
}

export default Map;
