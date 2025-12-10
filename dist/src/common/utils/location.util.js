"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDistance = calculateDistance;
exports.validateLocation = validateLocation;
exports.isValidCoordinates = isValidCoordinates;
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Math.round(distance);
}
function formatDistance(meters) {
    if (meters >= 1000) {
        const km = (meters / 1000).toFixed(1);
        return `${km} km`;
    }
    return `${meters} meter`;
}
function validateLocation(userLat, userLon, checkpointLat, checkpointLon, radiusInMeters) {
    const distance = calculateDistance(userLat, userLon, checkpointLat, checkpointLon);
    if (distance <= radiusInMeters) {
        return {
            isValid: true,
            distance,
        };
    }
    const userDistanceFormatted = formatDistance(distance);
    const maxDistanceFormatted = formatDistance(radiusInMeters);
    return {
        isValid: false,
        distance,
        message: `Anda berada di luar area yang diizinkan. Jarak Anda: ${userDistanceFormatted} dari kantor, maksimal yang diizinkan: ${maxDistanceFormatted}`,
    };
}
function isValidCoordinates(lat, lon) {
    return (typeof lat === 'number' &&
        typeof lon === 'number' &&
        lat >= -90 &&
        lat <= 90 &&
        lon >= -180 &&
        lon <= 180 &&
        !isNaN(lat) &&
        !isNaN(lon));
}
//# sourceMappingURL=location.util.js.map