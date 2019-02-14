 
  
function f(val)
{
    var retval = val;
    if (retval == "") {
        retval = null;
    }
    else {
        retval = retval.replace(/\'/gi, "''");
        retval = "'" + retval + "'";
    }

    return retval;
}

