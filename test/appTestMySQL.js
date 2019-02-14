'use strict';

var cluster = require('cluster');
if (cluster.isMaster) {
    cluster.fork();

    cluster.on('exit', function (worker, code, signal) {
        cluster.fork();
    });
}

if (cluster.isWorker) {
    // put your code here




    var winston = require('./config/log');

    var colors = require('colors');
    winston.debug(colors.green("Hi! I'm the RulesEnginePub"));

	var credentials = require('./config/mysql');
    var mysql = require('mysql');
    var pool = mysql.createPool(credentials);

    console.log("Connecting to MySQL...");
	console.log(JSON.stringify(credentials));

    setTimeout(connectToMySql, 1000);

	
	function connectToMySql() {
        //se qui è ok, allora provo la connessione con mysql
        pool.getConnection(function (err, connection) {

            if (err) {
                console.log('Errore nella connessione a MySQL');
				
                setTimeout(connectToMySql, 1000);
            }
            else {
                console.log('Connected to MySQL!');
                setTimeout(connectToMySql, 1000);
            }
        });


    }
	
	 


}



 