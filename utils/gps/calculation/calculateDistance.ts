type Coordinate = {
    latitude: number,
    longitude: number
}

export function calculateDistance(previousPoint: Coordinate,currentPoint: Coordinate){
    const radLat1 = previousPoint.latitude * Math.PI / 180;
    const radLon1 = previousPoint.longitude * Math.PI / 180;
    const radLat2 = currentPoint.latitude * Math.PI / 180;
    const radLon2 = currentPoint.longitude * Math.PI / 180;

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