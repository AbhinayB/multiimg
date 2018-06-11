var AWS = require('aws-sdk');
const config = require('./amazonaws.js');
AWS.config.update(config);
var s3 = new AWS.S3();
fs = require('fs');

fs.readFile('./rug2.jpg', function(err, data) {
    if (err) { throw err; }
    if (s3.config.credentials.expired) {
        console.log(s3.config.credentials.expired);
    } else {
        console.log(s3.config.credentials.expired);
    }
    if (AWS.Credentials.expired) {
        console.log(AWS.Credentials.expired);
    } else {
        console.log(AWS.Credentials.expired);
    }
    /* var base64data = new Buffer(data, 'binary');
     s3.upload({
         Bucket: 'turco123',
         Key: 'image1.jpg',
         Body: base64data,
         ACL: 'public-read'
     }, function(resp) {
         console.log(arguments);
         console.log('Successfully uploaded package.');
     });*/
    params = {};
    s3.listBuckets(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else console.log(data.Buckets.length);
    });
});