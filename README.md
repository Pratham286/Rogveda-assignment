# Rogveda — Medical Travel Booking Platform

A mini medical travel booking platform for international patients coming to India for treatment. Patients can search hospitals, compare pricing, and book procedures. Vendors can manage bookings and track tasks through a separate dashboard.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Routing | React Router DOM |
| HTTP Client | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Auth | Hardcoded vendor token via HTTP header |

---


## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Pratham286/Rogveda-assignment
cd rogveda
```

---

### 2. Set up the Backend

#### Navigate to the backend directory

```bash
cd backend
```

#### Install dependencies

```bash
npm install
```

#### Create a `.env` file in the root directory

```env
PORT=3000
MONGODB_URI= Your_MongoDB_URL

```

#### Seed the database

This populates hospitals, doctors, pricing, and a dummy patient.

```bash
node src/seed.js
```

Expected output:
```
Seeded successfully!
  Hospitals : 3
  Doctors   : 6
  Pricing   : 18 records
  Patients  : 1
```

#### Start the backend server

```bash
npm run dev
```

The server will start at: `http://localhost:3000`

---

### 3. Set up the Frontend

#### Navigate to the frontend directory

```bash
cd frontend
```

#### Install dependencies

```bash
npm install
```


#### Start the frontend dev server

```bash
npm run dev
```

The app will be available at: `http://localhost:5173`

---

## Routes

| URL | Description |
|---|---|
| `http://localhost:5173/` | Patient search & booking |
| `http://localhost:5173/vendor/login` | Vendor login |
| `http://localhost:5173/vendor/dashboard` | Vendor dashboard (requires login) |

---

## How to Sign In (Vendor)

1. Go to `http://localhost:5173/vendor/login`
2. Enter the following credentials:

```
Username: apollo
Password: apollo123
```

3. You will be redirected to the vendor dashboard where all patient bookings are visible.



## Features

### Patient Side

- **Hospital Search** — Search by procedure, location, or hospital name with full-text and regex fallback
- **Dynamic Pricing** — Price updates instantly when doctor or room type is changed
- **Lowest Price Default** — Each card defaults to the cheapest doctor + room combination
- **Currency Toggle** — Switch between USD, INR (×83), and NGN (×1550) in real time
- **Book Now, Pay Later (BNPL)** — Patients can confirm bookings with zero wallet balance; wallet goes negative
- **3-Step Booking Flow:**
  1. Enter patient details (name, email, phone, country)
  2. Review booking summary with included services
  3. Confirmation screen with Booking ID and updated wallet balance
- **Loading States** — Skeleton cards while hospitals are loading
- **Error States** — User-friendly messages with retry option
- **Empty States** — Clear messaging when no results are found
- **Responsive Design** — Fully mobile-first layout

### Trust Signals

- Accreditation badge on each hospital card (NABH / JCI when available, "Accredited Facility" as fallback)
- Free Visa Assistance badge on every card
- 24/7 WhatsApp Support indicator
- Platform stats: 12,000+ international patients, 50+ hospitals, 80+ countries, 4.9/5 rating
- Booking confirmation lists: Visa Letter, Airport Pickup, Dedicated Coordinator, WhatsApp Support
- Encrypted data notice during patient registration

### Vendor Dashboard

- **Secure Login** — Token-based auth stored in `localStorage`, auto-attached to all protected requests
- **Stats Overview** — Total, Confirmed, In Progress, and Completed booking counts
- **Filter Tabs** — Filter bookings by status
- **Desktop Table + Mobile Cards** — Responsive layout for all screen sizes
- **Booking Detail Modal** — Full booking info with task status
- **Task Completion** — Mark "Visa Invite Letter Sent" as complete; booking status updates to "In Progress" in real time
- **Auto Redirect** — Unauthenticated access to dashboard redirects to login

### General

- Toast notifications for success, error, info, and warning events
- All data fetched from the real backend — no hardcoded frontend data
- Axios interceptors for automatic token injection and error normalization
- MongoDB transactions for atomic booking creation (wallet deduction + booking + task creation)

---