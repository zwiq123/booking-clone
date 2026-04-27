export const calculateRoughRadius = (latitude: number, longitude: number, radius: number) => {
    const kmPerDegree = 111; // estimate
    const latitudeDelta = radius / kmPerDegree;
    const longitudeDelta = radius / (kmPerDegree * Math.cos(latitude * (Math.PI / 180)));

    return {
        latitude: {gte: latitude - latitudeDelta, lte: latitude + latitudeDelta},
        longitude: {gte: longitude - longitudeDelta, lte: longitude + longitudeDelta}
    }
}