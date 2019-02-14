//------------------
//query
//------------------
var xml2Js = require('xml2js');
var parser = new xml2Js.Parser();
var fs = require("fs");
var xmlfile = fs.readFileSync("./routes/unit/unit.xml");
var queries;
parser.parseString(xmlfile, function (err, result) {
    queries = result['queries'];
});
 

//------------------
//utility
//------------------
var unit_util = require("./unit_util.js");

//------------------
//validator
//------------------
var unit_validator = require("./unit_validator.js");


var xmlfile_anag_mezzi_disp = fs.readFileSync("./routes/anag_mezzi_disp/anag_mezzi_disp.xml");
var queries_anag_mezzi_disp;
parser.parseString(xmlfile_anag_mezzi_disp, function (err, result) {
    queries_anag_mezzi_disp = result['queries'];
});


var anag_mezzi_disp_util = require("../anag_mezzi_disp/anag_mezzi_disp_util.js");
 

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

            try {

                var idRule = req.body.idRule;
                var idUser = req.body.idUser;
                var idUnits = req.body.idUnits;
                
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
                if (idUnits == undefined || idUnits.trim() == "") {
                    idUnits = null;
                }

                if (errorCode <= 0) {
                    //error
                    res.jsonp({ status: errorCode, error: errorDescription, result: { objs: [] }});
                } else {
                   
                    var qq = unit_util.create(idRule, idUnits, idUser, queries);
                    var query = connection.query(qq, (err, rows, fields) => {
                        
                        if (err) {

                            winston.error("unit_util.create: " + qq);
                            winston.error("unit_util.create: " + err.stack);
                            errorCode = errorCodeEnum.ErrorGeneric;
                            errorDescription += err;
                            res.jsonp({ status: errorCode, error: errorDescription, result: { objs: [] } });
                        }
                        else {
                            //----------------------------
                            //CALL NEXT ROUTER
                            //----------------------------
                            CallNotificationCreate(express, connection, connectionClient2, winston, router, req, res);
                        }

                    }); 

                }
            }
            catch (exception)
            {
                res.jsonp({
                    status: errorCodeEnum.ErrorGeneric,
                    error: exception.message,
                    title: title,
                    result: { }
                });
            }
           



        });
     

    router.route('/update')

        .patch((req, res) => {

            var title = "update";

            try {

                //------------
                //input
                //------------
                errorCode = errorCodeEnum.NoError;
                errorDescription = "";
                var idRule = req.body.idRule;
                var idUser = req.body.idUser;
                var idUnits = req.body.idUnits; 

                //------------
                //validazione
                //------------
                if (idRule == undefined || idRule.trim() == "") {
                    idRule = null;
                }
                if (idUser == null || idUser.trim() == "") {
                    errorCode = errorCodeEnum.ParametriObbligatoriMancanti;
                    errorDescription += "Parametro \'idUser\' mancante. ";
                }
                if (idUnits == undefined || idUnits.trim() == "") {
                    idUnits = null;
                }

                //------------
                //START
                //------------
                if (errorCode <= 0) {
                    //error
                    res.jsonp({ status: errorCode, error: errorDescription, result: { objs: [] }});
                }
                else {
                    var solvers = {
                        
                        solver1: function (q1, task, row) {
                            //inserimento
                            var idRule = task.reqArgs[0];
                            var idUnits = task.reqArgs[1];
                            var idUser = task.reqArgs[2];
                            var qqCreate = unit_util.create(idRule, idUnits, idUser, queries);
                            q1.push({ solver: "solver2", req: qqCreate, reqArgs: [] });
                        },
                        solver2: function (q2, task, maintenance) {
                             //fine
                             //TODO: serve questo solver?
                        }
                    };

                    var q = async.queue(function (task, cb) {
                        //-----------------
                        //query execution
                        //-----------------
                        var query = connection.query(task.req, task.reqArgs);
                        query.on("end", cb);
                        query.on("result", function (row) { solvers[task.solver](q, task, row); });
                    }, 2);

                    q.drain = function () {
                        //-----------------
                        //ending point
                        //-----------------
  
                        CallNotificationUpdate(express, connection, connectionClient2, winston, router, req, res);
 
                    };

                    //cancellazione
                    var qqDelete = unit_util.delete(idRule, idUser, queries);
                    q.push({ solver: "solver1", req: qqDelete, reqArgs: [idRule, idUnits, idUser] });
                }
                 

            }
            catch (exception) {
                res.jsonp({
                    status: errorCodeEnum.ErrorGeneric,
                    error: exception.message,
                    title: title,
                    result: {}
                });
            }

        }); 

    function CallNotificationUpdate(express, connection, connectionClient2, winston, router, req, res) {
         
        var notification = require('../notification/notification')(express, connection, connectionClient2, winston);
        router.use('/unitNotification', notification);
        req.url = '/unitNotification/update';
        req.method = 'PATCH'; 
        router.handle(req, res);
    }

    function CallNotificationCreate(express, connection, connectionClient2, winston, router, req, res) {

        var notification = require('../notification/notification')(express, connection, connectionClient2, winston);
        router.use('/unitNotification', notification);
        req.url = '/unitNotification/create';
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