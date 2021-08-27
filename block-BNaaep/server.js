var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');
var userPath = __dirname + '/contacts/';

var server = http.createServer(handleServer);

function handleServer(req, res) {
  var parsedUrl = url.parse(req.url, true);
  var store = '';
  req.on('data', (chunk) => {
    store += chunk;
  });
  req.on('end', () => {
    if (req.method === 'GET' && req.url === '/') {
      res.writeHead(201, { 'Content-Type': 'text/html' });
      fs.createReadStream('./index.html').pipe(res);
    } else if (req.method === 'GET' && req.url === '/about') {
      res.writeHead(202, { 'Content-Type': 'text/html' });
      fs.createReadStream('./about.html').pipe(res);
    } else if (req.url.split('.').pop() === 'css') {
      fs.readFile(__dirname + req.url, (err, content) => {
        if (err) console.log(err);
        res.setHeader('Content-Type', 'text/css');
        res.end(content);
      });
    } else if (req.url.split('.').pop() === 'jpg') {
      fs.readFile(__dirname + req.url, (err, content) => {
        if (err) console.log(err);
        res.setHeader('Content-Type', 'image/jpg');
        res.end(content);
      });
    } else if (req.url.split('.').pop() === 'png') {
      fs.readFile(__dirname + req.url, (err, content) => {
        if (err) console.log(err);
        res.setHeader('Content-Type', 'image/png');
        res.end(content);
      });
    } else if (req.method === 'GET' && req.url === '/contact') {
      res.setHeader('Content-Type', 'text/html');
      fs.createReadStream('./form.html').pipe(res);
    } else if (req.method === 'POST' && req.url === '/form') {
      let parsedData = qs.parse(store);
      let username = parsedData.name;
      let stringyData = JSON.stringify(parsedData);
      fs.open(userPath + username + '.json', 'wx', (err, fd) => {
        fs.writeFile(fd, stringyData, (err) => {
          fs.close(fd, (err) => {
            res.end(`${username} created`);
          });
        });
      });
    }
  });
}
server.listen(5000, () => {
  console.log('server run on port 5000');
});
