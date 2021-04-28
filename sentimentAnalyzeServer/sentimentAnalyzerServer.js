const express = require('express');
const app = new express();
const dotenv = require('dotenv');
dotenv.config();

function getNLUInstance() {
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2020-08-01',
        authenticator: new IamAuthenticator({
          apikey:  process.env.API_KEY,
        }),
        serviceUrl: process.env.API_URL,
      });

    return naturalLanguageUnderstanding;
}

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {

    //return res.send({"happy":"90","sad":"10"});

    const analyzeParams = {
        'url' : req.query.url,
        'features': {
          'emotion': {
          }
        }
      };
      
      getNLUInstance().analyze(analyzeParams)
        .then(analysisResults => {
          console.log(JSON.stringify(analysisResults, null, 2));
          res.send(analysisResults.result.emotion.document.emotion)
        })
        .catch(err => {
          console.log('error:', err);
          res.status(500).send("Could not process request.")
        });
});

app.get("/url/sentiment", (req,res) => {
    //return res.send("url sentiment for "+req.query.url);


    const analyzeParams = {
        'url' : req.query.url,
        'features': {
          'sentiment': {
          }
        }
      };
      
      getNLUInstance().analyze(analyzeParams)
        .then(analysisResults => {
          console.log(JSON.stringify(analysisResults, null, 2));
          res.send(analysisResults.result.sentiment.document.label)
        })
        .catch(err => {
          console.log('error:', err);
          res.status(500).send("Could not process request.")
        });
});

app.get("/text/emotion", (req,res) => {
    //return res.send({"happy":"10","sad":"90"});

    const analyzeParams = {
        'text' : req.query.text,
        'features': {
          'emotion': {
          }
        }
      };
      
      getNLUInstance().analyze(analyzeParams)
        .then(analysisResults => {
          console.log(JSON.stringify(analysisResults, null, 2));
          res.send(analysisResults.result.emotion.document.emotion);
        })
        .catch(err => {
          console.log('error:', err);
          res.status(500).send("Could not process request.");
        });
});

app.get("/text/sentiment", (req,res) => {
    //return res.send("text sentiment for "+req.query.text);

    const analyzeParams = {
        'text' : req.query.text,
        'features': {
          'sentiment': {
          }
        }
      };
      
      getNLUInstance().analyze(analyzeParams)
        .then(analysisResults => {
          console.log(JSON.stringify(analysisResults, null, 2));
          res.send(analysisResults.result.sentiment.document.label);
        })
        .catch(err => {
          console.log('error:', err);
          res.status(500).send("Could not process request.");
        });
    
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

