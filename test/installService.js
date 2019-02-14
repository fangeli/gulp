//STEP 1
// Installazione modulo per creazione servizio sotto node.js
// npm install node-windows

//STEP 2
// link al progetto MIO_PROGETTO, digitando dal prompt nella root:
// npm link node-windows

//STEP 3

var Service = require('node-windows').Service;

// !!!!!!!!!!!!!!!!!!!!
// Correggere il path dello script
// !!!!!!!!!!!!!!!!!!!!

var svc = new Service({
    name: 'Divitech.RulesEngineAPI',
    description: 'Divitech.RulesEngineAPI',
    script: 'C:\\RulesEngineAPI\\app.js'
});

svc.on('install', function () {
    svc.start();
});

svc.install();