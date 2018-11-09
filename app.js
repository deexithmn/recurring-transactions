var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
// var sanity_check = require("../../sanity_check/test.js");
var Transaction = require("./models/transaction");
var User = require("./models/user");
var qs = require('querystring');
var mongoose = require("mongoose");

var app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())
app.use(methodOverride("_method"));




mongoose.connect("mongodb://localhost/dummyoh", { useNewUrlParser: true });






let validTransactions = [];
let validusers = [];

app.get("/",function(req,res){


	Transaction.aggregate([{"$group" : {_id:{user_id:"$user_id"},  count:{$sum:1}}}],
		function(err, transactionFound){
							    		if(err){
							           		console.log(err)
							        	}else{
							            	for(let i=0;i<transactionFound.length; i++){
							            		if(transactionFound[i].count>2){
							            			validusers.push(transactionFound[i]["_id"]);
							            		}
							            	}
							            	console.log("calling recurring");
							        	getRecurring(validusers);
							        	}
							    	}
							    	);
	
							        	res.send( "successfully");
  
			

});


app.post('/', function(req,res){
	var post_data = req.body;
	addTrasanctionsToDb(post_data);
	console.log("Transaction added to db");
	res.redirect("/");
});



app.listen(1984 || process.env.PORT,process.env.IP,function(){
    console.log("Server Running!!")
    console.log("Local Host:1984");
});




function addTrasanctionsToDb(post_data){
	console.log("from add tractions");
	for(let obj of post_data)
	{
		Transaction.find({trans_id:obj.trans_id}, function(err, foundTransaction){
			if(err)
			{
				console.log(err);
			}
			else
			{
				if(foundTransaction.length<1)
				{
					Transaction.create
					(
						{
							trans_id:obj.trans_id,
							name:obj.name,
							user_id:obj.user_id,
						    amount:obj.amount,
						    date:obj.date
						}
					)
				}else{
					console.log("Duplicate Transaction ID: "+obj.trans_id);
				}
			}
	})
	}}


	function getRecurring(validusers){
		console.log(validusers)
		let checkingForNames = {}
		for(let user of validusers){
			Transaction.aggregate([{"$group":   {_id : 
													{
														name:"$name", 
														amount:"$amount",
														trans_id:"$trans_id",
														user_id:user.user_id
													}
												},
									},
									    {"$sort":{date:1}}
								  ],
									function(err, transactionFound){
														    		if(err)
														    		{
														           		console.log(err)
														        	}
														        	else
														        	{
												            		   for(let transaction of transactionFound)
												            		   {
													            			
													            			var str = transaction._id.name.split(" ");
																		    var amount = transaction._id.amount;
																		    Transaction.find(
													    									{$and :[{amount : {$gt: amount-0.50, $lt: amount+0.50}},{name:str[0]},
													    									{user_id:user.user_id}]}
																		
																							,function(err,matchingTransactions)
																							{
																		    					if(err)
																		    					{
																		    						console.log(err)
																		    					}
																		    					else
																		    					{
																		    						
																		    						var dataCounter = {
																		    						};
																		    						for(let i=0; i<matchingTransactions.length-1; i++){
																		    							console.log(matchingTransactions.length)
																		    							console.log(matchingTransactions[i].name);
																		    							console.log(matchingTransactions[i].date-matchingTransactions[i+1].date)
																		    							dataCounter[matchingTransactions[i].date-matchingTransactions[i+1].date] = ++dataCounter[matchingTransactions[i].date-matchingTransactions[i+1].date] | 1;
																		    						}
																		    						for(var values in dataCounter){
																		    							console.log("----------Count Values")
																		    							console.log(dataCounter[values] +" :" + values);
																		    							// Need to continue here!!


																		    						}
																		    					}
								            												})								            		
								            							}
								            						}
								            						})
									}
						}	
