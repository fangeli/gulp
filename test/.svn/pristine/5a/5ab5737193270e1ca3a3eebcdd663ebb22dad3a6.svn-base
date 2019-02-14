
module.exports = {
 
    

    create: function (idRule, idUnits, idUser, queries) {

        var qq = queries['create'][0];

        qq = qq.replace(/#idRule#/g, idRule);
        qq = qq.replace(/#idUnits#/g, idUnits);
        qq = qq.replace(/#idUser#/g, idUser);

        return qq;

    },
    read: function (id, idRule, idUnits, idUser, queries) {

        var qq = queries['read'][0]['read'][0];
        qq = qq.replace(/#idUser#/g, idUser);

        if (id) {
            var qq1 = queries['read'][0]['whereId'][0];
            qq += qq1.replace(/#id#/g, id);
        }
        if (idRule)
        {
            var qq0 = queries['read'][0]['whereIdRule'][0];
            qq += qq0.replace(/#idRule#/g, idRule);
        }
        if (idUnits) {
            var qq2 = queries['read'][0]['whereIdUnits'][0];
            qq += qq2.replace(/#idUnits#/g, idUnits);
        }
         

        return qq;

    },
    update: function (id, idRule, idUnit, idUser, queries) {

        var qq = queries['update'][0]['update'][0];
        qq = qq.replace(/#idRule#/g, idRule);
        qq = qq.replace(/#idUser#/g, idUser);
        qq = qq.replace(/#idUnit#/g, idUnit);

        if (id) {
            var qq1 = queries['update'][0]['whereId'][0];
            qq += qq1.replace(/#id#/g, id);
        }


        return qq;

    } ,
   
    delete: function (idRule, idUser, queries) {

        var qq = queries['delete'][0];
        qq = qq.replace(/#idRule#/g, idRule);
        qq = qq.replace(/#idUser#/g, idUser);
        
        return qq;

    }
    
                  
    

};
 