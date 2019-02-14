# RulesEngineAPI

## config.js

```json
module.exports = {
    port: 3211,
    websocketServerUrl: 'ws://localhost:8083/',
    websocketServerProtocol: 'echo-protocol'
}
```

## mysql.js

//local
```json
module.exports = {
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'clab',
    multipleStatements: true
}
```

//10.12
```json
module.exports = {
    host: '192.168.10.12',
    user: 'root',
    password: 'divi99784',
    database: 'clab',
    multipleStatements: true
}
```

//onroad-alpha
```json
module.exports = {
    host: '127.0.0.1',
    user: 'root',
    password: 'divi99784',
    database: 'rules_engine',
    multipleStatements: true
}
```



