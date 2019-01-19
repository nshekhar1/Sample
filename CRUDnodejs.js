	var mongodb = require('mongodb');
	var MongoClient = require('mongodb').MongoClient;
	var assert = require('assert');
	var url = 'mongodb://https://mongodbsample.documents.azure.com:443/db';
	var express = require('express');
	var app = express();
	var application_root = __dirname;
	var path = require( 'path' );
	app.use(function(req, res, next) {
		
			// Website you wish to allow to connect
			res.header("Access-Control-Allow-Origin", "*");
			// Request methods you wish to allow
			res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
			// Request headers you wish to allow
			res.header("Access-Control-Allow-Headers", "X-Requested-With");
			res.header("Access-Control-Allow-Headers", "Content-Type");
			next();
	 });
	 app.use( express.static( path.join( application_root ) ) );
	var server = require('http').createServer(app);
	/*var io = require('C:\\Users\\onasri\\AppData\\Roaming\\npm\\node_modules\\socket.io')(server);
	io = io.listen(server, {log:false, origins:'*:*'});*/
	
	
	var fs = require("fs");
	//populate the dataBase in first time
   fs.readFile( "persons.json", 'utf8', function (err, data) {
       persons = JSON.parse( data );
	   MongoClient.connect(url, function(err, db) {
				 assert.equal(null, err);
				 db.collection('persons').remove({})
				 db.collection('persons').drop();
				 db.collection('persons').insert( persons, function(err, result) {
					console.log( result );
 					assert.equal(err, null);
					console.log("Inserted many documents into persons collection.");
					 db.close();
				 }); 
			});  
   });

   var insertPerson = function(db, obj, callback) {
			 db.collection('persons').insertOne(  obj, function(err, result) {
				assert.equal(err, null);
				console.log("Inserted a new person into the persons collection.");
				callback();
			 }); 
		};
	var findPersons = function(db, callback) {
		var cursor = db.collection('persons').find();
		   cursor.toArray(function(err, items) {
				console.log(items);
				callback(items);
		  });
 	};
	var updatePersons = function(db, arg, callback) {
	   var  obj = JSON.parse(arg);
	   var key =  obj["_id"];
	   db.collection('persons').updateOne(
		  {"_id": new mongodb.ObjectID(""+key)},
		  {
			 $set: { "firstname": obj.firstname, "lastname": obj.lastname, "adress":{"zipcode":  obj.adress.zipcode, "country": obj.adress.country}}
		  }, function(err, results) {
			  console.log(results);
			  callback();
	   }); 
	};
	var removePersons = function(db, key, callback) {
 	    db.collection('persons').deleteMany(
		  { "_id": new mongodb.ObjectID(key)},
			  function(err, results) {
				 console.log(results);
				 callback();
		  }
	   );
	};
	
	//RESTFUL methods		
	app.get('/getPersons', function (req, res) {	  
		 	MongoClient.connect(url, function(err, db) {
				 assert.equal(null, err);
				 findPersons(db, function(data){ db.close(); res.end(JSON.stringify(data)); });
			}); 
		
	});		 
	app.get('/addPerson', function (req, res) {	  
		 	MongoClient.connect(url, function(err, db) {
				//to process other instructions we check if err != null
				 assert.equal(null, err);
				 //get parameter from url request
				 var obj = req.query.obj;
 				 insertPerson(db, JSON.parse(obj), function(){
					 db.close();
					 res.end("true");
				 }); 
			}); 
	});
	app.get('/updatePerson', function (req, res) {	
			
			MongoClient.connect(url, function(err, db) {
				 //to process other instructions we check if err != null
				 assert.equal(null, err);
				 //get parameter from url request
				 var obj = req.query.obj;	
 				 updatePersons(db, obj, function(){
					 db.close();
					 res.end("true");
				 }); 
			});
	}); 
	app.get('/removePerson', function (req, res) {	   
			MongoClient.connect(url, function(err, db) {
				var key = req.query.id;
				 assert.equal(null, err);
				 console.log("remove person id : "+ key);
				  removePersons(db, key, function(){
					 db.close();
					 res.end("true");
				 }); 
			});
	});
	
	//create our server that listening at 127.0.0.1:8081
	//server.listen(8081, function () {
	//  var host = server.address().address
	//  var port = server.address().port
	//  console.log("Example app listening at http://%s:%s", host, port)
	//});  
 
