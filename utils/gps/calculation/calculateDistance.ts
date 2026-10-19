type Coordinate = {
  latitude: number;
  longitude: number;
};

export function calculateDistance(
  previousPoint: Coordinate,
  currentPoint: Coordinate,
): number {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

  const lat1 = toRadians(previousPoint.latitude);
  const lon1 = toRadians(previousPoint.longitude);
  const lat2 = toRadians(currentPoint.latitude);
  const lon2 = toRadians(currentPoint.longitude);

  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return 6_371_000 * c; // metres
}