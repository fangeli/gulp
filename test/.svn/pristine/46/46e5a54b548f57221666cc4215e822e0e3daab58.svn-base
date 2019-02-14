//------------------
//query
//------------------
var xml2Js = require('xml2js');
var parser = new xml2Js.Parser();
var fs = require("fs");
var xmlfile = fs.readFileSync("./routes/interval/interval.xml");
var queries;
parser.parseString(xmlfile, function (err, result) {
    queries = result['queries'];
});
 
//------------------
//utility
//------------------
var interval_util = require("./interval_util.js");

//------------------
//validator
//------------------
var interval_validator = require("./interval_validator.js");



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

var rulesEnginePubConfig = require("../../config/ws");

var guid;

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
            var timeValidity = req.body.timeValidity; 

            errorCode = errorCodeEnum.NoError;
            errorDescription = "";

            if (idRule == null || idRule.trim() == "") {
                errorCode = errorCodeEnum.ParametriObbligatoriMancanti;
                errorDescription += "Parametro \'idRule\' mancante. ";
            }
            if (idUser == null || idUser.trim() == "") {
                errorCode = errorCodeEnum.ParametriObbligatoriMancanti;
                errorDescription += "Parametro \'idUser\' mancante. ";
            }

            if (timeValidity == null || timeValidity.trim() == "") {
                timeValidity = '{"key": "always"}';
            } 

            if (errorCode <= 0) {
                //error
                res.jsonp({ status: errorCode, error: errorDescription, result: { objs: [] }});
            } else {
                //go
                var qq = interval_util.create(idRule, idUser, timeValidity, queries);
                var query = connection.query(qq, (err, rows, fields) => {
                 

                    if (err) {

                        winston.error("interval_util.create: " + qq);
                        winston.error("interval_util.create: " + err.stack);
                        errorCode = errorCodeEnum.ErrorGeneric;
                        errorDescription += err;
                        res.jsonp({ status: errorCode, error: errorDescription, result: { objs: [] }});
                    }
                    else {

                        var obj = new Object();
                        obj.idRule = idRule;
                        obj.idUser = idUser;
                        obj.action = title;
                        guid = generateUUID();
                        obj.guid = guid;
                        //***********************
                        //notifyRulesEnginePub
                        //***********************
                        notifyRulesEnginePub(connectionClient2, obj, winston);
 

                        //---------------------------
                        //END
                        //---------------------------
                        res.jsonp({
                            status: errorCode,
                            error: errorDescription,
                            title: obj.action,
                            result: { objs: obj }
                        }); 
                       
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
            errorCode = errorCodeEnum.NoError;
            errorDescription = "";
            var idRule = req.body.idRule;
            var idUser = req.body.idUser;
            var timeValidity = req.body.timeValidity; 

            //------------
            //validazione
            //------------
            if (idRule == null || idRule.trim() == "") {
                errorCode = errorCodeEnum.ParametriObbligatoriMancanti;
                errorDescription += "Parametro \'idRule\' mancante. ";
            }
            if (idUser == null || idUser.trim() == "") {
                errorCode = errorCodeEnum.ParametriObbligatoriMancanti;
                errorDescription += "Parametro \'idUser\' mancante. ";
            }
            if (timeValidity == null || timeValidity.trim() == "") {
                timeValidity = null;
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
                var qq = interval_util.update(idRule, idUser, timeValidity, queries);
                var query = connection.query(qq, (err, rows, fields) => {
                    winston.debug(query.sql);

                    if (err) {

                        errorCode = errorCodeEnum.ErrorGeneric;
                        errorDescription += err;
                        res.jsonp({ status: errorCode, error: errorDescription, result: { objs: [] }});
                    }
                    else {

                        var obj = new Object();
                        obj.idRule = idRule;
                        obj.idUser = idUser;
                        obj.action = title;
                        guid = generateUUID();
                        obj.guid = guid;
                        //***********************
                        //notifyRulesEnginePub
                        //***********************
                        notifyRulesEnginePub(connectionClient2, obj, winston);
                       
                        //---------------------------
                        //END
                        //---------------------------
                        res.jsonp({
                            status: errorCode,
                            error: errorDescription,
                            title: obj.action,
                            result: { objs: obj }
                        });
                             
                         
                    }


                });
            }
        });
     


    function notifyRulesEnginePub(client, obj, winston) {

        winston.silly("Sending a message to server with websocket");

        client.connect(rulesEnginePubConfig.websocketServerUrl, rulesEnginePubConfig.websocketServerProtocol);
        connectionClient2.on('connect', function (connectionClient) {
            if (guid == obj.guid) {
                connectionClient.sendUTF(JSON.stringify(obj));
            }
            
            
        }); 
    }

    function generateUUID() { // Public Domain/MIT
        var d = new Date().getTime();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
            d += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
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