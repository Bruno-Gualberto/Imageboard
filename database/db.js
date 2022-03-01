const spicedPg = require("spiced-pg");
const db = spicedPg(`postgres:postgres:postgres@localhost:5432/imageboard`);

module.exports.getAllData = () => {
    return db.query(`
        SELECT url, title, id
        FROM images
        ORDER BY id DESC;
    `);
}

module.exports.addImage = (title, username, description, url) => {
    return db.query(`
        INSERT INTO images (title, username, description, url)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `, [title, username, description, url]);
}