
//  Created by Balu on 2017-07-18.
//  Copyright © 2017 Balu. All rights reserved.
var express = require('express')
var natural = require('natural');
var app = express();
var async = require('async');
var botsArray = [];

//Security Standards
var jwt 			= require('jsonwebtoken');
var bodyParser		= require('body-parser');
//var validator = require('validator');
app.use(bodyParser.urlencoded({ extended: false,parameterLimit: 1000000,limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));


app.post('/CreateAbot', function (req, res) {
 if (req.body.name) {
var isBotCreated = false;
	 async.waterfall([
		//Check if the bot is Already Created with same Name
		function isBotalreadyCreated(done){
			for(var i = 0; i < botsArray.length;i++){
			if (botsArray[i].name === req.body.name) {
				  isBotCreated = true;
				  break;
   				}	
			}
				done(null,null);
		},
		function createBot(done){
			if(!isBotCreated){
				var classifier =new natural.BayesClassifier();
				classifier.name = req.body.name;
				botsArray.push(classifier);
				console.log(botsArray)
				res.send('Sucess Creating bot with name '+botsArray);
			}
			else{
				res.send({"msg":"bot already created"});
			}
		},

		function (err_botCreation,results){
			if(err_botCreation){
				if(err_botCreation === 'arc'){
					res.send({"msg":"bot already created"});
				}
			}
			if(results){
				res.send({"msg":"bot already created"});
			}
			
		}	 
	 ]);

}
else{
	res.send('invalid Request');
}

});

app.post('/trainBot',function(req,res){

async.series([
	
function train(done){
for (var i = 0; i < botsArray.length; i++) {
	 if (botsArray[i].name===req.body.name) {
 		console.log('Bot Found and Traing the bot!');
	 	req.body.trainingSet.forEach(function(element) {
		 botsArray[i].addDocument(element.trainString,element.label);
	 	}, this);
	 	botsArray[i].train();
	 	res.send('Sucess Traing the bot')
 	}
	}
}

],function(err_train,Results_train){

});


});


app.post('/getdata',function(req,res){
for (var i = 0; i < botsArray.length; i++) {
 if (botsArray[i].name===req.body.name) {
 	console.log('Bot Found and getting data');

	 var finalclassificationResult = botsArray[i].getClassifications(req.body.label)
 	res.send({"label":finalclassificationResult});
 }
}
});

app.get('/getAllbots',function(req,res){
	var Botname = [];
botsArray.forEach(function(element) {
 Botname.push(element.name);
}, this);
res.send(Botname);
});
app.listen(3001);
