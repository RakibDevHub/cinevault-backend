const dns = require('dns');
dns.setServers(['1.1.1.1', '8.8.8.8']); // Cloudflare + Google

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const movieRoutes = require('./routes/movieRoutes');

dotenv.config();
connectDB();

const app = express();

app.set('trust proxy', 1); // Trust the first proxy (if behind a reverse proxy like Nginx or Render)
app.use(express.json());

// Base URL (works locally and on Render)
const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://cinevault-backend-aric.onrender.com'
    : `http://localhost:${process.env.PORT || 5000}`;

// Friendly landing page at root
app.get('/', (req, res) => {
  const endpoints = [
    {
      title: 'Get All Movies',
      method: 'GET',
      path: '/api/v1/movies',
      description: 'Returns all movies in the database.',
    },
    {
      title: 'Search by Title',
      method: 'GET',
      path: '/api/v1/movies?search=inception',
      description: 'Case-insensitive search on movie title.',
    },
    {
      title: 'Filter by Genre',
      method: 'GET',
      path: '/api/v1/movies?genre=Sci-Fi',
      description: 'Filter movies by exact genre (e.g., Sci-Fi, Action).',
    },
    {
      title: 'Sort by Rating (High → Low)',
      method: 'GET',
      path: '/api/v1/movies?sort=rating',
      description: 'Returns movies sorted by highest rating first.',
    },
    {
      title: 'Sort by Year (Newest → Oldest)',
      method: 'GET',
      path: '/api/v1/movies?sort=year',
      description: 'Returns movies sorted by latest release year first.',
    },
    {
      title: 'Combined Query',
      method: 'GET',
      path: '/api/v1/movies?genre=Sci-Fi&sort=rating',
      description: 'Combine filter and sort in a single request.',
    },
    {
      title: 'Get Single Movie by ID',
      method: 'GET',
      path: '/api/v1/movies/:id',
      description: 'Returns a single movie by its MongoDB ObjectId.',
    },
  ];

  const rows = endpoints
    .map(
      (ep, i) => `
      <div class="endpoint">
        <div class="endpoint-header">
          <span class="method">${ep.method}</span>
          <span class="title">${ep.title}</span>
        </div>
        <p class="desc">${ep.description}</p>
        <div class="url-row">
          <input
            id="url-${i}"
            class="url-input"
            type="text"
            value="${BASE_URL}${ep.path}"
            readonly
          />
          <button class="copy-btn" onclick="copyUrl('url-${i}', this)">Copy</button>
        </div>
      </div>`
    )
    .join('');

  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CineVault API</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #0f172a;
      color: #e2e8f0;
      min-height: 100vh;
      padding: 40px 20px;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
    }
    header {
      text-align: center;
      margin-bottom: 40px;
    }
    h1 {
      font-size: 2.2rem;
      font-weight: 700;
      color: #f1f5f9;
      margin-bottom: 8px;
    }
    h1 span { color: #38bdf8; }
    .subtitle {
      color: #94a3b8;
      font-size: 1rem;
    }
    .base-url {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 8px;
      padding: 12px 16px;
      margin: 24px 0 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }
    .base-url-label {
      font-size: 0.8rem;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .base-url-value {
      font-family: "SF Mono", Monaco, "Cascadia Code", Consolas, monospace;
      color: #38bdf8;
      font-size: 0.9rem;
      word-break: break-all;
    }
    .endpoint {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 10px;
      padding: 18px;
      margin-bottom: 16px;
      transition: border-color 0.2s;
    }
    .endpoint:hover { border-color: #475569; }
    .endpoint-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 6px;
    }
    .method {
      background: #059669;
      color: white;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 4px;
      letter-spacing: 0.05em;
    }
    .title {
      font-weight: 600;
      color: #f1f5f9;
      font-size: 1rem;
    }
    .desc {
      color: #94a3b8;
      font-size: 0.85rem;
      margin-bottom: 12px;
    }
    .url-row {
      display: flex;
      gap: 8px;
      align-items: stretch;
    }
    .url-input {
      flex: 1;
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 6px;
      padding: 8px 12px;
      color: #cbd5e1;
      font-family: "SF Mono", Monaco, "Cascadia Code", Consolas, monospace;
      font-size: 0.8rem;
      outline: none;
    }
    .url-input:focus { border-color: #38bdf8; }
    .copy-btn {
      background: #38bdf8;
      color: #0f172a;
      border: none;
      border-radius: 6px;
      padding: 8px 16px;
      font-weight: 600;
      font-size: 0.8rem;
      cursor: pointer;
      transition: background 0.2s, transform 0.1s;
      white-space: nowrap;
    }
    .copy-btn:hover { background: #7dd3fc; }
    .copy-btn:active { transform: scale(0.97); }
    .copy-btn.copied {
      background: #059669;
      color: white;
    }
    footer {
      text-align: center;
      margin-top: 40px;
      color: #64748b;
      font-size: 0.8rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>🎬 Cine<span>Vault</span> API</h1>
      <p class="subtitle">Movie Explorer REST API — Node.js · Express · MongoDB</p>
    </header>

    <div class="base-url">
      <div>
        <div class="base-url-label">Base URL</div>
        <div class="base-url-value">${BASE_URL}</div>
      </div>
      <button class="copy-btn" onclick="copyUrl('base-url', this)" id="base-url-btn">Copy</button>
      <input id="base-url" type="text" value="${BASE_URL}" style="display:none" />
    </div>

    ${rows}

    <footer>
      <p>Built with Node.js, Express &amp; MongoDB</p>
    </footer>
  </div>

  <script>
    function copyUrl(id, btn) {
      const input = document.getElementById(id);
      input.select();
      input.setSelectionRange(0, 99999);
      navigator.clipboard.writeText(input.value).then(() => {
        const original = btn.textContent;
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = original;
          btn.classList.remove('copied');
        }, 1500);
      }).catch(() => {
        // Fallback for older browsers
        document.execCommand('copy');
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = 'Copy'; }, 1500);
      });
    }
  </script>
</body>
</html>`);
});

// Mount routes
app.use('/api/v1/movies', movieRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});