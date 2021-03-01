import Skeleton from 'components/Skeleton';

interface IMap {
  loading: boolean;
}

function Map({ loading }: IMap) {
  return (
    <div className="relative flex flex-col flex-grow h-screen">
      <div id="map" className="flex-grow"></div>
      {loading && <Skeleton />}
    </div>
  );
}

export default Map;
