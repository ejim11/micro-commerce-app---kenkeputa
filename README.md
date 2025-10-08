# Micro-Commerce App

A full-stack e-commerce application with a Flutter mobile client and NestJS backend server.

## Table of Contents

- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Known Limitations](#known-limitations)

## Technology Stack

### Backend (Server)

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: TypeORM (ORM)
- **Runtime**: Node.js
- **Documentation**: Swagger/OpenAPI

### Frontend (Client)

- **Framework**: Flutter
- **Language**: Dart

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Flutter SDK** (latest stable version)
- **Dart SDK** (comes with Flutter)
- **Git**
- **Database** (PostgreSQL/MySQL - check server configuration)

## Project Structure

```
micro-commerce/
├── client/          # Flutter mobile application
│   ├── lib/
│   ├── pubspec.yaml
│   └── ...
├── server/          # NestJS backend API
│   ├── src/
│   ├── package.json
│   ├── nest-cli.json
│   └── ...
└── README.md
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd micro-commerce
```

### 2. Backend Setup (Server)

#### Install Dependencies

```bash
cd server
npm i --legacy-peer-deps
```

> **Note**: The `--legacy-peer-deps` flag is required to handle peer dependency conflicts.

#### Run Database Migrations

```bash
npm run typeorm:migrate:run
```

This will:

- Create necessary database tables
- Run the seed file to populate initial data

#### Start the Development Server

```bash
npm run start:dev
```

The server will start on `http://localhost:3001`

#### Access Documentation

- **API Documentation (Swagger)**: http://localhost:3001/api-doc
- **Code Documentation**: http://127.0.0.1:3003/

### 3. Frontend Setup (Client)

Open a new terminal window:

```bash
cd client
flutter pub get
flutter run
```

Select your target device (emulator/simulator or physical device) when prompted.

## API Documentation

### Base URL

```
http://localhost:3001/api/v1
```

### Endpoints

#### User Registration

Creates a new user account.

**Endpoint**: `POST /users`

**Headers**:

```
Content-Type: application/json
Accept: */*
```

**Request Body**:

```json
{
  "firstname": "Ejim",
  "lastname": "Favour",
  "email": "favor@gmail.com",
  "password": "@LordJimmy989"
}
```

**Success Response** (201 Created):

```json
{
  "apiVersion": "1.0.0",
  "data": {
    "id": "df2212c2-390a-4bbb-adff-b65fd1afb39a",
    "firstname": "Ejim",
    "lastname": "Favour",
    "email": "favor@gmail.com",
    "role": "user",
    "createdAt": "2025-10-08T09:42:43.562Z"
  }
}
```

**Example cURL Request**:

```bash
curl -X POST http://localhost:3001/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "firstname": "Ejim",
    "lastname": "Favour",
    "email": "favor@gmail.com",
    "password": "@LordJimmy989"
  }'
```

**Response Fields**:

- `apiVersion`: API version number
- `data.id`: Unique user identifier (UUID)
- `data.firstname`: User's first name
- `data.lastname`: User's last name
- `data.email`: User's email address
- `data.role`: User role (default: "user")
- `data.createdAt`: Account creation timestamp (ISO 8601)

> **Note**: For complete API documentation with all available endpoints, visit the Swagger documentation at http://localhost:3001/api-doc after starting the server.

## Known Limitations

### Backend

- **Peer Dependencies**: Requires `--legacy-peer-deps` flag during installation due to dependency version conflicts
- **Database**: Must be configured and running before starting the server
- **Migration**: Database migrations must be run manually before first use

### Frontend

- **Platform Support**: Development and testing may vary across iOS, Android, and web platforms
- **API Connection**: Hardcoded to `localhost:3001` - needs configuration for production deployment

### General

- **Environment Variables**: May require additional `.env` configuration (check server folder for `.env.example`)
- **Documentation Ports**: Code documentation server (port 3003) may conflict with other services
- **CORS**: Currently configured for development with `access-control-allow-origin: *`

## Troubleshooting

### Server won't start

- Ensure database is running and accessible
- Check if port 3001 is available
- Verify all environment variables are set correctly

### Client won't build

- Run `flutter doctor` to check for missing dependencies
- Clear build cache: `flutter clean && flutter pub get`
- Ensure Flutter SDK is up to date

### Migration errors

- Check database connection settings
- Ensure database exists and user has proper permissions
- Try dropping and recreating the database (⚠️ data loss)

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the [LICENSE NAME] - see the LICENSE.md file for details.

## Support

For issues and questions:

- Open an issue on GitHub
- Check the API documentation at http://localhost:3001/api-doc
- Review code documentation at http://127.0.0.1:3003/
