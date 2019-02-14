
module.exports = {

    create: function (idRule, idUser, action, property, queries) {

        var qq = queries['create'][0];
        qq = qq.replace(/#idRule#/g, idRule);
        qq = qq.replace(/#idUser#/g, idUser);
        qq = qq.replace(/#action#/g, action);
        qq = qq.replace(/#property#/g, f_s(property));

        return qq;

    } ,
    read: function (idRule, idUser, queries) {

        var qq = queries['read'][0]['read'][0];
        qq = qq.replace(/#idUser#/g, idUser);

        if (idRule)
        {
            var qq1 = queries['read'][0]['whereIdRule'][0];
            qq += qq1.replace(/#idRule#/g, idRule);
        }

        return qq;

    } 

};

function f_s(val) {
    var retval = val;
    if (retval == "" || retval == undefined) {
        retval = null;
    }
    else {
        retval = retval.replace(/\'/gi, "''");
        retval = "'" + retval + "'";
    }

    return retval;
}
 

