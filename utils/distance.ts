interface IgetDistancefromCoords {
  lat1: number;
  lat2: number;
  lng1: number;
  lng2: number;
}

const degToRad = (degree: number): number => {
  return degree * (Math.PI / 180);
};

export const getDistancefromCoords = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number => {
  const R = 6371; // Radius of the earth(km)
  const dLat = degToRad(lat2 - lat1);
  const dLng = degToRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
