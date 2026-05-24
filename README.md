# VedaX

VedaX is an educational web application designed for learning and practicing ancient Vedic Mathematics.

## 💡 Core Concepts

*   **16-Sutra Curriculum**: A modular practice playground covering all major Vedic arithmetic techniques.
*   **Timed Speed Arena**: A 60-second challenge with correct answer combo-multipliers to build calculation speed.
*   **Live Leaderboard**: Global standings computed on the fly by the backend server.
*   **Smart State Sync**: Saves progress locally in Guest mode and automatically syncs/merges progress to MongoDB once registered.
*   **Device Feedback**: Integrated sound chimes and device haptic vibrations for calculation feedback.

## 🛠️ Tech Stack

*   **Frontend**: Next.js, TailwindCSS, Framer Motion, Zustand
*   **Backend**: Node.js, Express.js, JWT Authentication
*   **Database**: MongoDB Atlas via Mongoose

---

## 🚀 Running Locally

### 1. Backend Server Setup
Navigate to the `backend/` directory, create a `.env` file, and install dependencies:
```bash
cd backend
npm install
```
Add the following to `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/vedax
JWT_SECRET=your_jwt_secret_key_here
```
Start the backend server:
```bash
npm run start
```

### 2. Frontend Next.js Setup
Create a `.env.local` at the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```
Install dependencies and run:
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## ☁️ Deployment

### 1. Backend Deployment (Railway or Render)
- **Engine**: The server is pre-configured for Railway deployment via `railway.json`.
- **Environment Variables**:
  - `PORT`: Set dynamically by the hosting platform (e.g., `5000`).
  - `MONGODB_URI`: Connection string to your MongoDB Atlas cluster.
  - `JWT_SECRET`: High-entropy secret key used to sign session JWTs.
  - `NODE_ENV`: Set to `production`.

### 2. Frontend Deployment (Vercel)
The Next.js frontend is fully compatible with Vercel out of the box.
- **Root Directory**: Select the root workspace folder of the repository.
- **Framework Preset**: Next.js
- **Environment Variables**:
  - `NEXT_PUBLIC_API_URL`: Set this to your deployed backend URL (e.g., `https://vedax-backend.up.railway.app/api`).
