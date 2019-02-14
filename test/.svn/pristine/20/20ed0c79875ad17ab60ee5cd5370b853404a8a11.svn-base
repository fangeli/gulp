
module.exports = {
 
    create: function (expression, idUser, idCompany, enabled, name, description, type, priority, status, queries) {
        
        var qq = queries['create'][0];

        qq = qq.replace(/#expression#/g, f_s(expression));
        qq = qq.replace(/#idUser#/g, idUser);
        qq = qq.replace(/#idCompany#/g, idCompany); 
        qq = qq.replace(/#enabled#/g, enabled); 
        qq = qq.replace(/#name#/g, f_s(name)); 
        qq = qq.replace(/#description#/g, f_s(description)); 
        qq = qq.replace(/#type#/g, type);
        qq = qq.replace(/#priority#/g, priority); 
        qq = qq.replace(/#status#/g, status); 

        return qq;

    },
    select: function (idRule, idUser, queries) {

        var qq = queries['select'][0];
        qq = qq.replace(/#idRule#/g, idRule);
        qq = qq.replace(/#idUser#/g, idUser);
         

        return qq;

    },
    
    read: function (idRule, idUser, queries) {

        var qq = queries['read'][0]['read'][0];
        qq = qq.replace(/#idUser#/g, idUser);

        if (idRule) {
            var qq1 = queries['read'][0]['whereIdRule'][0];
            qq += qq1.replace(/#idRule#/g, idRule);
        }

        var qqGroupBy = queries['read'][0]['groupBy'][0];
        qq += qqGroupBy;

        return qq;

    }
    
   , delete: function (idRule, idUser, queries) {

        var qq = queries['delete'][0];

        qq = qq.replace(/#idRule#/g, idRule);
        qq = qq.replace(/#idUser#/g, idUser);

        return qq;

    },
    
    update: function (idRule, expression, idUser, idCompany, enabled, name, description, type, priority, status, queries) {

        var qq = queries['update'][0];

        qq = qq.replace(/#idRule#/g, idRule);
        qq = qq.replace(/#expression#/g, f_s(expression));
        qq = qq.replace(/#idUser#/g, idUser);
        qq = qq.replace(/#idCompany#/g, f_v(idCompany));
        qq = qq.replace(/#enabled#/g, f_v(enabled));
        qq = qq.replace(/#name#/g, f_s(name));
        qq = qq.replace(/#description#/g, f_s(description));
        qq = qq.replace(/#type#/g, f_v(type));
        qq = qq.replace(/#priority#/g, f_v(priority));
        qq = qq.replace(/#status#/g, f_v(status));

        return qq;

   },
        
    update2: function (idRule, idUser, enabled, queries) {

        var qq = queries['update2'][0];

        qq = qq.replace(/#idRule#/g, idRule);
        qq = qq.replace(/#idUser#/g, idUser);
        qq = qq.replace(/#enabled#/g, f_v(enabled));

        return qq;

    },

    getProperty: function (result, expression, idUser, idCompany, enabled, name, description, type, priority, status) {

        var obj = new Object();
        var oldValues = new Object();
        var newValues = new Object();
        var modify = false;

        if (result.expression != expression) {
            modify = true;
            oldValues.expression = result.expression;
            newValues.expression = expression;
        }
        if (result.idUser != idUser) {
            modify = true;
            oldValues.idUser = result.idUser;
            newValues.idUser = idUser;
        }
        if (result.idCompany != idCompany) {
            modify = true;
            oldValues.idCompany = result.idCompany;
            newValues.idCompany = idCompany;
        }
        if (result.enabled != enabled) {
            modify = true;
            oldValues.enabled = result.enabled;
            newValues.enabled = enabled;
        }
        if (result.name != name) {
            modify = true;
            oldValues.name = result.name;
            newValues.name = name;
        }
        if (result.description != description) {
            modify = true;
            oldValues.description = result.description;
            newValues.description = description;
        }
        if (result.type != type) {
            modify = true;
            oldValues.type = result.type;
            newValues.type = type;
        }
        if (result.priority != priority) {
            modify = true;
            oldValues.priority = result.priority;
            newValues.priority = priority;
        }
        if (result.status != status) {
            modify = true;
            oldValues.status = result.status;
            newValues.status = status;
        }
        obj.modify = modify;
        obj.oldValues = oldValues ? oldValues : null;
        obj.newValues = newValues ? newValues : null;

        return obj;


    },

     getProperty2: function (result, enabled) {

        var obj = new Object();
        var oldValues = new Object();
        var newValues = new Object();
        var modify = false;

        if (result.enabled != enabled) {
            modify = true;
            oldValues.enabled = result.enabled;
            newValues.enabled = enabled;
        }
        obj.modify = modify;
        obj.oldValues = oldValues ? oldValues : null;
        obj.newValues = newValues ? newValues : null;

        return obj;


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

function f_v(val) {
    var retval = val;
    if (retval == undefined) {
        retval = null;
    }
    return retval;
}