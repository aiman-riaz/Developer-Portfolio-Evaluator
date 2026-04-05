Developer Portfolio Evaluator
A full-stack MERN app that analyses any public GitHub profile and generates a scorecard. Built as part of a 3-week internship project.
You enter a GitHub username and get back a detailed report — activity, code quality, project diversity, community impact and hiring readiness — all pulled from the free GitHub API. No paid services, no AI subscriptions.
Every report gets its own shareable URL so you can post it on LinkedIn or send it to a recruiter directly.


Tech stack
Frontend — React 18, Vite, React Router v6, Chart.js
Backend — Node.js, Express, Octokit (GitHub SDK)
Database — MongoDB Atlas, Mongoose
Deploy — Vercel (frontend), Render (backend)


Folder structure
Developer-Portfolio-Evaluator/
├── client/
│   ├── src/
│   │   ├── components/       — ScoreCard, RadarChart, HeatMap, RepoList, LanguageChart, SearchBar
│   │   ├── pages/            — Home, Report
│   │   └── utils/            — api.js
│   └── package.json
├── server/
│   ├── controllers/          — profileController.js
│   ├── routes/               — profileRoutes.js
│   ├── services/             — githubService.js, scoringService.js
│   ├── models/               — Report.js
│   ├── middleware/           — cache.js, errorHandler.js
│   ├── config/               — db.js
│   └── package.json
└── README.md


Notes

.env files are in .gitignore and never committed
GitHub API rate limit is 5000 requests/hour with a token — more than enough
MongoDB TTL index automatically deletes cached reports after 24 hours, no manual cleanup needed