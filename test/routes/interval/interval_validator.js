var Ajv = require('ajv');
var ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}


module.exports = {

    jsonValidator: function (data, schema) {

        var errorCodeEnum = { NoError: 1, ErrorGeneric: 0, ParametriObbligatoriMancanti: -55 };
        var retval = new Object();
        retval.errorCode = errorCodeEnum.NoError;
        retval.errorDescription = '';

        //ammesso null o ''
        if (data == null || data == undefined || data == '') {
            data = null;
        }
        else
        {
            try {
                var validate = ajv.compile(JSON.parse(schema));
                var valid = validate(JSON.parse(data));
                if (!valid) {
                    retval.errorCode = errorCodeEnum.ParametriObbligatoriMancanti;
                    retval.errorDescription = 'Json non valido';
                }
            }
            catch (exception) {
                retval.errorCode = errorCodeEnum.ParametriObbligatoriMancanti;
                retval.errorDescription = 'Json non valido';

            }

        }
       
        retval.val = data;

        return retval;
         

    }

};

 
