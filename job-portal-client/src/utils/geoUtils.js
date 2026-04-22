// Haversine distance in km between two [lat, lng] points
export const haversineDistance = (coord1, coord2) => {
  if (!coord1 || !coord2) return null;
  const R = 6371;
  const dLat = ((coord2[0] - coord1[0]) * Math.PI) / 180;
  const dLng = ((coord2[1] - coord1[1]) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((coord1[0] * Math.PI) / 180) *
      Math.cos((coord2[0] * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// Estimate travel time in minutes (avg 40 km/h by road ~1.4x crow-fly)
export const estimateTravelTime = (distKm) => {
  if (distKm === null || distKm === undefined) return null;
  const roadDist = distKm * 1.4;
  const mins = Math.round((roadDist / 40) * 60);
  if (mins < 60) return `~${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `~${h}h ${m > 0 ? m + 'min' : ''}`;
};
