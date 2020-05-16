const http = require('http');
const express = require('express');
const app = express();

app.use('/image', express.static('images'));

const cors = require('cors');
app.use(cors());
app.options('*', cors());

var server = http.createServer(app);

server.listen(2020, function () {
    //server.listen(process.env.PORT || '2000', function () {
    console.log('Server app listening on port 2020!');
  });