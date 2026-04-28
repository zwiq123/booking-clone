# booking-clone
A clone of booking.com

# .env:
 - DATABASE_URL - database connection string in this format: "postgresql://username:password@localhost:5432/dbname"
 - JWT_SECRET - string for hashing jsonwebtokens
 - GMAIL_NAME - smtp mail address
 - GMAIL_PASSWORD - password to log in to the mail above

# Setup:
Insert these commands inside the terminal in order:
 - git clone https://github.com/zwiq123/booking-clone.git
 - npx prisma generate
 - npx prisma db seed (this sets up static data in the database)
 - npm run dev (this starts the server)

# Endpoints:
-----USERS-----

POST /users/register
POST /users/login
GET /users/verify/registration
GET /users/profile/:id
GET /users/profile
GET /users/passwordreset
...(password reset)

-----PROPERTIES-----

GET /properties
GET /properties/host
GET /properties/single/:id
GET /properties/single/:id/host

GET /properties/single/:id/images
GET /properties/single/:id/rooms
GET /properties/single/:id/reviews

POST /properties
POST /properties/:id/rooms

PATCH /properties/single/:id
PATCH /properties/single/:id/address
PUT /properties/single/:id/amenities
PUT /properties/single/:id/status

DELETE /properties/single/:id

GET /properties/types

-----ROOMS-----

GET /rooms/single/:id
PATCH /rooms/single/:id
DELETE /rooms/single/:id
PUT /rooms/single/:id/pricing
PUT /rooms/single/:id/amenities
POST /rooms/single/:id/beds

-----AMENITIES-----

GET /amenities/room/types
GET /amenities/room/categories
GET /amenities/property/types

-----BOOKINGS-----

POST /bookings/create
POST /bookings/payment
GET /bookings
GET /bookings/host
PATCH /bookings/update

----------

POST /reviews
DELETE /reviews/single/:id

GET /beds/types
DELETE /beds/single/:id
PATCH /beds/single/:id

GET /languages

POST /images/upload
DELETE /images/single/:id
PUT /images/single/:id/setMain
