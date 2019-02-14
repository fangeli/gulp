var winston = require('./config/log');
winston.debug('Hi! I\'m the RulesEngineAPI');

var debug = require('debug');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');



// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);



var mysql = require('mysql');
var credentials = require('./config/mysql');

var connection = mysql.createConnection(credentials);
winston.debug("Connecting to mysql...");
connection.connect(
    function (err) {
        // connected! (unless `err` is set)
        if (err) {

            var message = err.stack ? err.stack : err;
            winston.error("Errore di connessione: " + message);
        }

        else {
            winston.debug("Connected to mysql!");
            winston.debug(JSON.stringify(connection.config));

        }

    }
);



var rulesEnginePubConfig = require("./config/ws");

var WebSocketClient = require('websocket').client;

var client = new WebSocketClient();

//TEST
winston.debug("Connecting to rulesEnginePub...");
client.connect(rulesEnginePubConfig.websocketServerUrl, rulesEnginePubConfig.websocketServerProtocol);
client.on('connect', function (connectionClient) {
    winston.debug("Connected to rulesEnginePub!");
});


var rule_fence = require('./routes/fence/fence')(express, connection, client, winston);
app.use('/fence', rule_fence);


var rule_view = require('./routes/view/view')(express, connection, client, winston);
app.use('/view', rule_view);

var rule = require('./routes/rule/rule')(express, connection, client, winston);
app.use('/rule', rule);

var rule_event = require('./routes/event/event')(express, connection, client, winston);
app.use('/event', rule_event);

var rule_history = require('./routes/history/history')(express, connection, client, winston);
app.use('/history', rule_history);

var rule_interval = require('./routes/interval/interval')(express, connection, client, winston);
app.use('/interval', rule_interval);

var rule_notification = require('./routes/notification/notification')(express, connection, client, winston);
app.use('/notification', rule_notification);

var rule_unit = require('./routes/unit/unit')(express, connection, client, winston);
app.use('/unit', rule_unit);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    winston.error(err);
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {

        winston.error(err);

        res.status(err.status || 500);

        res.jsonp({
            status: 0,
            error: err.message,
            title: 'Error',
            result: {}
        });

    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    winston.error(err);
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var config = require('./config/port');

//definizione della porta usata
app.set('port', config.port);




var server = app.listen(app.get('port'), function () {
    winston.debug('Express server listening on port ' + server.address().port);
});
