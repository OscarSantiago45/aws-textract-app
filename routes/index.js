const express = require('express')
const router = express.Router()
const formidable = require('formidable')
const AWS = require('aws-sdk')
const fs = require('fs')
const textractHelper = require('aws-textract-helper')
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
})




require('dotenv').config();

/* GET home page. */
router.get('/', (req, res, next) => {
  /*var param = {
    Bucket: process.env.AWS_BUCKET
  }
  s3.listObjects(param, (err,data)=> {
    if (err) throw err;
    console.log(data);
    
    
  })*/

  res.render('index', { title: 'Textract Uploader' })
  
})

router.post('/fileupload', (req, res, next) => {
  // Upload logic
  
  const form = new formidable.IncomingForm()
  
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err)
    }
    const fileContent = fs.readFileSync(files.filetoupload.path)
    const s3Params = {
      Bucket: process.env.AWS_BUCKET,
      Key: `${files.filetoupload.name}`,
      Body: fileContent,
      ContentType: files.filetoupload.type,
      ACL: 'public-read'
    }
    
    const s3Content = await s3Upload (s3Params, function (err, data) {
      if (err) {
        console.log("Error", err.message);
      } if (data) {
        console.log("Upload Success", data.Location);
      }
    });
    
    const textractData = await documentExtract(s3Content.Key)
    const formData =  textractHelper.createForm(textractData, { trimChars: [':', ' '] })
    const resp= JSON.stringify(formData)
    const keys3 = `https://s3.us-east-2.amazonaws.com/documentos1.1/${files.filetoupload.name}`
    
    let itemArray = resp 
    itemArray.url=keys3

      
    //console.log(formData)
    
    console.log(itemArray)

    let docClient = new AWS.DynamoDB.DocumentClient();

let save = function () {

    
    var params = {
        TableName: "registros",
        Item:  itemArray
    };
    docClient.put(params, function (err, data) {

        if (err) {
            console.log("users::save::error - " + JSON.stringify(err, null, 2));                      
        } else {
            console.log("users::save::success" );                      
        }
    });
}

save();
 
res.redirect('/archivos')
    
/* 
    AWS.config.update({endpoint: "https://dynamodb.us-east-2.amazonaws.com"});

    var docClient = new AWS.DynamoDB.DocumentClient();
    
    console.log("Importing registro into DynamoDB. Please wait.");
    
    
        var params = {
            TableName: "registros",
            Item: itemArray
        };
    
        docClient.put(params, function(err, data) {
           if (err) {
               console.error("Unable to add movie",  ". Error JSON:", JSON.stringify(err, null, 2));
           } else {
               console.log("PutItem succeeded:");
               
           }
        }); */
    });
   
    
})




async function s3Upload (params) {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
  })

  return new Promise(resolve => {
    s3.upload(params, (err, data) => {
      if (err) {
        console.error(err)
        resolve(err)
      } else {
        resolve(data)
      }
    })
  })
}

async function documentExtract (key) {
  return new Promise(resolve => {
    var textract = new AWS.Textract({
      region: process.env.AWS_REGION,
      endpoint: `https://textract.${process.env.AWS_REGION}.amazonaws.com/`,
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY
    })
    var params = {
      Document: {
        S3Object: {
          Bucket: process.env.AWS_BUCKET,
          Name: key
        }
      },
      FeatureTypes: ['FORMS']
    }

    textract.analyzeDocument(params, (err, data) => {
      if (err) {
        return resolve(err)
      } else {
        resolve(data)
      }
    })
  })
}

module.exports = router