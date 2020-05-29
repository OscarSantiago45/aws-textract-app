var express = require('express');
const AWS = require('aws-sdk')

var router = express.Router();


/* GET users listing. */
router.get('/',  function(req, res, next) {

    var docClient = new AWS.DynamoDB.DocumentClient();
    
        const params = {
            TableName: "registros",
            limit: 100
        };
        docClient.scan(params,function(err,data){
            if(err){
                console.log("Este es el error: ",err);
            }else{
                console.log(data);
                const newdata= data.Items
            newdata.forEach(element => console.log(element)); 
            res.render('archivos', {newdata});
            }
            
            
        });
    
        
});



module.exports = router;
