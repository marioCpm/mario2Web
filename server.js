const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = true;
const hostname = 'localhost';
const port = 3000;
const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});