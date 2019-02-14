
module.exports = {
  
    create: function (idRule, idUser, system, emails, queries) {

        var qq = queries['create'][0];
        qq = qq.replace(/#idRule#/g, idRule);
        qq = qq.replace(/#idUser#/g, idUser);
        qq = qq.replace(/#system#/g, system);
        qq = qq.replace(/#emails#/g, f_s(emails));
        return qq;

    },
    update: function (idRule, idUser, system, emails, queries) {

        var qq = queries['update'][0];
        qq = qq.replace(/#idRule#/g, idRule);
        qq = qq.replace(/#idUser#/g, idUser);
        qq = qq.replace(/#system#/g, system);
        qq = qq.replace(/#emails#/g, f_s(emails));
        return qq;

    },
    read: function (id, idUser, queries) {

        var qq = queries['read'][0]['read'][0];
        qq = qq.replace(/#idUser#/g, idUser);
        if (id)
        {
            var qq1 = queries['read'][0]['whereId'][0];
            qq += qq1.replace(/#id#/g, id);

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
 
 