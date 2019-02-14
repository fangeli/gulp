//------------------
//query
//------------------
var xml2Js = require('xml2js');
var parser = new xml2Js.Parser();
var fs = require("fs");
var xmlfile = fs.readFileSync("./routes/view/view.xml");
var queries;
parser.parseString(xmlfile, function (err, result) {
    queries = result['queries'];
});

 
//------------------
//utility
//------------------
var view_util = require("./view_util.js");
 
 


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



    router.route('/test1')
        .post((req, res, next) => {
            checkConnection(next);
        });

    router.route('/test2')
        .post((req, res, next) => {
            checkConnection(next);
        });

    router.route('/testOld')
        .post((req, res, next) => {
            checkConnection(next);
        });

    router.route('/test')
        .post((req, res, next) => {
            checkConnection(next);
        });

    router.route('/createAll')
        .post((req, res, next) => {
            checkConnection(next);
        });


    router.route('/create')
        .post((req, res, next) => {
            checkConnection(next);
        });


    router.route('/test1')

        .post((req, res) => {

            winston.debug("test1");
            req.body.idRule = 123;
        });

    router.route('/test2')

        .post((req, res) => {

            winston.debug("test2");
            
        });

    router.route('/testOld')

        .post((req, res) => {
 
            winston.debug("test");
            req.url = '/test1';
            req.method = 'POST'; res.message
            router.handle(req, res);

            //qui prendo il valore di ritorno
            var idRule = req.body.idRule;

            //e faccio una insert della unit


            winston.debug(req.body.expression1);
        });

    router.route('/test')

        .post((req, res) => {

            winston.debug("test");

            var title = "test";


            var rule = require('../rule/rule')(express, connection, connectionClient2, winston);
            router.use('/aaaaaa', rule);

            req.url = '/aaaaaa/create';
            req.method = 'POST';
            req.body.caller = 'view';

            var deasync = require('deasync');
            deasync.loopWhile(router.handle(req, res));

            //qui prendo il valore di ritorno
            var idRule = req.body.idRule;
            winston.debug("idRule: " + idRule);

            //e faccio una insert della unit
            var unit = require('../unit/unit')(express, connection, connectionClient2, winston);
            router.use('/bbbbb', unit);

            req.url = '/bbbbb/create';
            req.method = 'POST';
            req.body.caller = 'view';

            router.handle(req, res);
            //qui prendo il valore di ritorno
            var idUnitRule = req.body.idUnitRule;
            winston.debug("idUnitRule: " + idUnitRule);

            res.jsonp({
                status: errorCode,
                error: 'Creati rule e unit',
                title: title,
                result: {
                    idRule: idRule,
                    idRuleUnit: idUnitRule
                }
            });

             


            
        });

    router.route('/createAll')

        .post((req, res) => {

            //qui vogliamo fare una insert in rule
            winston.debug("qui vogliamo fare una insert in rule");
            req.url = '/rule/create';
            req.method = 'POST';
            
            router.handle(req, res);

            //poi devo tornare qui

            //e poi una insert in unit
            winston.debug("e poi una insert in unit");

            
            
            
            
        });
     
    router.route('/create')

        .post((req, res) => {

            var routerRule = require("../rule/rule.js")(express, connection, connectionClient2, winston);
            var routerUnit = require("../unit/unit.js")(express, connection, connectionClient2, winston);

            

            routerRule.post('/create', function (req, res) {
                res.end();
            });
            routerUnit.post('/create', function (req, res) {
                res.end();
            });

            var router = new express.Router();
            router.use('/createRule', routerRule);
            router.use('/createUnit', routerUnit);
            router.handle({ url: '/createRule/createUnit', method: 'POST' }, { end: done });
             
             
        });


    router.route('/read')

        .get((req, res) => {

            var title = "read";

            var idRule = req.query.idRule;
            var idUser = req.query.idUser;

            errorCode = errorCodeEnum.NoError;
            errorDescription = "";

            if (idRule == undefined || idRule.trim() == "") {
                idRule = null;
            }

            if (idUser == undefined || idUser.trim() == "") {
                errorCode = errorCodeEnum.ParametriObbligatoriMancanti;
                errorDescription += "Parametro \'idUser\' mancante. ";
            }

            if (errorCode <= 0) {
                //error
                res.jsonp({ status: errorCode, error: errorDescription, result: { objs: [] }});
            } else {
                //go
                var qq = view_util.read(idRule, idUser, queries);
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
                        notifyRulesEnginePub(connectionClient2, obj);


                        res.jsonp({
                            status: errorCode,
                            error: errorDescription,
                            title: title,
                            result: { objs: rows }
                        });
                    }


                });
            }
        });

     

    function notifyRulesEnginePub(client, obj) {

        try {
            client.connect(rulesEnginePubConfig.websocketServerUrl, rulesEnginePubConfig.websocketServerProtocol);
            connectionClient2.on('connect', function (connectionClient) {
                if (guid == obj.guid) {
                    connectionClient.sendUTF(JSON.stringify(obj));
                }
            });
        }
        catch (error) {
            winston.error(error);
        }
        
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