const escape = (str = "") =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const styles = `
  body {
    font-family: Consolas, Monaco, "Cascadia Code", monospace;
    background: #ffffff;
    color: #111;
    margin: 24px;
    font-size: 14px;
    line-height: 1.5;
  }
  h1 { font-size: 1.1rem; margin-bottom: 4px; font-family: sans-serif; }
  p.meta { color: #555; font-size: 0.82rem; margin-bottom: 20px; font-family: sans-serif; }
  a { color: #0366d6; text-decoration: none; }
  a:hover { text-decoration: underline; }
  .movie {
    background: #fafafa;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 14px 18px;
    margin-bottom: 14px;
    white-space: pre;
    overflow-x: auto;
  }
  .key { color: #0550ae; }
  .str { color: #0a7d32; }
  .num { color: #b35900; }
  .null { color: #999; }
  .brace { color: #444; }
`;

function renderMovieObject(movie) {
  const lines = [
    `<span class="brace">{</span>`,
    `  <span class="key">_id</span>: <span class="str">"${escape(movie._id)}"</span>,`,
    `  <span class="key">title</span>: <span class="str">"${escape(movie.title)}"</span>,`,
    `  <span class="key">genre</span>: <span class="str">"${escape(movie.genre)}"</span>,`,
    `  <span class="key">rating</span>: <span class="num">${movie.rating}</span>,`,
    `  <span class="key">year</span>: <span class="num">${movie.year}</span>,`,
    `  <span class="key">poster</span>: <span class="str">"${escape(movie.poster)}"</span>,`,
    `  <span class="key">description</span>: <span class="str">"${escape(movie.description)}"</span>,`,
    `  <span class="key">__v</span>: <span class="num">${movie.__v}</span>,`,
    `  <span class="key">createdAt</span>: <span class="str">"${escape(movie.createdAt)}"</span>,`,
    `  <span class="key">updatedAt</span>: <span class="str">"${escape(movie.updatedAt)}"</span>`,
    `<span class="brace">}</span>`,
  ];
  return `<div class="movie">${lines.join("\n")}</div>`;
}

function renderMoviesList(movies, baseUrl, query) {
  const qs = new URLSearchParams(query).toString();
  const jsonUrl = baseUrl + (qs ? `?${qs}&format=json` : "?format=json");

  const blocks = movies.length
    ? movies.map(renderMovieObject).join("\n")
    : '<div class="movie"><span class="null">[] — no movies found</span></div>';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>CineVault — Movies</title>
  <style>${styles}</style>
</head>
<body>
  <h1>CineVault — Movies</h1>
  <p class="meta">
    <strong>${movies.length}</strong> record${movies.length === 1 ? "" : "s"} ·
    <a href="${escape(jsonUrl)}">View raw JSON</a> ·
    <a href="/">Home</a>
  </p>
  ${blocks}
</body>
</html>`;
}

function renderMovieDetail(movie, baseUrl) {
  const jsonUrl = `${baseUrl}/${movie._id}?format=json`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${escape(movie.title)} — CineVault</title>
  <style>${styles}</style>
</head>
<body>
  <h1>${escape(movie.title)}</h1>
  <p class="meta">
    <a href="..">← Back to list</a> ·
    <a href="${escape(jsonUrl)}">View raw JSON</a>
  </p>
  ${renderMovieObject(movie)}
</body>
</html>`;
}

module.exports = { renderMoviesList, renderMovieDetail };
