const http = require('http');
const fs = require('fs');
const path = require('path');

// Create a basic HTTP server
const server = http.createServer((req, res) => {
  // Serve the HTML file when accessed
  if (req.url === '/') {
    const filePath = path.join(__dirname, 'index.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end('Error reading the HTML file.');
        return;
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.end(data);
    });
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

// Set the server to listen on port 80 (default HTTP port)
const PORT = 4565;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
