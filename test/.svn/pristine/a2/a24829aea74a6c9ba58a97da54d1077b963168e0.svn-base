//------------------
//query
//------------------
var xml2Js = require('xml2js');
var parser = new xml2Js.Parser();
var fs = require("fs");




//------------------
//utility rule_util
//------------------
var rule_util = require("./rule_util.js");
var xmlfile = fs.readFileSync("./routes/rule/rule.xml");
var queries;
parser.parseString(xmlfile, function (err, result) {
    queries = result['queries'];
});


var history_util = require("../history/history_util.js");
var xmlfile_rule_history = fs.readFileSync("./routes/history/history.xml");
var queries_rule_history;
parser.parseString(xmlfile_rule_history, function (err, result) {
    queries_rule_history = result['queries'];
});

//------------------
//async
//------------------
var async = require("async");

//------------------
//init
//------------------
var errorCodeEnum = { NoError: 1, ErrorGeneric: 0, ParametriObbligatoriMancanti: -55, UpdateAll: 15, IncompleteData: -2 };
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

    router.route('/create')
        .post((req, res, next) => {
            checkConnection(next);
        });

    router.route('/read')
        .get((req, res, next) => {
            checkConnection(next);
        });


    router.route('/update')
        .patch((req, res, next) => {
            checkConnection(next);
        });


    router.route('/delete')
        .delete((req, res, next) => {
            checkConnection(next);
        });

    router.route('/enabled')
        .patch((req, res, next) => {
            checkConnection(next);
        });
    

     

    router.route('/create')

        .post((req, res) => {

            var title = "create";

            var expression = req.body.expression;
            var idUser = req.body.idUser;
            var idCompany = req.body.idCompany;
            var enabled = req.body.enabled;
            var name = req.body.name;
            var description = req.body.description;
            var type = req.body.type;
            var priority = req.body.priority;
            var status = req.body.status;

            errorCode = errorCodeEnum.NoError;
            errorDescription = "";

            if (expression == undefined || expression.trim() == "") {
                errorCode = errorCodeEnum.ParametriObbligatoriMancanti;
                errorDescription += "Parametro \'expression\' mancante. ";
            }
            if (idUser == undefined || idUser.trim() == "") {
                errorCode = errorCodeEnum.ParametriObbligatoriMancanti;
                errorDescription += "Parametro \'idUser\' mancante. ";
            }
            if (idCompany == undefined || idCompany.trim() == "") {
                errorCode = errorCodeEnum.ParametriObbligatoriMancanti;
                errorDescription += "Parametro \'idCompany\' mancante. ";
            }
            if (enabled == undefined || enabled.trim() == "") {
                errorCode = errorCodeEnum.ParametriObbligatoriMancanti;
                errorDescription += "Parametro \'enabled\' mancante. ";
            }
            if (name == undefined || name.trim() == "") {
                name = null;
            }
            if (description == undefined || description.trim() == "") {
                description = null;
            }
            if (type == undefined || type.trim() == "") {
                errorCode = errorCodeEnum.ParametriObbligatoriMancanti;
                errorDescription += "Parametro \'type\' mancante. ";
            }
            if (priority == undefined || priority.trim() == "") {
                errorCode = errorCodeEnum.ParametriObbligatoriMancanti;
                errorDescription += "Parametro \'priority\' mancante. ";
            }
            if (status == undefined || status.trim() == "") {
                errorCode = errorCodeEnum.ParametriObbligatoriMancanti;
                errorDescription += "Parametro \'status\' mancante. ";
            }

            if (errorCode <= 0) {
                //error
                sendError(res, errorCode, errorDescription);
                
            } else {
                //go
                var qq = rule_util.create(expression, idUser, idCompany, enabled, name, description, type, priority, status, queries);
                var query = connection.query(qq, (err, rows, fields) => {


                    if (err) {
                        sendError(res, errorCodeEnum.ErrorGeneric, err.stack);
                    }
                    else {

                        req.body.idRule = rows.insertId.toString();

                        var idUnits = req.body.idUnits;
                        if (idUnits == null || idUnits == undefined || idUnits.trim() == "") {


                            //----------------------------
                            //CALL NEXT ROUTER
                            //----------------------------
                            //chiamo la notification
                            CallNotificationCreate(express, connection, connectionClient2, winston, router, req, res);

                        }
                        else {


                            //----------------------------
                            //CALL NEXT ROUTER
                            //----------------------------
                            //chiamo la unit
                            CallUnitCreate(express, connection, connectionClient2, winston, router, req, res);

                        }

                    }


                });
            }
        });

   
    router.route('/read')

        .get((req, res) => {

            var title = "read";

            errorCode = errorCodeEnum.NoError;
            errorDescription = "";


            var idRule = req.query.idRule;
            var names = req.query.names;
            var type = req.query.type;
            var idUser = req.query.idUser;


            if (idUser == undefined || idUser.trim() == "") {
                errorCode = errorCodeEnum.ParametriObbligatoriMancanti;
                errorDescription += "Parametro \'idUser\' mancante. ";
            }
              

            if (errorCode <= 0) {
                //error
                sendError(res, errorCode, errorDescription);

            } else {
                var qq = rule_util.read(idRule, idUser, queries);
                var query = connection.query(qq, (err, rows, fields) => {

                    if (err) {
                        sendError(res, errorCodeEnum.ErrorGeneric, err.stack);
                    }
                    else {

                        var objsNew = new Array();
                 
                        for (var i = 0; i < rows.length; ++i) {

                            var objNew = rows[i];
 
                            if (objNew.system == null) {
                                //--------------------
                                //ATTENZIONE
                                //il valore di rule.system non può essere = null,
                                //se lo è, non posso far vedere la regola [potrebbe esserci stato un errore di connessione durante la creazione]
                                //TODO: questo va migliorato, creando delle transazione con commit e rollback
                                //--------------------
                                errorCode = errorCodeEnum.IncompleteData;
                                CallRuleDelete(express, connection, connectionClient2, winston, router, req, res, objNew.id, idUser);
                            }
                            else {
                                if (objNew.idUnits) {
                                    var arrUnits = objNew.idUnits.split(',');
                                    objNew.idUnits = arrUnits;
                                }
                                if (objNew.emails) {
                                    var arrEmails = objNew.emails.split(',');
                                    objNew.emails = arrEmails;
                                }

                                objsNew.push(objNew);
                            }

                            
                        }

                        //------------------------
                        //END
                        //------------------------
                        res.jsonp({
                            status: errorCode,
                            error: errorDescription,
                            title: title,
                            result: { objs: objsNew }
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
            var idRule = req.body.idRule;
            var idUser = req.body.idUser;
            var expression = req.body.expression;
            var idCompany = req.body.idCompany;
            var enabled = req.body.enabled;
            var name = req.body.name;
            var description = req.body.description;
            var type = req.body.type;
            var priority = req.body.priority;
            var status = req.body.status; 


            //--------------------
            //validazione
            //--------------------
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
            if (expression == undefined || expression.trim() == "") {
                expression = null;
            }
            if (idCompany == undefined || idCompany.trim() == "") {
                idCompany = null;
            }
            if (enabled == undefined || enabled.trim() == "") {
                enabled = null;
            }
            if (name == undefined || name.trim() == "") {
                name = null;
            }
            if (description == undefined || description.trim() == "") {
                description = null;
            }
            if (type == undefined || type.trim() == "") {
                type = null;
            }
            if (priority == undefined || priority.trim() == "") {
                priority = null;
            }
            if (status == undefined || status.trim() == "") {
                status = null;
            }
            

            //var trovatoRecord = false; //vale true se e solo se la rule_util.select torna dei valori
            //------------
            //START
            //------------
            if (errorCode == errorCodeEnum.ParametriObbligatoriMancanti) {
                //error
                sendError(res, errorCode, errorDescription);
            }
            
            else {
                var solvers = {

                    solver1: function (q1, task, row) {

                        //trovatoRecord = true;
                        var property = rule_util.getProperty(row, expression, idUser, idCompany, enabled, name, description, type, priority, status);
                        if (property.modify) {
                            //-------------------------------
                            //ci sono modifiche
                            //storicizziamo le modifiche
                            //-------------------------------
                            var propertyJson = JSON.stringify(property);
                            var qq = history_util.create(idRule, idUser, actionType.Update, propertyJson, queries_rule_history);
                            //var action = "a";
                            q1.push({ solver: "solver2", req: qq, reqArgs: [] });
                        }
                        //else {
                        //    var action = "b";
                        //    var qq2 = rule_util.update(idRule, expression, idUser, idCompany, enabled, name, description, type, priority, status, queries);
                        //    q1.push({ solver: "solver2", req: qq2, reqArgs: [] }); 
                        //}
                    },
                    solver2: function (q2, task, maintenance) {
                        //TODO: sarebbe possibile avere un solo update?
                        //var action = task.reqArgs[0];
                        //if (action == "a") {
                            var qq2 = rule_util.update(idRule, expression, idUser, idCompany, enabled, name, description, type, priority, status, queries);
                            q2.push({ solver: "solver3", req: qq2, reqArgs: [] });
                        //}
                       
                    },
                    solver3: function (q2, task, maintenance) { }
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


                    //----------------------------
                    //CALL NEXT ROUTER
                    //----------------------------
                    CallUnitUpdate(express, connection, connectionClient2, winston, router, req, res); 
                     
                };

                //-------------------------
                //prendiamo i dati dell'attuale rule
                //-------------------------
                var qq0 = rule_util.select(idRule, idUser, queries);
                q.push({ solver: "solver1", req: qq0, reqArgs: [idRule, expression, idUser, idCompany, enabled, name, description, type, priority, status] });


            }
        });
     
    router.route('/delete')

        .delete((req, res) => {

            var title = "delete";

            //--------------------
            //input
            //--------------------
            var idRule = req.body.idRule;
            var idUser = req.body.idUser;

            //--------------------
            //validazione
            //--------------------
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

            //------------
            //START
            //------------
            if (errorCode <= 0) {
                //error
                sendError(res, errorCode, errorDescription);

            } else {


                connection.beginTransaction(function (err) {
                    if (err) {
                        sendError(res, errorCodeEnum.ErrorGeneric, err.sqlMessage);
                    }
                    else
                    {
                        //-------------------------
                        //delete
                        //-------------------------
                        var qq0 = history_util.create(idRule, idUser, actionType.Delete, null, queries_rule_history);

                        connection.query(qq0, '', function (err, result) {
                            if (err) {
                                connection.rollback(function () { });
                                sendError(res, errorCodeEnum.ErrorGeneric, err.sqlMessage);
                            }
                            else {
                                //--------------------------
                                //insert into history
                                //--------------------------
                                //TODO: dobbiamo mettere i dati della rule cancellata
                                var qq2 = rule_util.delete(idRule, idUser, queries);

                                connection.query(qq2, '', function (err, result) {
                                    if (err) {
                                        connection.rollback(function () { });
                                        sendError(res, errorCodeEnum.ErrorGeneric, err.sqlMessage);
                                    }
                                    else {
                                        connection.commit(function (err) {
                                            if (err) {
                                                connection.rollback(function () { });
                                                sendError(res, errorCodeEnum.ErrorGeneric, err.sqlMessage);
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

                                                if (req.body.noSendResponse) {

                                                    winston.debug("noSendResponse for " + "idRule: " + idRule + ", idUser: " + idUser );
                                                }
                                                else {

                                                    //----------------------------
                                                    //exit
                                                    //----------------------------
                                                    res.jsonp({
                                                        status: errorCode,
                                                        error: errorDescription,
                                                        title: obj.action,
                                                        result: { objs: result }
                                                    });
                                                }

                                              
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }

                    
                });

            }
        });




    router.route('/enabled')

        .patch((req, res) => {

            var title = "update";

            //------------
            //input
            //------------
            var idRule = req.body.idRule;
            var idUser = req.body.idUser;
            var enabled = req.body.enabled;
            

            //--------------------
            //validazione
            //--------------------
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
            if (enabled == undefined || enabled.trim() == "") {
                enabled = null;
            }


            //var trovatoRecord = false; //vale true se e solo se la rule_util.select torna dei valori
            //------------
            //START
            //------------
            if (errorCode == errorCodeEnum.ParametriObbligatoriMancanti) {
                //error
                sendError(res, errorCodeEnum.errorCode, errorDescription);
            }

            else {
                var solvers = {

                    solver1: function (q1, task, row) {

                        //trovatoRecord = true;
                        var property = rule_util.getProperty2(row, enabled);
                        if (property.modify) {
                            //-------------------------------
                            //ci sono modifiche
                            //storicizziamo le modifiche
                            //-------------------------------
                            var propertyJson = JSON.stringify(property);
                            var qq = history_util.create(idRule, idUser, actionType.Update, propertyJson, queries_rule_history);
                          
                            q1.push({ solver: "solver2", req: qq, reqArgs: [] });
                        }
                        //else {
                        //    var action = "b";
                        //    var qq2 = rule_util.update2(idRule, idUser, enabled, queries);
                        //    q1.push({ solver: "solver2", req: qq2, reqArgs: [] });
                        //}
                    },
                    solver2: function (q2, task, maintenance) {
                        //TODO: sarebbe possibile avere un solo update?
                        //var action = task.reqArgs[0];
                        //if (action == "a") {
                            var qq2 = rule_util.update2(idRule, idUser, enabled, queries);
                            q2.push({ solver: "solver3", req: qq2, reqArgs: [] });
                        //}

                    }
                    ,
                    solver3: function (q2, task, maintenance) { }
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

                    //----------------------------
                    //exit
                    //----------------------------
                    res.jsonp({
                        status: errorCode,
                        error: errorDescription,
                        title: obj.action,
                        result: { objs: obj }
                    });

                };

                //-------------------------
                //prendiamo i dati dell'attuale rule
                //-------------------------
                var qq0 = rule_util.select(idRule, idUser, queries);
                q.push({ solver: "solver1", req: qq0, reqArgs: [idRule, idUser, enabled, ] });


            }
        });

    //function ReOpenConnection(express, connection, connectionClient2, winston, router, req, res) {


    //    var mysql = require('mysql');
    //    var credentials = require('../../config/mysql');
    //    var conn = mysql.createConnection(credentials);
    //    connection = conn;
    //    winston.debug("Connecting to mysql...");
    //    connection.connect(
    //        function (err) {
    //            // connected! (unless `err` is set)
    //            if (err) {

    //                winston.error("fabio");
    //                winston.error(err);
    //            }

    //            else {
    //                winston.debug("Connected to mysql!");
    //                winston.debug(JSON.stringify(connection.config));

    //            }

    //        }
    //    );



    //    //chiamo la unit
    //    var unit = require('../unit/unit')(express, connection, connectionClient2, winston);
    //    router.use('/ruleUnit', unit);
    //    req.url = '/ruleUnit/create';
    //    req.method = 'POST';
    //    router.handle(req, res);
    //}

    function CallRuleRead(express, connection, connectionClient2, winston, router, req, res) {
        //chiamo la unit
        var unit = require('../rule/rule')(express, connection, connectionClient2, winston);
        router.use('/rulerule', unit);
        req.url = '/rulerule/read';
        req.method = 'GET';
        router.handle(req, res);
    }

    function CallUnitCreate(express, connection, connectionClient2, winston, router, req, res) {
        //chiamo la unit
        var unit = require('../unit/unit')(express, connection, connectionClient2, winston);
        router.use('/ruleUnit', unit);
        req.url = '/ruleUnit/create';
        req.method = 'POST';
        router.handle(req, res);
    }

    function CallNotificationCreate(express, connection, connectionClient2, winston, router, req, res) {
        //chiamo la notification
        var notification = require('../notification/notification')(express, connection, connectionClient2, winston);
        router.use('/unitNotification', notification);
        req.url = '/unitNotification/create';
        req.method = 'POST';
        router.handle(req, res);
    }

    function CallUnitUpdate(express, connection, connectionClient2, winston, router, req, res) {
        //faccio agg unit
        var unit = require('../unit/unit')(express, connection, connectionClient2, winston);
        router.use('/ruleUnit', unit);
        req.url = '/ruleUnit/update';
        req.method = 'PATCH';
        router.handle(req, res);
    }


    function CallRuleDelete(express, connection, connectionClient2, winston, router, req, res, idRule, idUser) {
        //chiamo la unit
        var unit = require('../rule/rule')(express, connection, connectionClient2, winston);
        router.use('/rulerule', unit);
        req.url = '/rulerule/delete';
        req.method = 'DELETE';
        req.body.idRule = idRule.toString();
        req.body.idUser = idUser.toString();
        req.body.noSendResponse = true;
        router.handle(req, res);
    }
     

    function notifyRulesEnginePub(client, obj, winston) {

        winston.silly("Sending a message to server with websocket");
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


    function sendError(res, errorCode, errorDesc) {

        var errorDescription = errorDesc ? errorDesc : "";
        winston.error("errorCode: " + errorCode + ", errorDescription" + errorDescription);
        res.jsonp({ status: errorCode, error: errorDescription, result: { objs: [] } });
    }

    return router;
}





//rule.prototype.checkConnection = function (connection, next) {

//    if (connection.state == "disconnected") {
//        winston.debug(connection.state);
//        var credentials = require('../../config/mysql');
//        connection = mysql.createConnection(credentials);
//        connection.connect(
//            function (err) {
//                next();
//            }
//        );
//    }
//    else {
//        next();
//    }
//}
