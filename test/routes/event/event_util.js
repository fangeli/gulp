
module.exports = {
  
    create: function (idRuleUnit, idUser, geodata, read, queries) {

        var qq = queries['create'][0];
        qq = qq.replace(/#idRuleUnit#/g, idRuleUnit);
        qq = qq.replace(/#idUser#/g, idUser);
        qq = qq.replace(/#geodata#/g, f_s(geodata));
        qq = qq.replace(/#read#/g, read);
        return qq;

    },
    read: function (idUser, queries) {

        var qq = queries['read'][0];
        qq = qq.replace(/#idUser#/g, idUser);
        return qq;

    },

    markAsRead: function (id, idUser, queries) {

        var qq = queries['markAsRead'][0];
        qq = qq.replace(/#id#/g, id);
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
