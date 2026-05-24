# VedaX

VedaX is an educational web application designed for learning and practicing ancient Vedic Mathematics.

## 💡 Core Concepts

*   **16-Sutra Curriculum**: A modular practice playground covering all major Vedic arithmetic techniques.
*   **Timed Speed Arena**: A 60-second challenge with correct answer combo-multipliers to build calculation speed.
*   **Live Leaderboard**: Global standings powered by Cloud Firestore.
*   **Smart State Sync**: Saves progress locally in Guest mode and automatically syncs/merges progress to Firestore once registered.
*   **Device Feedback**: Integrated sound chimes and device haptic vibrations for calculation feedback.

## 🛠️ Tech Stack

*   **Frontend**: Next.js, TailwindCSS, Framer Motion
*   **State**: Zustand
*   **Backend & DB**: Firebase Auth & Cloud Firestore

## 🚀 Running Locally

1.  The Firebase keys are expected in `.env.local` at the project root:
    ```env
  NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDDcVR92S7W91Ovetjvrv1FZq1kEeE2P10
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=vedax-arithmetic.firebaseapp.com
  NEXT_PUBLIC_FIREBASE_PROJECT_ID=vedax-arithmetic
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=vedax-arithmetic.firebasestorage.app
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=260416757006
  NEXT_PUBLIC_FIREBASE_APP_ID=1:260416757006:web:7f5dcbe572dd10dbad4b5f
    ```
2.  Install dependencies and start the app:
    ```bash
    npm install
    npm run dev
    ```

## ☁️ Deployment

*   **Hosting**: Pre-configured for Railway hosting via `railway.json`. Set the env variables in the Railway dashboard.
*   **Firestore Rules**: Use the following rules to secure the database:
    ```javascript
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /users/{userId} {
          allow read: if request.auth != null;
          allow write: if request.auth != null && request.auth.uid == userId;
        }
      }
    }
    ```
