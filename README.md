# What is this?

This is a booking.com clone (only backend) made with NodeJS, Express, TypeScript and PostgreSQL.

## Table of Contents

- [Features](#features)
- [Quick Start with Docker](#quick-start-with-docker)
- [Manual Setup](#manual-setup)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Database](#database)
- [Development](#development)

## Features

- **User Management**: Registration, authentication, profile management with JWT
- **Property Listings**: Create, update, delete properties with detailed information
- **Room Management**: Manage rooms within properties with beds, amenities, and pricing
- **Booking System**: Create bookings, manage reservations, and (fake) payment integration
- **Image Upload**: Upload and manage property images
- **Reviews & Ratings**: Leave reviews and ratings for properties
- **Amenities**: Categorized amenities for properties and rooms
- **Role-Based Access**: Different user roles (guest, host, admin)
- **Data Validation**: Type-safe request validation with Zod

## Quick Start with Docker

### Prerequisites

- Docker & Docker Compose installed
- (Optional) `.env` file for custom configuration

### Run with Docker

```bash
# Clone the repository
git clone https://github.com/zwiq123/booking-clone.git
cd booking-clone

# Start the application with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

The API will be available at `http://localhost:3000`

**Docker Setup Includes:**
- PostgreSQL database (port 5432)
- Node.js application (port 3000)
- Automatic database initialization and seeding

### Using Docker without Compose

```bash
# Build the image
docker build -t booking-clone .

# Run the container
docker run -p 3000:3000 --env-file .env booking-clone
```

## Manual Setup

### Prerequisites

- Node.js v18 or higher
- PostgreSQL v14 or higher
- npm or yarn package manager

### Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/zwiq123/booking-clone.git
cd booking-clone

# 2. Install dependencies
npm install

# 3. Generate Prisma client
npx prisma generate

# 4. Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# 5. Run database migrations
npx prisma migrate deploy

# 6. Seed the database with static data
npx prisma db seed

# 7. Start development server
npm run dev
```

The API will be available at `http://localhost:3000`

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/booking_clone

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Email (SMTP)
GMAIL_NAME=your-email@gmail.com
GMAIL_PASSWORD=your-app-specific-password

# Server
PORT=3000
NODE_ENV=development
```

### Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `your_random_secret_key` |
| `GMAIL_NAME` | SMTP email address for sending emails | `noreply@example.com` |
| `GMAIL_PASSWORD` | SMTP password or app-specific password | `xxxx xxxx xxxx xxxx` |
| `PORT` | Server port (optional) | `3000` |
| `NODE_ENV` | Environment (optional) | `development` or `production` |

## Project Structure

```
booking-clone/
├── src/
│   ├── server.ts                 # Express app setup
│   ├── controllers/              # Route handlers
│   │   ├── userController.ts
│   │   ├── propertyController.ts
│   │   ├── roomController.ts
│   │   ├── bookingController.ts
│   │   ├── reviewController.ts
│   │   ├── imageController.ts
│   │   ├── amenityController.ts
│   │   ├── bedController.ts
│   │   └── languageController.ts
│   ├── routes/                   # Route definitions
│   ├── middleware/               # Custom middleware
│   │   ├── auth.ts              # JWT authentication
│   │   ├── fileUpload.ts        # Multer file upload
│   │   └── typeValidation.ts    # Zod validation
│   ├── schemas/                  # Zod validation schemas
│   ├── services/                 # Business logic
│   │   ├── prismaInit.ts
│   │   ├── mails.ts
│   │   └── distance.ts
│   └── types/                    # TypeScript type definitions
├── prisma/
│   ├── schema.prisma            # Database schema
│   ├── migrations/              # Database migrations
│   └── seed.ts                  # Database seeding script
├── public/
│   └── uploads/                 # Uploaded images
├── testRequests/                # HTTP test files (REST Client)
├── .env.example                 # Environment variables template
├── docker-compose.yml           # Docker compose configuration
├── Dockerfile                   # Docker image definition
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

## API Documentation

In case of any endpoint not working as described, check the code/test requests for the correct use. *(If all fails, message me...)*

### Authentication

#### Register
```http
POST /users/register
Content-Type: application/json

{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "securePassword123",
  "role": "host"
}
```

#### Login
```http
POST /users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "role": "user"
}
```

#### Verify Registration
```http
GET /users/verify/registration?token=verification_token
```

### Users

#### Get User Profile
```http
GET /users/profile/:id
```

#### Get Current User Profile
```http
GET /users/profile
Authorization: Bearer <jwt_token>
```

### Properties

#### Get All Properties
```http
GET /properties
```

#### Get Host Properties
```http
GET /properties/host
Authorization: Bearer <jwt_token>
```

#### Get Single Property
```http
GET /properties/single/:id
```

#### Create Property
*may include stuff like amenities, rooms, images. Check REST Client test request*

```http
POST /properties
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Beautiful Beach House",
  "propertyTypeId": 1,
  "propertyDescription": "A beautiful house near the beach",
  "ownerDescription": "Friendly host",
  "surroundingsDescription": "Close to shops and restaurants"
}
```

#### Update Property
```http
PATCH /properties/single/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

#### Update Property Address
```http
PATCH /properties/single/:id/address
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "street": "123 Main St",
  "city": "New York",
  "country": "USA",
  "zipCode": "10001",
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

#### Update Property Amenities
```http
PUT /properties/single/:id/amenities
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "amenityIds": [1, 2, 3]
}
```

#### Change Property Status
```http
PUT /properties/single/:id/status
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "statusId": 2
}
```

#### Delete Property
```http
DELETE /properties/single/:id
Authorization: Bearer <jwt_token>
```

#### Get Property Images
```http
GET /properties/single/:id/images
```

#### Get Property Rooms
```http
GET /properties/single/:id/rooms
```

#### Get Property Reviews
```http
GET /properties/single/:id/reviews
```

#### Get Property Types
```http
GET /properties/types
```

### Rooms

#### Get Single Room
```http
GET /rooms/single/:id
```

#### Create Room
```http
POST /properties/:id/rooms
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Master Bedroom",
  "capacity": 2,
  "area": 25,
  "smokingAllowed": false,
  "bathroomPrivate": true
}
```

#### Update Room
```http
PATCH /rooms/single/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

#### Update Room Pricing
```http
PUT /rooms/single/:id/pricing
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "pricePerNight": 150,
  "currency": "USD"
}
```

#### Update Room Amenities
```http
PUT /rooms/single/:id/amenities
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "amenityIds": [1, 2, 3]
}
```

#### Add Beds to Room
```http
POST /rooms/single/:id/beds
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "typeId": 1,
  "count": 1
}
```

#### Delete Room
```http
DELETE /rooms/single/:id
Authorization: Bearer <jwt_token>
```

### Amenities

#### Get Room Amenity Types
```http
GET /amenities/room/types
```

#### Get Room Amenity Categories
```http
GET /amenities/room/categories
```

#### Get Property Amenity Types
```http
GET /amenities/property/types
```

### Bookings

#### Create Booking
```http
POST /bookings/create
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "roomId": 1,
  "checkInDate": "2026-05-20",
  "checkOutDate": "2026-05-25",
  "numberOfGuests": 2
}
```

#### Process Payment
```http
POST /bookings/pay
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

#### Get User Bookings
```http
GET /bookings
Authorization: Bearer <jwt_token>
```

#### Get Host Bookings
```http
GET /bookings/host
Authorization: Bearer <jwt_token>
```

#### Update Booking
*This checks for expired/unfinished bookings (meant to be run periodically)*
```http
PATCH /bookings/update
Content-Type: application/json
```

### Reviews

#### Create Review

*ratings 0-10*
```http
POST /reviews
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "propertyId": 1,
  "rating": 5,
  "content": "Amazing property!"
}
```

#### Delete Review
```http
DELETE /reviews/single/:id
Authorization: Bearer <jwt_token>
```

### Images

#### Upload Images
```http
POST /images/upload
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

files: [file1, file2, ...]
propertyId: 1
```

#### Delete Image
```http
DELETE /images/single/:id
Authorization: Bearer <jwt_token>
```

#### Set Main Image
```http
PUT /images/single/:id/setMain
Authorization: Bearer <jwt_token>
```

### Miscellaneous

#### Get Bed Types
```http
GET /beds/types
```

#### Delete Bed
```http
DELETE /beds/single/:id
Authorization: Bearer <jwt_token>
```

#### Update Bed
```http
PATCH /beds/single/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

#### Get Languages
```http
GET /languages
```

## Database

### Run Migrations

```bash
# Run pending migrations
npx prisma migrate deploy

# Create a new migration
npx prisma migrate dev --name migration_name

# Reset database (development only)
npx prisma migrate reset
```

### Seed Database

```bash
# Seed with initial data
npx prisma db seed
```

## Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build TypeScript
npm build

# Start production server
npm start
```

### Development Workflow

1. Start the development server: `npm run dev`
2. The server runs on `http://localhost:3000`
3. Changes to TypeScript files automatically reload the server
4. Check `/testRequests` directory for API testing examples

### Testing API Endpoints

The project includes some REST Client test files in the `testRequests/` directory. I used the VS Code REST Client extension by Huachao Mao.