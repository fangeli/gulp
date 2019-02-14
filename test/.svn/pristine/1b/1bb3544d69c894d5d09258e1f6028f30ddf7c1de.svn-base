
module.exports = {

     
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
 
 

