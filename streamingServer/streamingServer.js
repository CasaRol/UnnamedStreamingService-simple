const http = require('http');
const fileSystem = require('fs');
const express = require('express');
const path = require('path');
const app = express();

const cors = require('cors');
app.use(cors());
app.options('*', cors());

var server = http.createServer(app);

const SEGMENT_SIZE = 200000;    // size of each segment sent of a song being streamed
var loadedSong = "";
var songArray = [];

app.get('/playSong', (req, res) => {
    console.log("Received request to stream this song: " + req.query.song);
    console.log("Requested segment is: " + req.query.segment);
  
    if (req.query.song != loadedSong) {
      console.log("Now loading " + req.query.song);
      loadedSong = req.query.song;
      songArray = [];
  
      const filePath = path.resolve(__dirname, './volume/music', req.query.song + '.mp3');
  
      // not actually sure this is needed for anything???
      const stat = fileSystem.statSync(filePath);   // we need the size to divide into segments in the same way as frontend
  
      var tempArray = [];
      const fileContents = fileSystem.readFileSync(filePath);
      tempArray.push(fileContents);
  
      for (index = 0; index < stat.size; index += SEGMENT_SIZE) {
        tmpSeg = fileContents.slice(index, index + SEGMENT_SIZE);
  
        songArray.push(tmpSeg);
        // should result in [ [1, 1, 1, 0 ... (for SEGMENT_SIZE)], [...], [...], ...]
      }
      console.log("We are done loading the song!");
  
      console.log("Sending segment of length: " + songArray[req.query.segment].length);
      res.status(200).send(songArray[req.query.segment]);
  
    } else {
      console.log("Sending segment " + req.query.segment);
      console.log("This segment is of length " + songArray[req.query.segment].length);
      res.status(200).send(songArray[req.query.segment]);
      res.end();
    }
  });

  server.listen(2040, function () {
    //server.listen(process.env.PORT || '2000', function () {
    console.log('Server app listening on port 2040!');
  });