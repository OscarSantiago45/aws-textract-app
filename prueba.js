const AWS = require('aws-sdk');
const fs = require('fs');
const s3 = new AWS.S3({
    accessKeyId: "AKIAWIZKTIAVGYZHXW7P",
    secretAccessKey: "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"
});
require('dotenv').config();

s3.listBuckets({}, (err,data)=> {
    if (err) throw err;
    console.log(data);
})

var parametros = {
    Bucket: 'archivos-contrato'
}
 s3.listObjects(parametros, (err,data)=> {
     if (err) throw err;
     console.log(data);
 })
console.log(process.env.AWS_ACCESS_KEY);
console.log(process.env.AWS_SECRET_ACCESS_KEY);
console.log(process.env.AWS_REGION);