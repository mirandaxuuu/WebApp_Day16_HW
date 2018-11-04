const express = require('express');
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const request = require('request');
const accessKey = '008b882bc469731393a0753a43a30769';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

app.get('/', function(req, res){
	res.render('index');
})


app.post('/', function(req, res){

	//get the input
	let textInput = req.body.text;
	// console.log(textInput);

	//ULI encode
	let textEncoded = encodeURIComponent(textInput);
	// console.log(textEncoded);

	//set the url
	let url = `http://apilayer.net/api/detect?access_key=${accessKey}&query=${textEncoded}`;


  request(url, function (err, response, body) {
    if(err){
      res.render('index', {answer: null, error: 'Sorry, there is an error'});
    } else {
      let answer = JSON.parse(body)
      if(answer.results[0].language_name == undefined){
        res.render('index', {answer: null, error: 'Sorry, there is an error'});
      } else {
        let answerText = `The language of your text is ${answer.results[0].language_name}. I am ${answer.results[0].probability} percent sure about my answer.`;
        res.render('index', {answer: answerText, error: null});
      }
    }
  }); //close request

}) //close app.post


app.listen(3000, function(){
	console.log('app is running on port 3000');
})

