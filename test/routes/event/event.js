//------------------
//query
//------------------
var xml2Js = require('xml2js');
var parser = new xml2Js.Parser();
var fs = require("fs");
var xmlfile = fs.readFileSync("./routes/event/event.xml");
var queries;
parser.parseString(xmlfile, function (err, result) {
    queries = result['queries'];
});
 

//------------------
//utility
//------------------
var event_util = require("./event_util.js");
 

//------------------
//async
//------------------
var async = require("async");


//------------------
//init
//------------------
var errorCodeEnum = { NoError: 1, ErrorGeneric: 0, ParametriObbligatoriMancanti: -55 };
var errorCode = errorCodeEnum.NoError;
var errorDescription = ""; 

var actionType = { Update: "1", Delete: "0" };
var systemType = { Enabled: "1", Disabled: "0" };

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

    //router.route('/read')
    //    .get((req, res, next) => {
    //        checkConnection(next);
    //    });


    //router.route('/markAsRead')
    //    .patch((req, res, next) => {
    //        checkConnection(next);
    //    });
     

    router.route('/create')

        .post((req, res) => {

            var title = "create";

            var idRuleUnit = req.body.idRuleUnit;
            var idUser = req.body.idUser;
            var geodata = req.body.geodata;
            var read = req.body.read;

            errorCode = errorCodeEnum.NoError;
            errorDescription = "";

            if (idRuleUnit == null || idRuleUnit.trim() == "") {
                errorCode = errorCodeEnum.ParametriObbligatoriMancanti;
                errorDescription += "Parametro \'idRuleUnit\' mancante. ";
            }
            if (idUser == null || idUser.trim() == "") {
                errorCode = errorCodeEnum.ParametriObbligatoriMancanti;
                errorDescription += "Parametro \'idUser\' mancante. ";
            }

            if (geodata == null || geodata.trim() == "") {
                errorCode = errorCodeEnum.ParametriObbligatoriMancanti;
                errorDescription += "Parametro \'geodata\' mancante. ";
            }
            if (read == null || read == undefined) {
                read = 0;
            }

            if (errorCode <= 0) {
                //error
                res.jsonp({ status: errorCode, error: errorDescription, result: { objs: [] }});
            } else {
                //go
                var qq = event_util.create(idRuleUnit, idUser, geodata, read, queries);
                var query = connection.query(qq, (err, rows, fields) => {
                    winston.debug(query.sql);

                    if (err) {

                        errorCode = errorCodeEnum.ErrorGeneric;
                        errorDescription += err;
                        res.jsonp({ status: errorCode, error: errorDescription, result: { objs: [] }});
                    }
                    else {

                        var obj = new Object();
                        obj.idRuleUnit = idRuleUnit;
                        obj.idUser = idUser;
                        obj.geodata = geodata;
                        obj.read = read;
                        obj.id = rows.insertId;
                        obj.action = title;
                        guid = generateUUID();
                        obj.guid = guid;
                        notifyRulesEnginePub(connectionClient2, obj);

                        res.jsonp({
                            status: errorCode,
                            error: errorDescription,
                            title: title,
                            result: {}
                        });
                    }


                });
            }
        });


    router.route('/read')

        .get((req, res) => {

            var title = "read";
            
            var idUser = req.query.idUser;


            errorCode = errorCodeEnum.NoError;
            errorDescription = "";

            if (idUser == null || idUser.trim() == "") {
                errorCode = errorCodeEnum.ParametriObbligatoriMancanti;
                errorDescription += "Parametro \'idUser\' mancante. ";
            } 


            if (errorCode <= 0) {
                //error
                res.jsonp({ status: errorCode, error: errorDescription, result: { objs: [] }});
            } else {
                var qq = event_util.read(idUser, queries);
                var query = connection.query(qq, (err, rows, fields) => {

                    winston.debug(query.sql);

                    if (err) {

                        errorCode = errorCodeEnum.ErrorGeneric;
                        errorDescription += err;
                        res.jsonp({ status: errorCode, error: errorDescription, result: { objs: [] }});
                    }
                    else {

                        var obj = new Object();
                        obj.idUser = idUser;
                        obj.action = title; ù
                        guid = generateUUID();
                        obj.guid = guid;
                        notifyRulesEnginePub(connectionClient2, obj);

                        res.jsonp({
                            status: errorCode,
                            error: errorDescription,
                            title:title,
                            result: { objs: rows }
                        });
                    }

                });

            }



        });

    router.route('/markAsRead')

        .patch((req, res) => {

            var title = "markAsRead";

            var id = req.body.id;
            var idUser = req.body.idUser;
 

            errorCode = errorCodeEnum.NoError;
            errorDescription = "";

            if (id == null || id.trim() == "") {
                errorCode = errorCodeEnum.ParametriObbligatoriMancanti;
                errorDescription += "Parametro \'id\' mancante. ";
            }
           
            if (idUser == null || idUser.trim() == "") {
                errorCode = errorCodeEnum.ParametriObbligatoriMancanti;
                errorDescription += "Parametro \'idUser\' mancante. ";
            }

            if (errorCode <= 0) {
                //error
                res.jsonp({ status: errorCode, error: errorDescription, result: { objs: [] }});
            } else {
                //go
                var qq = event_util.markAsRead(id, idUser, queries);
                var query = connection.query(qq, (err, rows, fields) => {
                    winston.debug(query.sql);

                    if (err) {

                        errorCode = errorCodeEnum.ErrorGeneric;
                        errorDescription += err;
                        res.jsonp({ status: errorCode, error: errorDescription, result: { objs: [] }});
                    }
                    else {

                        var obj = new Object();
                        obj.id = id;
                        obj.idUser = idUser;
                        obj.action = title;
                        guid = generateUUID();
                        obj.guid = guid;
                        notifyRulesEnginePub(connectionClient2, obj);

                        res.jsonp({
                            status: errorCode,
                            error: errorDescription,
                            title:title,
                            result: {}
                        });
                    }


                });
            }
        });
    
    function notifyRulesEnginePub(client, obj) {

        client.connect(rulesEnginePubConfig.websocketServerUrl, rulesEnginePubConfig.websocketServerProtocol);
        connectionClient2.on('connect', function (connectionClient) {
            if (guid == obj.guid) {
                connectionClient.sendUTF(JSON.stringify(obj));
            }
        });
    }

    //TODO: metterlo in un file comune
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