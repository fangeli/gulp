
module.exports = {
 
    create: function (idRule, idUser, timeValidity, queries) {
        
        var qq = queries['create'][0];

        qq = qq.replace(/#idRule#/g, idRule);
        qq = qq.replace(/#idUser#/g, idUser);
        qq = qq.replace(/#timeValidity#/g, f_s(timeValidity)); 
         
        return qq;

    },
    update: function (idRule, idUser, timeValidity, queries) {

        var qq = queries['update'][0];

        qq = qq.replace(/#idRule#/g, idRule);
        qq = qq.replace(/#idUser#/g, idUser);
        qq = qq.replace(/#timeValidity#/g, f_s(timeValidity));

        return qq;

    },
    select: function (idRule, idUser, queries) {

        var qq = queries['select'][0];

        qq = qq.replace(/#idRule#/g, idRule);
        qq = qq.replace(/#idUser#/g, idUser);

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


 