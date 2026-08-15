

type CoordinateDistanceInput = {
    lat1: number;
    lon1: number;
    lat2: number;
    lon2: number;
};

export const coordinateDistance = ({ lat1, lon1, lat2, lon2 }: CoordinateDistanceInput): number => {
    const radLat1 = lat1 * Math.PI / 180;
    const radLon1 = lon1 * Math.PI / 180;
    const radLat2 = lat2 * Math.PI / 180;
    const radLon2 = lon2 * Math.PI / 180;

    const R = 6_371_000;

    const dLat = radLat2 - radLat1;
    const dLon = radLon2 - radLon1;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(radLat1) * Math.cos(radLat2) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
}