export declare function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number;
export declare function validateLocation(userLat: number, userLon: number, checkpointLat: number, checkpointLon: number, radiusInMeters: number): {
    isValid: boolean;
    distance: number;
    message?: string;
};
export declare function isValidCoordinates(lat: number, lon: number): boolean;
