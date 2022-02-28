const express = require('express');
const app = express();

app.use(express.static('./public'));

// middleware to properly access incoming requests of content-type application/json
app.use(express.json());


// this route should come at last
app.get('*', (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(8080, () => console.log(`I'm listening.`));