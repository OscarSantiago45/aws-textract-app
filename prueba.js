const AWS = require('aws-sdk');
const fs = require('fs');
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
require('dotenv').config();

s3.listBuckets({}, (err,data)=> {
    if (err) throw err;
    console.log(data);
})

var parametros = {
    Bucket: 'documentos1.1'
}
 s3.listObjects(parametros, (err,data)=> {
     if (err) throw err;
     console.log(data);
 })
console.log(process.env.AWS_ACCESS_KEY);
console.log(process.env.AWS_SECRET_ACCESS_KEY);
console.log(process.env.AWS_REGION);