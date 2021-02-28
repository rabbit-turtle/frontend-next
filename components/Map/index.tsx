import Skeleton from 'components/Skeleton';

interface IMap {
  loading: boolean;
}

function Map({ loading }: IMap) {
  return (
    <div className="flex flex-col h-screen">
      <div className="relative flex flex-grow">
        <div id="map" className="flex-grow"></div>
        {loading && <Skeleton />}
      </div>
    </div>
  );
}

export default Map;
