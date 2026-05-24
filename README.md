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

1.  Add your Firebase keys to `.env.local`:
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
    ```
2.  Start the project:
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
