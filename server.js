const express = require('express');
const app = express();
const db = require("./database/db");

app.use(express.static('./public'));

// middleware to properly access incoming requests of content-type application/json
app.use(express.json());

app.get("/images.json", (req, res) => {
    db.getAllData().then(({rows}) => {
        res.json(rows)
    }).catch(err => console.log("error getting images", err))
});

// this route should come at last
app.get('*', (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(8080, () => console.log(`I'm listening.`));