const express = require('express');
const app = express();
const db = require("./database/db");
// requires to process the file data on server side
// multer ajuda a lidar com forms e interagir com disk storage, pega o arquivo do POST e coloca no lugar certo no server
// o server é quem vai se comunicar com o cloud
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const s3 = require("./s3");

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {

        callback(null, path.join(__dirname, "uploads"));
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(uid => {
            callback(null, uid + path.extname(file.originalname));
        })
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152, 
    }
});

function hasAllFields(req, res, next) {
    let { title, username, description } = req.body;
    if (!title || !username || !description) {
        return res.json({hasError: true});
    } else {
        next();
    }
}

function hasTitleUsername(req, res, next) {
    let { comment, username } = req.body;
    if (!comment || !username) {
        return res.json({hasError: true});
    } else {
        next();
    }
}

app.use(express.static('./public'));

// middleware to properly access incoming requests of content-type application/json
app.use(express.json());

app.get("/images.json", (req, res) => {
    db.getAllData().then(({rows}) => {
        res.json(rows)
    }).catch(err => console.log("error getting images", err))
});

app.post("/upload", uploader.single("file"), hasAllFields, s3.upload, (req, res) => {
    let { title, username, description } = req.body;
    // title, username and description are in req.body
    let url = `https://s3.amazonaws.com/bucketforimageboard/${req.file.filename}`;
    // the url must be:
    // `https://s3.amazonaws.com/Name-BUCKET/${req.file.filename}`
    db.addImage(title, username, description, url).then(({rows}) => {
        return res.json(rows[0]);
    }).catch(err => {
        console.log(err);
        return res.sendStatus(500);
    })
});

app.get("/single-image/:imageId", (req, res) => {
    db.getSingleImageInfo(req.params.imageId).then(({ rows }) => {
        return res.json(rows[0]);
    }).catch(err => {
        console.log("error on getting single image info: ", err)
        return res.sendStatus(500);
    })

});

app.get("/comments/:imageId", (req, res) => {
    db.getImageComments(req.params.imageId).then(({ rows }) => {
        return res.json(rows);
    })
    .catch(err => {
        console.log("error on getting comments: ", err);
        return res.sendStatus(500);
    });
});

app.post("/submit-comments", hasTitleUsername, (req, res) => {
    const { imageId, username, comment } = req.body;
    db.addComment(imageId, username, comment).then(({ rows }) => {
        return res.json(rows[0]);
    }).catch(err => {
        console.log("error on adding comment to db: ", err);
        return res.sendStatus(500);
    });
});

app.get("/more-images/:smallestId", (req, res) => {
    const idNumber = parseInt(req.params.smallestId);
    db.getMoreImages(idNumber).then(({rows}) => {
        return res.json(rows)
    }).catch(err => {
        console.log("error on getting more images: ", err);
        return res.sendStatus(500);
    })
});

app.get("/deleteImg/:id", (req, res) => {
    db.deleteImgComments(req.params.id).then(() => {
        db.deleteImg(req.params.id).then(() => {
            console.log("image and comments deleted!")
        }).catch(err => console.log("error deleting image", err));
    }).then(() => res.json({response: "ok"})).catch(err => console.log("error deleting image comments", err));
});

// this route should come at last
app.get('*', (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(8080, () => console.log(`I'm listening.`));