const spicedPg = require("spiced-pg");
const db = spicedPg(`postgres:postgres:postgres@localhost:5432/imageboard`);

module.exports.getAllData = () => {
    return db.query(`
        SELECT url, title, id
        FROM images
        ORDER BY id DESC;
    `,);
}