# HR App Backend

A comprehensive Human Resources management system backend built with NestJS, Prisma, and PostgreSQL. This application provides complete employee management, authentication, and role-based access control for HR operations.

## 🚀 Features

- **🔐 Authentication & Authorization**
  - JWT-based authentication with refresh tokens
  - Role-based access control (SUPER, ADMIN, HR, MANAGER, EMPLOYEE)
  - Secure password hashing with bcrypt
  - Protected routes with guards

- **👥 User Management**
  - User registration and login
  - Role management (SUPER users only)
  - User profile management
  - Email uniqueness validation

- **👤 Employee Management**
  - Full CRUD operations for employees
  - Role-based access restrictions (HR can only manage non-admin roles)
  - Pagination support with flexible queries
  - Data serialization for BigInt and Decimal types
  - Self-protection (users cannot delete their own records)

- **🛡️ Security Features**
  - Protected endpoints with JWT guards
  - Role-based authorization
  - Input validation with class-validator
  - Comprehensive error handling
  - Audit trails for sensitive operations

## 🛠️ Tech Stack

- **Framework**: NestJS (Node.js framework)
- **Database**: PostgreSQL with connection pooling
- **ORM**: Prisma (type-safe database client)
- **Auth**: JWT with Passport.js
- **Validation**: class-validator & class-transformer
- **Documentation**: Swagger/OpenAPI 3.0
- **Language**: TypeScript (strict mode)
- **Serialization**: Custom interceptors for BigInt/Decimal

## 📁 Project Structure

```
src/
├── common/              # Shared utilities
│   ├── decorators/      # Custom decorators (Roles, etc.)
│   ├── filters/         # Exception filters
│   ├── guards/          # Authentication guards
│   ├── interceptors/    # Response interceptors
│   └── utils/           # Utility functions
├── config/              # Configuration modules
├── database/            # Database connection & Prisma service
│   ├── database.module.ts
│   └── prisma.service.ts
├── modules/             # Feature modules
│   ├── auth/           # ✅ Authentication & JWT
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── dto/
│   │   ├── guards/
│   │   └── strategies/
│   ├── employee/       # ✅ Employee management
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   └── dto/
│   ├── roles/          # ✅ Role management (SUPER only)
│   │   ├── controllers/
│   │   ├── services/
│   │   └── dto/
│   ├── salary/         # ✅ Salary & salary history management
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   └── dto/
│   ├── overtime/       # ✅ Overtime request & approval system
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   └── dto/
│   ├── payroll/        # ✅ Payroll processing with overtime integration
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   └── dto/
│   ├── attendance/     # 🔄 (Future implementation)
│   └── leave/          # 🔄 (Future implementation)
├── prisma/             # Database schema & migrations
│   ├── schema.prisma
│   └── seed.ts
└── main.ts             # Application entry point
```

## 📋 Prerequisites

Before running this application, ensure you have:

- **Node.js** v18+ 
- **npm** or **yarn**
- **PostgreSQL** v12+ database
- **Git** for version control

## 🔧 Installation & Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd hr-app-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration

Create `.env` file in root directory:
```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/hr_app_db"

# JWT Configuration  
JWT_SECRET="your-super-secure-jwt-secret-key-min-32-chars"

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 4. Database Setup

**Start PostgreSQL with Docker:**
```bash
docker-compose up -d
```

**Check container status:**
```bash
docker-compose ps
```

**Generate Prisma Client:**
```bash
npx prisma generate
```

**Apply Database Schema:**
```bash
# Development (quick setup)
npx prisma db push

# Production (with migrations)
npx prisma migrate dev --name init
```

### 5. Seed Initial Data

```bash
npx prisma db seed
```

**Default seeded users:**
- **Admin**: `admin@company.com` / `admin123` (SUPER role)
- **HR User**: `hr@company.com` / `passwordhr123` (HR role)
- **Sample Employees**: Various test employees

### 6. Start Application

**Development Mode (with hot reload):**
```bash
npm run start:dev
```

**Production Build & Start:**
```bash
npm run build
npm run start:prod
```

**Other useful commands:**
```bash
npm run start           # Standard start
npm run start:debug     # Debug mode
npm run lint           # ESLint check
npm run test           # Unit tests
npm run test:e2e       # End-to-end tests
```

### 7. Verify Setup

### 7. Verify Setup

✅ **API Documentation:** http://localhost:3000/api  
✅ **Health Check:** http://localhost:3000/  
✅ **Database Studio:** `npx prisma studio` (http://localhost:5555)

---

## 📚 API Documentation

Once the application is running, access Swagger UI at:
```
http://localhost:3000/api
```

### Authentication Flow

**1. Register new user:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@company.com",
    "password": "securepassword123",
    "name": "New User"
  }'
```

**2. Login to get JWT token:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@company.com",
    "password": "admin123"
  }'
```

**3. Use token in subsequent requests:**
```bash
curl -X GET http://localhost:3000/employees \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔒 Role-Based Access Control (RBAC)

### Role Hierarchy
- **SUPER** - System administrator, full access
- **ADMIN** - Organization admin
- **HR** - Human resources management  
- **MANAGER** - Team management
- **EMPLOYEE** - Basic user access

### Permission Matrix

| Action | SUPER | ADMIN | HR | MANAGER | EMPLOYEE |
|--------|-------|-------|----|---------| ---------|
| User Management | ✅ | ❌ | ❌ | ❌ | ❌ |
| Role Management | ✅ | ❌ | ❌ | ❌ | ❌ |
| Employee CRUD | ✅ | ✅ | ✅ | ❌ | ❌ |
| View All Employees | ✅ | ✅ | ✅ | ✅ | ❌ |
| Edit Own Profile | ✅ | ✅ | ✅ | ✅ | ✅ |
| Delete Users | ✅ | ❌ | ❌ | ❌ | ❌ |

### API Endpoint Restrictions

**Employee Module:**
- `GET /employees` - SUPER, ADMIN, HR, MANAGER
- `POST /employees` - SUPER, ADMIN, HR
- `PATCH /employees/:id` - SUPER, ADMIN, HR*
- `DELETE /employees/:id` - SUPER, ADMIN

**Roles Module:**
- All endpoints - SUPER only

**Auth Module:**
- `POST /auth/login` - Public
- `POST /auth/register` - Public  
- `GET /auth/profile` - Authenticated users

*HR can only edit users below HR level (MANAGER, EMPLOYEE)

## 📊 Available Endpoints

### Auth Module ✅
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/profile` - Get current user profile

### Employee Module ✅
- `POST /employees` - Create new employee  
- `GET /employees` - Get all employees (with pagination)
- `GET /employees/:id` - Get employee by ID
- `PATCH /employees/:id` - Update employee
- `DELETE /employees/:id` - Delete employee

### Roles Module ✅
- `GET /roles/users` - List all users (SUPER only)
- `PATCH /roles/users/:id` - Update user role (SUPER only)
- `DELETE /roles/users/:id` - Delete user (SUPER only)

### Pagination Example
```bash
# Get paginated employees (10 per page)
curl -X GET "http://localhost:3000/employees?paginated=1&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🗄️ Database Schema

### Core Models

**User** (Authentication & Authorization)
```prisma
model User {
  id        BigInt   @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String
  role      Role     @default(EMPLOYEE)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  employee  Employee?
}
```

**Employee** (HR Management)
```prisma
model Employee {
  id           BigInt    @id @default(autoincrement())
  userId       BigInt?   @unique
  employeeId   String    @unique
  firstName    String
  lastName     String
  email        String    @unique
  password     String
  phone        String?
  address      String?
  position     String
  department   String
  salary       Decimal
  startDate    DateTime
  endDate      DateTime?
  isActive     Boolean   @default(true)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  user         User?     @relation(fields: [userId], references: [id])
}
```

### Roles Available
```typescript
enum Role {
  SUPER
  ADMIN
  HR  
  MANAGER
  EMPLOYEE
}
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests  
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode (development)
npm run test:watch
```

## 🔧 Deployment

### Environment Variables
Create `.env.production`:
```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/hr_app_prod"

# JWT
JWT_SECRET="your-super-secure-production-jwt-secret"
JWT_EXPIRES_IN="24h"

# Application  
PORT=3000
NODE_ENV="production"
```

### Docker Production Deployment
```bash
# Build application image
docker build -t hr-app-backend .

# Production deployment
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Production Setup
```bash
# Install dependencies
npm ci --only=production

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Build application
npm run build

# Start production server
npm run start:prod
```

## 🛠️ Database Management

### Prisma Studio
```bash
npx prisma studio
# Access: http://localhost:5555
```

### Database Operations
```bash
# Reset database (⚠️ Development only!)
npx prisma migrate reset

# Re-seed initial data
npx prisma db seed

# Create new migration
npx prisma migrate dev --name "your_migration_name"

# Deploy migrations to production
npx prisma migrate deploy
```

## 🔍 Troubleshooting

### Common Issues

**1. Database Connection Failed**
- Check PostgreSQL status: `docker-compose ps`
- Verify DATABASE_URL in `.env`
- Ensure database exists and credentials are correct

**2. Prisma Client Errors**
- Regenerate client: `npx prisma generate`
- Check `schema.prisma` syntax
- Verify database schema is synchronized

**3. Authentication Issues**
- Verify JWT_SECRET is set in `.env`
- Check token expiration settings
- Ensure user has proper role permissions

**4. Port Already in Use**
```bash
# Find process using port 3000
lsof -ti:3000 | xargs kill -9

# Or change port in .env
PORT=3001
```

**5. Docker Issues**
```bash
# Restart containers
docker-compose down && docker-compose up -d

# View container logs
docker-compose logs -f postgres

# Clean up Docker resources
docker system prune -a
```

### Debug Mode
```bash
# Start with debug logging
npm run start:debug

# Enable all debug output
DEBUG=* npm run start:dev
```

## 📋 Development Guidelines

### Code Structure
- Follow NestJS modular architecture
- Use DTOs for input validation
- Implement proper error handling
- Add Swagger documentation for new endpoints

### Adding New Modules
```bash
# Generate new module
nest g module modules/your-module
nest g controller modules/your-module/controllers/your-module
nest g service modules/your-module/services/your-module
```

### Database Changes
1. Update `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name "description"`
3. Update seed data if needed
4. Generate new Prisma client

## 📞 Support & Contributing

- **Issues**: Create GitHub issue with detailed error information
- **API Documentation**: Available at `/api` endpoint
- **Database Inspection**: Use Prisma Studio
- **Error Logs**: Check application console output

### Development Workflow
1. Create feature branch from `main`
2. Follow existing code patterns and conventions
3. Add tests for new functionality
4. Update documentation as needed
5. Submit pull request with clear description

---

**🎉 Your HR Management System is ready for production!**  
Access the complete API documentation at http://localhost:3000/api
