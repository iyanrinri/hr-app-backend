# Location-Based Attendance Validation

Implementasi validasi lokasi untuk fitur check-in/check-out berdasarkan koordinat dan radius yang telah dikonfigurasi.

## Fitur

- **Location Checkpoint**: Validasi lokasi pengguna dengan titik koordinat kantor
- **Radius Validation**: Cek apakah pengguna berada dalam radius yang diizinkan
- **Error Messages**: Pesan error dalam Bahasa Indonesia yang informatif
- **Flexible Configuration**: Dapat diaktifkan/nonaktifkan melalui settings

## Settings yang Diperlukan

Berikut settings yang perlu dikonfigurasi di database:

| Setting Key | Type | Default | Deskripsi |
|-------------|------|---------|-----------|
| `attendance_checkpoint_enabled` | BOOLEAN | false | Mengaktifkan/menonaktifkan validasi lokasi |
| `attendance_checkpoint_lat` | STRING | '' | Latitude koordinat kantor (contoh: -6.2088) |
| `attendance_checkpoint_lng` | STRING | '' | Longitude koordinat kantor (contoh: 106.8456) |
| `attendance_checkpoint_radius` | INTEGER | 100 | Radius dalam meter yang diizinkan |
| `attendance_checkpoint_address` | STRING | '' | Alamat kantor (opsional untuk referensi) |

## Cara Kerja

### 1. Validasi Koordinat Input
```typescript
// Cek apakah koordinat valid (-90 <= lat <= 90, -180 <= lng <= 180)
if (!isValidCoordinates(latitude, longitude)) {
  throw new BadRequestException('Koordinat lokasi tidak valid');
}
```

### 2. Cek Konfigurasi
```typescript
// Ambil pengaturan attendance dari database
const attendanceSettings = await this.settingsService.getAttendanceSettings();

// Jika checkpoint disabled, skip validasi
if (!attendanceSettings.checkPointEnabled) {
  return; // Validasi dilewati
}
```

### 3. Validasi Koordinat Kantor
```typescript
// Cek apakah koordinat kantor sudah dikonfigurasi
if (
  attendanceSettings.checkPointLatitude === null || 
  attendanceSettings.checkPointLongitude === null
) {
  throw new BadRequestException('Lokasi checkpoint belum dikonfigurasi oleh admin');
}
```

### 4. Perhitungan Jarak
```typescript
// Menggunakan Haversine formula untuk menghitung jarak
const distance = calculateDistance(
  userLatitude, userLongitude,
  officeLatitude, officeLongitude
);
```

### 5. Validasi Radius
```typescript
if (distance <= radiusInMeters) {
  // Lokasi valid - dalam radius
  return { isValid: true, distance };
} else {
  // Lokasi tidak valid - di luar radius
  return {
    isValid: false,
    distance,
    message: `Anda berada di luar area yang diizinkan. Jarak Anda: ${distance} meter dari kantor, maksimal yang diizinkan: ${radiusInMeters} meter`
  };
}
```

## Integration Points

### 1. Clock In
- Validasi lokasi dilakukan **sebelum** pengecekan hari kerja
- Jika validasi gagal, clock-in dibatalkan dengan error message
- Lokasi yang valid disimpan dalam `checkInLocation`

### 2. Clock Out
- Validasi lokasi dilakukan **sebelum** pengecekan status clock-in
- Jika validasi gagal, clock-out dibatalkan dengan error message  
- Lokasi yang valid disimpan dalam `checkOutLocation`

## Error Messages

| Kondisi | Error Message |
|---------|---------------|
| Koordinat tidak valid | "Koordinat lokasi tidak valid" |
| Checkpoint belum dikonfigurasi | "Lokasi checkpoint belum dikonfigurasi oleh admin" |
| Di luar radius | "Anda berada di luar area yang diizinkan. Jarak Anda: X meter dari kantor, maksimal yang diizinkan: Y meter" |

## Contoh Penggunaan

### Setup Settings
```sql
-- Aktifkan location validation
INSERT INTO settings (key, value, category, description, data_type, is_public) 
VALUES ('attendance_checkpoint_enabled', 'true', 'ATTENDANCE', 'Enable location-based check point', 'BOOLEAN', false);

-- Set koordinat kantor (contoh: Jakarta)
INSERT INTO settings (key, value, category, description, data_type, is_public) 
VALUES ('attendance_checkpoint_lat', '-6.2088', 'ATTENDANCE', 'Check point latitude', 'STRING', false);

INSERT INTO settings (key, value, category, description, data_type, is_public) 
VALUES ('attendance_checkpoint_lng', '106.8456', 'ATTENDANCE', 'Check point longitude', 'STRING', false);

-- Set radius 100 meter
INSERT INTO settings (key, value, category, description, data_type, is_public) 
VALUES ('attendance_checkpoint_radius', '100', 'ATTENDANCE', 'Check point radius in meters', 'INTEGER', false);
```

### API Request
```json
{
  "latitude": -6.2088,
  "longitude": 106.8456,
  "address": "Jl. Sudirman No. 1, Jakarta",
  "notes": "Starting work"
}
```

### Successful Response
```json
{
  "status": "success",
  "message": "Successfully clocked in",
  "log": { /* attendance log data */ },
  "attendance": { /* attendance data */ }
}
```

### Error Response (Outside Radius)
```json
{
  "statusCode": 400,
  "message": "Anda berada di luar area yang diizinkan. Jarak Anda: 150 meter dari kantor, maksimal yang diizinkan: 100 meter",
  "error": "Bad Request"
}
```

## Implementation Files

- **Utility**: `src/common/utils/location.util.ts`
- **Service Update**: `src/modules/attendance/services/attendance.service.ts`
- **Module Update**: `src/modules/attendance/attendance.module.ts`
- **Settings**: `src/modules/settings/services/settings.service.ts`

## Testing

Untuk testing manual:
1. Set settings dengan koordinat dan radius yang sesuai
2. Test clock-in/out dengan koordinat dalam radius
3. Test clock-in/out dengan koordinat di luar radius
4. Verify error messages sesuai ekspektasi