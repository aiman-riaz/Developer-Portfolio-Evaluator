# DevScore — Developer Portfolio Evaluator

A full-stack MERN application that analyzes any public GitHub profile and generates a beautiful, shareable scorecard. Built to help developers showcase their open-source footprint and provide a detailed breakdown of their activity, code quality, project diversity, community impact, and hiring readiness.

All data is pulled dynamically from the GitHub REST and GraphQL APIs.

---

## ✨ Features

- **Live 5-Category Scoring**: Computes weighted scores based on commit activity, repository metrics, code diversity, and more.
- **365-Day Activity Heatmap**: Accurate, GitHub-style contribution calendar built dynamically using the GitHub GraphQL API.
- **Profile Comparisons**: Compare two GitHub developers head-to-head with interactive radar charts and side-by-side stats.
- **Shareable URLs**: Every generated report gets a unique link, perfect for attaching to LinkedIn or sending to recruiters.
- **24-Hour Smart Caching**: MongoDB-backed caching system that stores generated reports to eliminate repeat GitHub API hits and speed up load times.
- **Minimalistic UI**: A clean, light-mode interface with beautiful responsive design.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router v6, Chart.js
- **Backend**: Node.js, Express, Octokit (GitHub REST & GraphQL SDK)
- **Database**: MongoDB Atlas, Mongoose
- **Deployment**: Vercel (Frontend), Render (Backend)

---

## 🚀 How to Use (Local Setup)

To run this project locally, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/aiman-riaz/Developer-Portfolio-Evaluator.git
cd Developer-Portfolio-Evaluator
```

### 2. Set up the Backend
Navigate to the `server` directory, install dependencies, and set up your environment variables.
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory and add the following keys:
```env
MONGODB_URI=your_mongodb_connection_string
GITHUB_TOKEN=your_github_personal_access_token
PORT=5000
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```
*Note: A GitHub Personal Access Token is required to fetch the GraphQL contribution graph and avoid strict rate limits.*

Start the backend server:
```bash
npm run dev
```

### 3. Set up the Frontend
Open a new terminal window, navigate to the `client` directory, and install dependencies.
```bash
cd client
npm install
```
Create a `.env` file in the `client` directory (if needed) to specify the API URL:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
```
The app should now be running locally at `http://localhost:5173`.

---

## 📂 Project Structure

```text
Developer-Portfolio-Evaluator/
├── client/
│   ├── src/
│   │   ├── components/       # UI Components: ScoreCard, RadarChart, HeatMap, SearchBar, etc.
│   │   ├── pages/            # Page Views: Home, Report
│   │   ├── utils/            # Utilities: api.js (Axios configuration)
│   │   ├── App.jsx           # Main App Routing
│   │   ├── main.jsx          # React Entry Point
│   │   └── index.css         # Global Styles & Theme Variables
│   └── package.json
├── server/
│   ├── controllers/          # Route logic (profileController.js)
│   ├── routes/               # API endpoint definitions (profileRoutes.js)
│   ├── services/             # Business logic (githubService.js, scoringService.js)
│   ├── models/               # MongoDB Schemas (Report.js)
│   ├── middleware/           # Express middleware (cache.js)
│   ├── config/               # DB configuration
│   ├── app.js                # Express App Setup
│   └── package.json
└── README.md
```

---

## 📝 Notes

- **.env files**: Always keep your `.env` files in `.gitignore` to prevent leaking tokens or database credentials.
- **Rate Limits**: The GitHub API rate limit is 5000 requests/hour with an authenticated token, which is well accommodated by the caching mechanism.
- **Auto-Cleanup**: The MongoDB TTL index automatically deletes cached reports after 24 hours, ensuring the database stays clean and profiles remain updated without manual intervention.