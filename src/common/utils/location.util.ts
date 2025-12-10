/**
 * Location utility functions for distance calculation and location validation
 */

/**
 * Calculate the distance between two coordinates using the Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in meters
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in meters
  return Math.round(distance);
}

/**
 * Format distance for human readable display
 * @param meters Distance in meters
 * @returns Formatted distance string
 */
function formatDistance(meters: number): string {
  if (meters >= 1000) {
    const km = (meters / 1000).toFixed(1);
    return `${km} km`;
  }
  return `${meters} meter`;
}

/**
 * Check if a given coordinate is within the specified radius of a checkpoint
 * @param userLat User's latitude
 * @param userLon User's longitude
 * @param checkpointLat Checkpoint latitude
 * @param checkpointLon Checkpoint longitude
 * @param radiusInMeters Allowed radius in meters
 * @returns Object containing validation result and distance
 */
export function validateLocation(
  userLat: number,
  userLon: number,
  checkpointLat: number,
  checkpointLon: number,
  radiusInMeters: number,
): { isValid: boolean; distance: number; message?: string } {
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

/**
 * Validate if coordinates are valid latitude and longitude values
 * @param lat Latitude
 * @param lon Longitude
 * @returns true if coordinates are valid
 */
export function isValidCoordinates(lat: number, lon: number): boolean {
  return (
    typeof lat === 'number' &&
    typeof lon === 'number' &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180 &&
    !isNaN(lat) &&
    !isNaN(lon)
  );
}