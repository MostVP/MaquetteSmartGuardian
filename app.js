var express = require('express');

var app = express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/smartguardiandb";

var database;

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', function(req, res) {
    res.render('index.ejs');
});

app.get('/index', function(req, res) {
    res.render('index.ejs');
});

app.get('/connexion', function(req, res) {
    res.render('login.ejs');
});
app.post('/adddb', function(req, res){
	var admins = [];
	var admin_login = req.body.login;
	var admin_password = req.body.password;
	var admin_cfpassword = req.body.confirmpassword;
	MongoClient.connect(url, function(err, db) {
		  if (err) throw err;
		  var dbo = db.db("smartguardiandb");
		  var myobj = { login: admin_login+"", password : admin_password+"" };
		  dbo.collection("admins").insertOne(myobj, function(err, res) {
		    if (err) throw err;  
		    console.log("1 document inserted");
		    dbo.close();
		  });
		  dbo.collection("admins").find().toArray(function(err, result){
		  	admins = result;

		  });
		});
	setTimeout(function(){
		res.render('gestionadmin.ejs', {admins : admins});
	}, 300);
	
	


});
app.post('/deletefromdb', function(req, res){
	console.log("reponse : >");

	var rep = req.body.select;
	console.log(rep);
	
	MongoClient.connect(url, function(err, db) {
			bool = false;
			console.log("dans connect");
			for (reps in rep) {
			console.log(bool)
			  if(rep[reps].length < 2){
			  	
			  	bool =true;
			  	break;
			  }
			  console.log("dans plusieurs");
			  if (err) throw err;
			  var dbo = db.db("smartguardiandb");
			  var myquery = { login : ''+rep[reps] };
			  console.log(rep[reps]);
			  dbo.collection("admins").remove(myquery, function(err, obj) {
			    if (err) throw err;
			    console.log(obj.result.n + " document(s) deleted");
			    
			  });

			}
			console.log(bool)

			if(bool){
				
					console.log("dans un seul");
					var dbo = db.db("smartguardiandb");
					var myquery = { login : ''+rep };
					console.log(rep);
					dbo.collection("admins").remove(myquery, function(err, obj) {
						    if (err) throw err;
						    console.log(obj.result.n + " document(s) deleted");
						    
						  });
				
			}
			
		

		

	
	var dbo = db.db("smartguardiandb");
	dbo.collection("admins").find().toArray(function(err, result){
			  	admins = result;

			  });
			dbo.close();
	setTimeout(function(){
		res.render('gestionadmin.ejs', {admins : admins});
	}, 300);
	/*var admins = [];
	var admin_login = req.body.login;
	var admin_password = req.body.password;
	var admin_cfpassword = req.body.confirmpassword;
	MongoClient.connect(url, function(err, db) {
		  if (err) throw err;
		  var dbo = db.db("smartguardiandb");
		  var myobj = { login: admin_login+"", password : admin_password+"" };
		  dbo.collection("admins").insertOne(myobj, function(err, res) {
		    if (err) throw err;  
		    console.log("1 document inserted");
		    dbo.close();
		  });
		  dbo.collection("admins").find().toArray(function(err, result){
		  	admins = result;

		  });
		});
	setTimeout(function(){
		res.render('gestionadmin.ejs', {admins : admins});
	}, 300);*/
	
	


});
});
app.get('/main', function(req, res) {    
    res.render('principal.ejs');
});
app.get('/gestionadmin', function(req, res) {    
    res.render('gestionadmin.ejs');
});

app.post('/main', function(req,res){
	bool = false;
	var user_login = req.body.login;
	var user_password = req.body.password;
	MongoClient.connect(url, function(err, db) {
	 if(err) throw err;
	  console.log("Database created!");
	var query = {
		login : ""+user_login,
		password : ""+user_password
	}
	 db.collection("superadmins").find(query).toArray(function(err, result){
		 
		 var admins = [];
		console.log("dans la collection super admin"+user_login+user_password);
		console.log(result);
		if(err) throw err;
			if(result.length > 0){
				console.log("super test");
				console.log(bool);
				bool = true;
				db.collection("admins").find().toArray(function(err, result){
					console.log("result");
					console.log(result)
					admins = result;
					console.log("admins");
				console.log(admins)
				res.render('gestionadmin.ejs', {admins : admins});
				});
				return;
			}
	});
	

	setTimeout(function(){
		if(!bool){
			console.log(" test");
				console.log(bool);
			
			db.collection("admins").find(query).toArray(function(err, result){
			console.log("dans la collection admin"+user_login+user_password);
			console.log(result);
			if(err) throw err;
				if(result.length > 0){

					res.redirect('/main');
					bool = true;
					return;
				}
				return;
		});
		
		}
		return;
	}, 300);
	

	
	return;
	
	
});
	setTimeout(function(){
		console.log("fin");
		console.log(bool);
		if(!bool){
			res.redirect("/connexion");
		}
		return;
		},600);
});
app.listen(8080);