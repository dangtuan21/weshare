const calculateFreight = (
  baseFare,
  timeRate,
  time,
  distanceRate,
  distance,
  surge,
) => {
  const distanceInKm = (distance * 0.001) / 0.621371;
  const timeInMin = time * 0.0166667;
  const pricePerKm = timeRate * timeInMin;
  const pricePerMinute = distanceRate * distanceInKm;
  const totalFare = (baseFare + pricePerKm + pricePerMinute) * surge;
  return Math.round(totalFare);
};

export default calculateFreight;
