import express from 'express';
import cors from 'cors';

require('isomorphic-fetch');

let pc = {};
const pcUrl = 'https://gist.githubusercontent.com/isuvorov/ce6b8d87983611482aac89f6d7bc0037/raw/pc.json';
const IsDebug = true;

fetch(pcUrl)
  .then(async (res) => {
    pc = await res.json();
  })
  .catch(err => {
    console.log('Чтото пошло не так:', err);
  });

const app = express();
app.use(cors());

function NotFound(res){
  res.status(404).send("Not Found");
}

// index page
app.get('/', (req, res) => {
  res.send('Hello World');
});

// task 3a, lesson 3 Route для подссчта свободного места
app.get('/task3a/volumes', (req, res) => {

  let myDisks = {};

  if(pc.hdd == undefined )
  {
    NotFound(res);
  }

  for( let disk in pc.hdd ){
    let size = pc.hdd[disk].size;
    if (myDisks[pc.hdd[disk].volume]) {
      size = parseInt(myDisks[pc.hdd[disk].volume], 10) + pc.hdd[disk].size;
    }
    myDisks[pc.hdd[disk].volume] = `${size}B`;
  }

  if(IsDebug){
    console.log(Object.keys(myDisks).length);
  }

  if( Object.keys(myDisks).length == 0)
  {
    NotFound(res);
  }else{
    res.json(myDisks);
  }
});

// task 3a refactoring, lesson 3
app.get('/task3a(*)?', (req, res) => {
  let aParams, Params;
  //массив параметров для поиска
  if(req.params[0] !== undefined){

    Params=req.params[0].trim().replace(/\/{2,}/g,'/').replace(/^\/|\/$/g,'');

    if(IsDebug){
      console.log(Params);
    }

    aParams=Params==""?[]:Params.split('/');

  }else{
    aParams=[];
  }

  let pc_res = pc;

  for( let i in aParams ){
    //Only for debug in console
    if(IsDebug){
      try{
        console.log('*******************************');
        console.log(req.params[0]);
        console.log('hasOwnProperty:' + pc_res.hasOwnProperty(aParams[i]));
        console.log(pc_res[aParams[i]]);
        console.log( '== undefined:' + (pc_res[aParams[i]].constructor()[aParams[i]] == undefined) );
        console.log(typeof pc_res[aParams[i]]);
        console.log(typeof pc_res[aParams[i]].constructor()['length']);
        console.log('===========================');
      }catch(e){
        console.log(e);
      }
    }

    if( pc_res.hasOwnProperty(aParams[i]) && pc_res.constructor()[aParams[i]] == undefined){
      pc_res = pc_res[aParams[i]];
    }else{
      pc_res = undefined;
      break;
    }
  }

  if(pc_res == undefined && pc_res !== null)
    NotFound(res);
  else
    res.json(pc_res);
});

app.listen(3000, () => {
  console.log('Your app listening on port 3000 ...');
});
