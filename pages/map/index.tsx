import React, { useEffect, useState } from "react";
import Head from "next/head";
import Button from "@material-ui/core/Button";

function Map() {
  const [map, setMap] = useState();

  useEffect(() => {
    const { naver } = window as any;
    const map = new naver.maps.Map("map", {
      center: new naver.maps.LatLng(37.35345, 127.105399),
      zoom: 10,
    });
    setMap(map);
  }, []);

  return (
    <>
      <Head>
        <title>지도</title>
        <script
          type="text/javascript"
          src="https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=92jofzh151"></script>
      </Head>
      <Button variant="contained" color="primary">
        버튼
      </Button>
      <Button variant="contained" color="secondary">
        버튼
      </Button>
      <Button variant="contained" color="primary">
        버튼
      </Button>
      <Button variant="contained" color="primary">
        버튼
      </Button>
      <div id="map" className="h-full"></div>
    </>
  );
}

export default Map;
