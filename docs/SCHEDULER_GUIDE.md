# Attendance Period Scheduler

Sistem scheduler otomatis untuk mengatur status attendance periods berdasarkan tanggal mulai dan berakhir.

## Fitur Scheduler

### 1. **Automatic Period Status Management**
- Otomatis menonaktifkan periods yang sudah lewat waktu
- Otomatis mengaktifkan periods yang sudah waktunya dimulai
- Logging lengkap untuk setiap perubahan status

### 2. **Scheduled Jobs**

#### Hourly Check (Setiap Jam)
```typescript
@Cron(CronExpression.EVERY_HOUR)
async checkExpiredPeriods()
```
- Mengecek periods yang sudah lewat `endDate` tapi masih `isActive: true`
- Otomatis set menjadi `isActive: false`
- Berjalan setiap jam sekali

#### Daily Check (Setiap Hari Tengah Malam)
```typescript
@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
async checkPeriodsToActivate()
```
- Mengecek periods yang sudah lewat `startDate` dan belum lewat `endDate` tapi masih `isActive: false`
- Otomatis set menjadi `isActive: true`
- Berjalan setiap hari jam 00:00

### 3. **Manual API Endpoints**

#### Trigger Manual Check
```http
POST /attendance-periods/scheduler/run-check
```
**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "status": "success",
  "message": "Period status check completed", 
  "timestamp": "2025-12-06T11:05:53.000Z"
}
```

#### Get Scheduler Statistics
```http
GET /attendance-periods/scheduler/stats
```
**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "totalActive": 3,
    "totalInactive": 2, 
    "currentlyValidActive": 1,
    "expiredButStillActive": 0,
    "shouldBeActiveButInactive": 0,
    "lastChecked": "2025-12-06T11:05:53.000Z"
  }
}
```

## Implementasi

### 1. **Service Class: AttendancePeriodScheduler**

```typescript
@Injectable()
export class AttendancePeriodScheduler {
  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async checkExpiredPeriods() {
    // Logic untuk menonaktifkan periods yang expired
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT) 
  async checkPeriodsToActivate() {
    // Logic untuk mengaktifkan periods yang sudah waktunya
  }
}
```

### 2. **Logging System**
Scheduler menggunakan NestJS Logger untuk mencatat:
- Jumlah periods yang diupdate
- Detail setiap period yang berubah status
- Error handling jika ada masalah

### 3. **Database Query Logic**

#### Expired Periods Query:
```sql
SELECT * FROM attendance_periods 
WHERE isActive = true 
AND endDate < NOW()
```

#### Periods to Activate Query:
```sql
SELECT * FROM attendance_periods 
WHERE isActive = false 
AND startDate <= NOW() 
AND endDate >= NOW()
```

## Benefits

### ✅ **Automation**
- Tidak perlu manual update status periods
- Mengurangi human error
- Konsisten dan reliable

### ✅ **Real-time Accuracy**
- Status periods selalu akurat dengan tanggal actual
- Attendance system otomatis menggunakan period yang benar
- Mencegah clock-in/out di period yang sudah expired

### ✅ **Monitoring & Debugging**
- Stats API untuk monitoring kondisi periods
- Manual trigger untuk testing dan emergency fixes
- Comprehensive logging untuk audit trail

### ✅ **Performance**
- Query yang optimized untuk check status
- Minimal database impact
- Batched updates untuk efficiency

## Authorization

- **Role Required**: `SUPER` atau `HR` 
- **Authentication**: JWT Bearer Token
- **Endpoints**: Protected dengan `@ApiSecurity('JWT-auth')`

## Cara Penggunaan

1. **Setup Otomatis**: Scheduler berjalan otomatis setelah aplikasi start
2. **Monitor via API**: Gunakan `/attendance-periods/scheduler/stats` untuk cek status
3. **Manual Trigger**: Gunakan `/attendance-periods/scheduler/run-check` jika perlu force update
4. **Check Logs**: Monitor console logs untuk melihat aktivitas scheduler

## Contoh Log Output

```
[AttendancePeriodScheduler] Checking for expired attendance periods...
[AttendancePeriodScheduler] Found 2 expired periods to deactivate
[AttendancePeriodScheduler] Successfully deactivated 2 attendance periods
[AttendancePeriodScheduler] Deactivated period: "Q4 2024" (ID: 1) - expired on 2024-12-31T23:59:59.000Z
[AttendancePeriodScheduler] Deactivated period: "H1 2024" (ID: 2) - expired on 2024-06-30T23:59:59.000Z
```

Dengan scheduler ini, sistem attendance akan selalu memiliki period status yang akurat dan up-to-date secara otomatis! 🚀