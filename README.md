# Creator Contest Platform

A full-stack contest platform where creators can create posts, receive engagement, and participate in a four-week contest.

The application is split into two backend services. The User Service manages users, posts, media, and interactions using MongoDB. The Admin Service calculates rankings, allocates prizes, and manages winner KYC using PostgreSQL and Prisma.

The frontend is built with React and communicates with both services through REST APIs.

## Project Structure

```text
creator-contest-platform/
├── backend/
│   ├── user-service/
│   └── admin-service/
├── frontend/
└── README.md
```

## Tech Stack

### Frontend

* React
* React Router
* Vite
* REST APIs

### User Service

* Node.js
* Express
* MongoDB
* Mongoose
* JWT
* bcrypt
* Multer

### Admin Service

* Node.js
* Express
* PostgreSQL
* Prisma ORM

### Tests

* Vitest

---

## Architecture

The backend is divided into two independent services.

### User Service

The User Service owns user and contest activity data.

It is responsible for:

* Signup and login
* JWT authentication
* User residency
* Creating posts
* Media uploads
* Feed
* Likes
* Comments
* Views
* Providing contest data to the Admin Service

MongoDB is used because this service mainly works with users, posts, and interaction data.

### Admin Service

The Admin Service owns contest administration data.

It is responsible for:

* Global rankings
* Category rankings
* Consistency rankings
* Prize allocation
* Winner records
* KYC status
* KYC failure cascade

PostgreSQL is used for winner and KYC data, with Prisma as the ORM.

The Admin Service does not access MongoDB directly. When ranking data is required, it requests the required contest data from the User Service through an internal API.

```text
React Frontend
      |
      |-------------------|
      |                   |
      v                   v
User Service         Admin Service
      |                   |
      v                   v
   MongoDB            PostgreSQL
      ^
      |
      | Internal Contest API
      |
Admin Service
```

---

## Contest Eligibility

A user can set their residency through their profile.

Only users whose residency is:

```text
Chhattisgarh
```

are eligible for contest rankings and prizes.

Users from other states can still use the platform and create posts, but their posts are excluded from contest rankings.

---

## Post Categories

The application uses the following 10 fixed categories:

* Dance
* Music
* Comedy
* Fashion
* Food
* Fitness
* Travel
* Art
* Education
* Photography

---

## Ranking

A post score is calculated using:

```text
Score = Likes + (Comments × 3) + (Views × 0.2)
```

For example:

```text
Likes    = 100
Comments = 20
Views    = 500

Score = 100 + (20 × 3) + (500 × 0.2)
      = 260
```

### Tie Breaking

If two posts have the same score, ranking is decided in this order:

1. Higher comments
2. Higher views
3. Earlier post timestamp

### Global Ranking

Only the best-scoring post from each eligible creator is considered.

This prevents a creator with many posts from occupying multiple positions in the global ranking.

### Category Ranking

Each category maintains its own ranking.

Only the best post from a creator within that category is considered.

A creator can therefore appear in multiple category ranking lists before prize allocation.

### Consistency Ranking

The contest runs across four weeks.

To qualify for the consistency ranking, a creator must publish at least three posts in every contest week.

```text
Week 1: 3+ posts
Week 2: 3+ posts
Week 3: 3+ posts
Week 4: 3+ posts
```

For each eligible creator, the best three posts from each week are used.

The scores of those posts are summed across all four weeks to calculate the consistency score.

The contest start date is configurable through:

```env
CONTEST_START_DATE=2026-09-01T00:00:00.000Z
```

---

## Prize Allocation

A maximum of 33 prizes can be awarded.

Prizes are processed in strict priority order:

| Priority | Prize           | Slots |
| -------- | --------------- | ----: |
| 1        | Grand Prize     |     1 |
| 2        | Consistency 1st |     1 |
| 3        | Consistency 2nd |     1 |
| 4        | Top Performers  |    10 |
| 5        | Category 1st    |    10 |
| 6        | Category 2nd    |    10 |

A creator can receive only one prize.

Once a creator receives a higher-priority prize, that creator is skipped while processing the remaining tiers.

If a creator ranks strongly in more than one category, only one category prize can be awarded to that creator.

If there is no eligible creator remaining for a category slot, the slot remains unawarded.

---

## KYC Flow

Winner KYC is handled by the Admin Service.

A winner starts with:

```text
NOT_REQUESTED
```

The normal flow is:

```text
NOT_REQUESTED
      |
      v
REQUESTED
   /     \
  v       v
PASSED   FAILED
```

An admin can:

* Request KYC
* Mark KYC as passed
* Mark KYC as failed

### KYC Failure Cascade

If a winner fails KYC, that person is no longer considered an active winner.

The system looks for the next eligible creator for the affected prize slot while respecting:

* Ranking order
* Prize priority
* One prize per creator
* Previous failed winners

If another replacement also fails KYC, the process can continue to the next eligible creator.

If no eligible creator remains, the prize slot is left unawarded.

Failed winner records are retained with a `FAILED` status so that the same user cannot be selected again during a later cascade.

---

# User Service

## Environment Variables

Create a `.env` file inside:

```text
backend/user-service/
```

Example:

```env
MODE=development            
MONGO_URI_DEV=mongodb://localhost:27017/
DB_NAME_DEV=userdb
PORT_DEV=5001
JWT_SIGNATURE_DEV=kapil9179
```

Use the variable names from the provided `.env.example` if they differ in the local setup.

Do not commit real secrets.

## Install

```bash
cd backend/user-service
npm install
```

## Run

```bash
npm run dev
```

The service should be available at:

```text
http://localhost:5001
```

Health check:

```text
GET /health
```

---

## Main User APIs

The main API groups are:

```text
/api/auth
/api/user
/api/posts
/api/internal/contest
```

### Authentication

The service supports:

```text
POST /api/auth/signup
POST /api/auth/login
```

Protected APIs expect a JWT using the Bearer scheme:

```text
Authorization: Bearer <token>
```

### Residency

Authenticated users can update their residency through the User Service.

### Posts

Post APIs support:

* Creating a post
* Fetching the feed
* Liking a post
* Commenting on a post
* Recording a view

Refer to the route files in `backend/user-service/src/routes` for the exact endpoint paths.

---

## Media Upload

Post media is uploaded as an actual file using multipart form data.

Supported media includes the image and video formats configured in the upload middleware.

Files are validated for:

* MIME type
* File size
* Safe filename generation

Uploaded files are separated into image and video directories and served through:

```text
/uploads
```

The React frontend also validates media before sending the request and shows a preview of the selected file.

---

## Internal Contest API

The User Service exposes contest data to the Admin Service.

```text
GET /api/internal/contest/data
```

The Admin Service uses this endpoint when calculating rankings.

This keeps the service boundary clear:

```text
Admin Service
     |
     | HTTP
     v
User Service
     |
     v
MongoDB
```

The Admin Service never reads the User Service database directly.

For a production deployment, this internal endpoint should be protected using service-to-service authentication.

---

# Admin Service

## Environment Variables

Create a `.env` file inside:

```text
backend/admin-service/
```

Example:

```env
POSTGRES_URL_DEV=postgresql://postgres:Kapil@123@localhost:5432/contest_admin
PORT_DEV=5002
MODE=development
USER_SERVICE_URL="http://localhost:5001"
CONTEST_START_DATE="2026-09-01T00:00:00.000Z"

```

Replace the PostgreSQL credentials with the credentials for your local environment.

## Install

```bash
cd backend/admin-service
npm install
```

## Prisma Setup

Apply the included migrations:

```bash
npx prisma migrate deploy
```

For local development, Prisma migrations can also be applied with:

```bash
npx prisma migrate dev
```

Generate the Prisma client:

```bash
npx prisma generate
```

## Run

```bash
npm run dev
```

The Admin Service should then be available on the configured port.

Health check:

```text
GET /health
```

---

## Admin APIs

### Rankings

```text
GET /api/rankings
```

Returns the calculated:

* Global ranking
* Category rankings
* Consistency ranking
* Prize allocation

Ranking data is fetched from the User Service rather than directly from MongoDB.

### Winners

```text
POST /api/winners/generate
GET  /api/winners
```

Winner generation should be performed after contest data is ready.

Repeated winner generation is prevented once winners already exist.

### KYC

```text
PATCH /api/kyc/:winnerId/request
PATCH /api/kyc/:winnerId/pass
PATCH /api/kyc/:winnerId/fail
```

The fail endpoint also handles finding the next eligible replacement when one is available.

---

# Frontend

## Environment Variables

Create a `.env` file inside:

```text
frontend/
```

Example:

```env
VITE_USER_SERVICE_URL=http://localhost:5001
VITE_ADMIN_SERVICE_URL=http://localhost:5002
```

## Install

```bash
cd frontend
npm install
```

## Run

```bash
npm run dev
```

The frontend includes:

* Signup
* Login
* Residency/profile management
* Create Post
* Media preview
* Feed
* Like
* Comment
* View tracking
* Admin winner management
* KYC actions

---

# Sample Contest Data

A seed script is included to create predictable contest scenarios.

From the User Service:

```bash
npm run seed:contest
```

The seed is designed to cover:

* A creator leading more than one category
* Equal post scores for tie-break testing
* Equal score/comments/views for timestamp tie-break testing
* A creator eligible for consistency ranking
* A creator missing the consistency requirement in one week
* A high-scoring non-Chhattisgarh creator
* A category with insufficient eligible creators
* Multiple candidates for KYC cascade testing

The seed only cleans records created by the contest seed itself. It does not intentionally wipe unrelated application data.

Seed user password:

```text
Seed@123
```

Example seed account:

```text
contest-seed-multi@example.com
```

---

# Tests

Basic tests are included for the contest rules that are most likely to cause incorrect winner selection.

From the Admin Service:

```bash
cd backend/admin-service
npm test
```

The tests cover:

* Score calculation
* Ranking order
* Comments tie-break
* Views tie-break
* Timestamp tie-break
* Best global post per creator
* Best category post per creator
* Chhattisgarh eligibility
* Consistency qualification
* One-prize-per-person
* Prize cascading
* Exhausted prize slots
* KYC replacement selection

---

# Running the Complete Project

Start MongoDB and PostgreSQL first.

Then run the User Service:

```bash
cd backend/user-service
npm install
npm run dev
```

In another terminal, run the Admin Service:

```bash
cd backend/admin-service
npm install
npx prisma migrate deploy
npx prisma generate
npm run dev
```

Then start the frontend:

```bash
cd frontend
npm install
npm run dev
```

For predictable contest data:

```bash
cd backend/user-service
npm run seed:contest
```

The expected service flow is:

```text
Frontend
   |
   +------ User Service ------ MongoDB
   |
   +------ Admin Service ----- PostgreSQL
                |
                +------ User Service contest API
```

---

# Data Model

## MongoDB

### User

Stores:

* Email
* Hashed password
* Residency
* Timestamps

### Post

Stores:

* Creator
* Media path
* Caption
* Category
* Like count
* Comment count
* View count
* Timestamps

### Like

Stores the user/post relationship.

A unique user + post constraint prevents duplicate likes.

### Comment

Stores:

* User
* Post
* Comment text
* Timestamps

## PostgreSQL

### Winner

Stores:

* User ID from the User Service
* Prize tier
* Category where applicable
* KYC status
* Timestamps

The User Service MongoDB ID is stored as an external string identifier. There is no cross-database foreign key between the services.

---

# API Contract Between Services

The Admin Service depends on the User Service only through HTTP.

The User Service provides contest posts with the information required for ranking, including:

* Creator identifier
* Creator residency
* Category
* Likes count
* Comments count
* Views count
* Creation timestamp

The Admin Service uses this data to calculate rankings and prize allocation.

Neither service accesses the other service's database.

---

# Assumptions

A few details were not explicitly defined by the assignment, so the following assumptions are used:

1. The contest start date is configurable through `CONTEST_START_DATE`.

2. The four contest weeks are calculated as consecutive seven-day periods starting from that date.

3. Grand Prize is awarded to the highest eligible creator in the global ranking.

4. Top Performer prizes are filled from the global ranking after higher-priority winners have been removed.

5. A creator can receive only one prize across all tiers.

6. When a creator is eligible in multiple categories, one category prize is retained and the other category slot moves to the next eligible creator.

7. If no eligible creator remains for a category slot, that slot remains unawarded.

8. KYC is treated as verification of the creator. A creator who fails KYC is excluded from future replacement selection.

9. Uploaded media is stored on local disk for this assignment. The storage layer can be replaced with object storage without changing the contest ranking logic.

10. The internal User Service contest endpoint is left simple for the local assignment environment. A production deployment should add service-to-service authentication.

---

# Notes

This project intentionally keeps ranking and prize logic inside the Admin Service and user interaction data inside the User Service.

The frontend does not calculate rankings, determine contest eligibility, allocate prizes, or perform KYC cascading. It displays the state returned by the backend.

This keeps the contest rules in one place and avoids duplicating business logic between the frontend and backend.
