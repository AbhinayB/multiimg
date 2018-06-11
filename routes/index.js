var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');
var cong = require('./amazonaws');
const config = {
    accessKeyId: '',
    secretAccessKey: '',
    sslEnabled: false,
    ForcePathStyle: true
};
// global s3 variable
var s3 = null;

// function
function initS3(config) {
    s3 = new AWS.S3(config);
}


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});
// router.get('/toasttemp', function(req, res, next) {
//     res.render('toasttemp');
// });
// router.get('/bucketlist', function(req, res, next) {
//     res.render('bucketlist');
// });
// router.get('/example', function(req, res, next) {
//     res.render('example');
// });
router.post('/validate', function(req, res) {
    params = {};
    config.accessKeyId = req.body.id;
    config.secretAccessKey = req.body.key;

    var temp_s3 = new AWS.S3(config);
    //access id and key are valid or not
    temp_s3.listBuckets(params, function(err, data) {
        if (err) {
            res.send(false);
        } else {
            //success block
            //save my api key and token
            initS3(config);

            res.json(data);
        }
    });
    // res.send(data.Buckets.length);
});

router.post('/bucketobjects', function(req, res) {
    params = {};
    params.Bucket = req.body.bucket;
    if (params.Bucket != null) {
        s3.listObjects(params, function(err, data) {
            if (err) console.log(err, err.stack);
            else res.json(data.Contents);
        });
    } else {
        res.status(404).send({ message: "s3 is not congif please auth your self" });
    }
});
router.post('/createBucket', function(req, res) {
    var params = {
        Bucket: req.body.bucket,
        ACL: 'public-read'
    };
    s3.createBucket(params, function(err, data) {
        if (err) res.send("false") // an error occurred
        else res.send("true"); // successful response
    });
});
router.post('/deleteobject', function(req, res) {
    var params = {
        Bucket: req.body.bucket,
        Key: req.body.key
    };
    s3.deleteObject(params, function(err, data) {
        if (err) console.log(err, err.stack);
        else res.send(data);
    });
});

router.get('/list-bucket', function(req, res) {
    params = {};
    if (s3 != null) {
        s3.listBuckets(params, function(err, data) {
            if (err) {
                res.send(false);
            } else {
                res.json(data);
            }
        });
    } else {
        //error response
        res.status(404).send({ message: "s3 is not congif please auth your self" });
    }
    // res.send(data.Buckets.length);
});


//delete the bucket
deleteBucket = function(bucket, callback) {
    s3.deleteBucket(bucket, function(err, data) {
        if (err) {
            callback(err, false);
            console.log("error deleting bucket " + err);
        } else {
            callback(null, true);
            console.log("delete the bucket " + data);
        }
    });
};

//checking the bucket if it is empty
checkBucketForObjects = function(paramContainingBucketName, callBack) {
    var self = this;
    s3.listObjectVersions(paramContainingBucketName, function(err, data) {
        if (err) {
            callBack(err, null);
            console.log("error listing bucket objects " + err);
            return;
        }
        var items = data.Versions;

        if (items.length > 0) {
            //we found obj/s
            callBack(null, false);
            console.log("bucket has objects");
            return;
        } else {
            //empty bucket
            callBack(null, true);
            console.log("Bucket is empty... burn IT!!");
            return;
        }
    });

};


var _bucketName = null;

router.post('/deleteBucket', function(req, res) {
    _bucketName = req.body.bucketName;

    params = {};

    //aws want to have this format 
    params.Bucket = req.body.bucketName;

    // check for the bucket if it has objects or not
    checkBucketForObjects(params, function(err, isEmptyBucket) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        if (isEmptyBucket) {
            deleteBucket(params, function(err, isDeleted) {
                if (err) {
                    res.status(500).send(err);
                    return;
                }
                if (isDeleted) {
                    //hurryyyy
                    res.send({ message: _bucketName + " Bucket is deleted" });
                    return
                } else {
                    //someting is not right
                    res.send({ message: "did not work! Sorry! Donate some money to build this function!" });
                    return
                }
            });
        } else { //bucket has objects
            res.send({ message: "Files found in the bucket. Do you want to delete the files?" })
        }
    });

    // clearBucket = function(client, bucket, callBack) {
    //     var self = this;
    //     client.listObjectVersions(bucket, function(err, data) {
    //         if (err) {
    //             callBack(err, null)
    //             console.log("error listing bucket objects " + err);
    //             return;
    //         }
    //         var items = data.Versions;
    //         var objects = [];
    //         var object = {};
    //         if (items.length > 0) {
    //             for (var i = 0; i < items.length; i += 1) {
    //                 object.Key = items[i].Key;
    //                 object.VersionId = items[i].VersionId;
    //                 objects.push(object);
    //             }
    //         } else {
    //             callBack(null, null);
    //             return;
    //         }
    //         var deleteParams = { Bucket: bucket.Bucket, Delete: { Objects: objects, Quiet: false } };
    //         client.deleteObjects(deleteParams, function(err, data) {
    //             if (err) {
    //                 console.log(err, err.stack);
    //                 callBack(err, null);
    //             } else {
    //                 console.log(data);
    //                 callBack(null, data);
    //             }
    //         });
    //     });

    // };
    // buckets.forEach(element => {
    //     params.Bucket = element; //element is bucketname
    //     checkBucketForObjects(s3, params, function(err, response) {
    //         if (err || response == null) {
    //             console.log(" clear bucket does not work : " + err)
    //         }
    //         deleteBucket(s3, params);
    //     });
    // });
    // console.log(buckets);
    /* s31.listBuckets(params, function(err, data) {
         if (err) {
             res.send(false);
         } else {
             res.json(data);
         }
     });*/
    // res.send(data.Buckets.length);
});
module.exports = router;