import express from 'express';
import cors from 'cors';

require('isomorphic-fetch');

let pc = {};
const RouteDiskVolumesName="volumes";
const pcUrl = 'https://gist.githubusercontent.com/isuvorov/ce6b8d87983611482aac89f6d7bc0037/raw/pc.json';

const app = express();
app.use(cors());

// index page
app.get('/', (req, res) => {
  res.send('Hello World');
});

// task 3a lesson 3
app.get('/task3a/:p1?/:p2?/:p3?', (req, res) => {

  if( req.params.p1 == undefined ){

    res.json(pc);

  } else if( pc[req.params.p1] !== undefined && req.params.p2 == undefined ){

    res.json(pc[req.params.p1]);

  } else if( pc[req.params.p1] !== undefined && pc[req.params.p1][req.params.p2] !== undefined ){

    if( pc[req.params.p1][req.params.p2][req.params.p3] !== undefined ){

      res.json(pc[req.params.p1][req.params.p2][req.params.p3]);

    }else if(pc[req.params.p1][req.params.p2] !== undefined && typeof pc[req.params.p1][req.params.p2] !== 'function'){

      res.json(pc[req.params.p1][req.params.p2]);

    } else {

        res.status(404).send('Not found');
    }
    
  } else if( req.params.p1 == RouteDiskVolumesName ){

    let myDisk={}, myDiskSize={};

    for( let i=0; i< pc.hdd.length; i++ ) {
      myDisk[pc.hdd[i].volume.toString()] = ( myDisk[pc.hdd[i].volume.toString()] == undefined ? 0 : myDisk[pc.hdd[i].volume.toString()] ) + pc.hdd[i].size;
      myDiskSize[pc.hdd[i].volume.toString()] = myDisk[pc.hdd[i].volume.toString()] + 'B'
    }

    res.json(myDiskSize);

  }else{

    res.status(404).send('Not found');

  }

});

fetch(pcUrl)
  .then(async (res) => {
    pc = await res.json();
  })
  .catch(err => {
    console.log('Чтото пошло не так:', err);
  });

app.listen(3000, () => {
  console.log('Your app listening on port 3000 ...');
});
