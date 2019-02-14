module.exports = {

    val: function (val, fieldName) {

        var errorCodeEnum = { NoError: 1, ErrorGeneric: 0, ParametriObbligatoriMancanti: -55 };
        var retval = new Object();

        retval.errorCode = errorCodeEnum.NoError;
        retval.errorDescription = '';

        if (fieldName == 'emails_update') {

            var newVal = val;
            if (newVal == null || newVal == undefined || newVal == "") {
                newVal = null;
            }
            else
            {
                var splits = newVal.split(",");
                for (var i = 0; i < splits.length; ++i) {
                    var email = splits[i].trim();
                    if (!validateEmail(email)) {
                        retval.errorCode = errorCodeEnum.ParametriObbligatoriMancanti;
                        retval.errorDescription = 'Emails non valida: ' + email;
                        break;
                    }
                }
            } 
            retval.val = newVal;

        }
        else if (fieldName == 'emails_create') {

            var newVal = val;
            if (newVal == null || newVal == undefined || newVal == "") {
                newVal = null;
            }
            else {
                var splits = newVal.split(",");
                for (var i = 0; i < splits.length; ++i) {
                    var email = splits[i].trim();
                    if (!validateEmail(email)) {
                        retval.errorCode = errorCodeEnum.ParametriObbligatoriMancanti;
                        retval.errorDescription = 'Emails non valida: ' + email;
                        break;
                    }
                }
            }
            retval.val = newVal;

        }

        return retval; 

    }

};

 

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

