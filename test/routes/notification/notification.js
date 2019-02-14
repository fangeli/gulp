//------------------
//query
//------------------
var xml2Js = require('xml2js');
var parser = new xml2Js.Parser();
var fs = require("fs");
var xmlfile = fs.readFileSync("./routes/notification/notification.xml");
var queries;
parser.parseString(xmlfile, function (err, result) {
    queries = result['queries'];
});

//------------------
//utility
//------------------
var notification_util = require("./notification_util.js");
 
//------------------
//validator
//------------------
var notification_validator = require("./notification_validator.js");

//------------------
//async
//------------------
var async = require("async");


//------------------
//init
//------------------
var errorCodeEnum = { NoError: 1, ErrorGeneric: 0, ParametriObbligatoriMancanti: -55, UpdateAll: 15 };
var errorCode = errorCodeEnum.NoError;
var errorDescription = "";

var actionType = { Update: "1", Delete: "0" };
var systemType = { Enabled: "1", Disabled: "0" };

var rulesEnginePubConfig = require("../../config/ws");


var mysql = require('mysql');
var credentials = require('../../config/mysql');

module.exports = (express, connection, connectionClient2, winston) => {


    
    var router = new express.Router();


    //router.route('/create')
    //    .post((req, res, next) => {
    //        checkConnection(next);
    //    });
 
    //router.route('/update')
    //    .patch((req, res, next) => {
    //        checkConnection(next);
    //    });

 
     
    router.route('/create')

        .post((req, res) => {

            var title = "create";

            var idRule = req.body.idRule;
            var idUser = req.body.idUser;
            var system = req.body.system;
            var emails = req.body.emails; 

            errorCode = errorCodeEnum.NoError;
            errorDescription = "";

            if (idRule == undefined || idRule.trim() == "") {
                errorCode = errorCodeEnum.ParametriObbligatoriMancanti;
                errorDescription += "Parametro \'idRule\' mancante. ";
            }
            if (idUser == undefined || idUser.trim() == "") {
                errorCode = errorCodeEnum.ParametriObbligatoriMancanti;
                errorDescription += "Parametro \'idUser\' mancante. ";
            }
            if (system == undefined || system.trim() == "") {
                //metto un valore di default
                system = systemType.Disabled;
            }
            if (emails == undefined || emails.trim() == "") {
                //metto un valore di default
                emails = null;
            }
             
         
            if (errorCode <= 0) {
                //error
                res.jsonp({ status: errorCode, error: errorDescription, result: { objs: [] }});
            } else {
                //go
                var qq = notification_util.create(idRule, idUser, system, emails, queries);
                var query = connection.query(qq, (err, rows, fields) => {
               

                    if (err) {

                        winston.error("notification_util.create: " + qq);
                        winston.error("notification_util.create: " + err.stack);
                        errorCode = errorCodeEnum.ErrorGeneric;
                        errorDescription += err;
                        res.jsonp({ status: errorCode, error: errorDescription, result: { objs: [] }});
                    }
                    else {

                        //----------------------------
                        //CALL NEXT ROUTER
                        //----------------------------
                        CallIntervalCreate(express, connection, connectionClient2, winston, router, req, res);
                          
                    }


                });
            }
        });
     
    router.route('/update')

        .patch((req, res) => {

            var title = "update";

            //------------
            //input
            //------------
            var idRule = req.body.idRule;
            var idUser = req.body.idUser;
            var system = req.body.system;
            var emails = req.body.emails; 

            //------------
            //validazione
            //------------
            errorCode = errorCodeEnum.NoError;
            errorDescription = "";
            if (idRule == undefined || idRule.trim() == "") {
                errorCode = errorCodeEnum.ParametriObbligatoriMancanti;
                errorDescription += "Parametro \'idRule\' mancante. ";
            }
            if (idUser == undefined || idUser.trim() == "") {
                errorCode = errorCodeEnum.ParametriObbligatoriMancanti;
                errorDescription += "Parametro \'idUser\' mancante. ";
            }
            if (system == undefined || system.trim() == "") {
                 //metto un valore di default
                system = systemType.Disabled;
            } 
            if (emails == undefined || emails.trim() == "") {
                //metto un valore di default
                emails = null;
            }
             
            //------------
            //START
            //------------
            if (errorCode <= 0) {
                //error
                res.jsonp({ status: errorCode, error: errorDescription, result: { objs: [] }});
            }
            else {
                //go
                var qq = notification_util.update(idRule, idUser, system, emails, queries);
                var query = connection.query(qq, (err, rows, fields) => {
                  

                    if (err) {

                        errorCode = errorCodeEnum.ErrorGeneric;
                        errorDescription += err;
                        res.jsonp({ status: errorCode, error: errorDescription, result: { objs: [] }});
                    }
                    else { 

                        //----------------------------
                        //CALL NEXT ROUTER
                        //----------------------------
                        CallIntervalUpdate(express, connection, connectionClient2, winston, router, req, res);
                    }

                });
            }
        });
     


    function CallIntervalUpdate(express, connection, connectionClient2, winston, router, req, res) {
        //faccio agg unit
        var interval = require('../interval/interval')(express, connection, connectionClient2, winston);
        router.use('/notificationInterval', interval);
        req.url = '/notificationInterval/update';
        req.method = 'PATCH'; 
        router.handle(req, res);
    }

    function CallIntervalCreate(express, connection, connectionClient2, winston, router, req, res) {

        var interval = require('../interval/interval')(express, connection, connectionClient2, winston);
        router.use('/notificationInterval', interval);
        req.url = '/notificationInterval/create';
        req.method = 'POST'; 
        router.handle(req, res);

    }


    function checkConnection(next) {

        
        if (!connection
            || connection.state == "disconnected"
            || connection.state == "protocol_error") {

            connection = mysql.createConnection(credentials);
            connection.connect(
                function (err) {
                    if (err) {

                        console.log("checkConnection-err: " + err.stack);
                    }
                    next();
                }
            );
        }
        else {
            next();
        }
    }	
    
 

    return router;
}