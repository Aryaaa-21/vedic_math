# VedaX

VedaX is an educational web application for learning and practicing Vedic Mathematics.

## Core Features

* **16-Sutra Curriculum**: A modular practice library covering the full set of sutras.
* **Timed Speed Arena**: A 60-second challenge built for rapid mental calculation.
* **Live Leaderboard**: Global standings computed by the backend.
* **Local Progress Sync**: Guest progress stays in the browser until the user signs in and syncs to MongoDB.
* **Audio and Haptic Feedback**: Optional sound and vibration feedback during practice.

## Tech Stack

* **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Zustand
* **Backend**: Node.js, Express.js, JWT authentication
* **Database**: MongoDB Atlas via Mongoose

## Authentication Model

* Email/password sign-in uses the backend `/api/auth/login` and `/api/auth/signup` endpoints.
* The backend returns a JWT token after successful authentication.
* The frontend stores the token locally and uses it for protected requests.
* Guest mode is local to the device until the user signs in and the data is merged.
* Google sign-in is name-based in the current build and should be treated as a backend profile flow, not Firebase auth.

## Running Locally

### Backend

Install dependencies and start the API server:
```bash
cd backend
npm install
npm run dev
```

Create `backend/.env` with:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/vedax
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### Frontend

At the repository root:
```bash
npm install
npm run dev
```

Create `.env.local` at the root if needed:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Open [http://localhost:5173](http://localhost:5173) for the frontend.

## Deployment

### Backend

* Railway or Render work well for the API.
* Required environment variables: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV`.

### Frontend

* Deploy the Vite app to your static host of choice.
* Set `NEXT_PUBLIC_API_URL` to the deployed backend URL, for example `https://vedax-backend.up.railway.app/api`.
