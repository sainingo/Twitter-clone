const express = require('express');
const cors = require('cors');
const monk = require('monk');


const app = express();
const db = monk('localhost/meower');
const mews = db.get('mews');

//using cors as a middleware - any incoming request will pass throug this middleware
app.use(cors());
//json body parser middleware built in express
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
      message: 'Meower! 😆'
  });
});


//when the server gets a req should respond with this
app.get('/mews', (req, res) => {
  mews.find()
      .then(mews => {
        res.json(mews);
      });
});

//function
function isValidMew(mew) {
    return mew.name && mew.name.toString().trim() !== '' && 
     mew.content && mew.content.toString().trim() !== ''
}


//post route
app.post('/mews', (req, res) => {
 //console.log(req.body);
 if (isValidMew(req.body)) {
    //  insert into db...
    const mew = {
        name : req.body.name.toString(),
        content :  req.body.content.toString(),
        created: new Date()
    };
    console.log(mew);
    mews
        .insert(mew)
        .then(createdMew => {
            res.json(createdMew);
        })

 } else {
     res.status(422);
     res.json( {
         message : 'hey, name and content are required!'
     });
 }
});

app.listen(5000, () => {
    console.log('listening on http://localhost:5000');
});