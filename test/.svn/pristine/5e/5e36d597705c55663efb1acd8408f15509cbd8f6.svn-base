
module.exports = {
 
    read: function (ids, idUser, queries) {
        
        var qq = queries['read'][0]['select'][0];

        qq = qq.replace(/#idUser#/g, idUser);

        if (ids) {
            var qq0 = queries['read'][0]['whereId'][0];
            qq0 = qq0.replace(/#ids#/g, ids);
            qq += qq0;
        }

        return qq;

    } 
    

};
 

 