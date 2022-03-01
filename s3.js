// onde vou colocar o codigo pro AWS
const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

module.exports.upload = (req, res, next) => {
    if (!req.file) {
        console.log("Multer failed!")
        return res.sendStatus(500);
    }

    // mimetype it's the file type
    const { filename, mimetype, size, path } = req.file;

    s3.putObject({
        // Bucket has to be the bucket name I gave in AWS
        Bucket: "bucketforimageboard",
        // all can read my file
        ACL: "public-read",
        Key: filename,
        // file content
        Body: fs.createReadStream(path),
        ContentType: mimetype,
        ContentLength: size,
    }).promise().then(() => {
        next();
    }).catch(err => {
        console.log("error on uploading file to bucket", err);
        return res.sendStatus(500);
    });
}