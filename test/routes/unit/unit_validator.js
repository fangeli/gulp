module.exports = {

    val: function (val, fieldName) {

        var errorCodeEnum = { NoError: 1, ErrorGeneric: 0, ParametriObbligatoriMancanti: -55 };
        var retval = new Object();

        retval.errorCode = errorCodeEnum.NoError;
        retval.errorDescription = '';

        if (fieldName == 'idUnits_update') {

            var newVal = val;
            if (newVal == null || newVal == undefined) {
                newVal = null;
            }
            else
            {
                var splits = newVal.split(",");
                if (splits.length > 1)
                {
                    retval.errorCode = errorCodeEnum.ParametriObbligatoriMancanti;
                    retval.errorDescription = 'idUnits non valida: ' + newVal;
                }
            }
            retval.val = newVal;
        }

        return retval; 

    }

};


