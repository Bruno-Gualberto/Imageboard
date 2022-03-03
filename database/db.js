const spicedPg = require("spiced-pg");
const db = spicedPg(`postgres:postgres:postgres@localhost:5432/imageboard`);

module.exports.getAllData = () => {
    return db.query(`
        SELECT url, title, id, (
            SELECT id FROM images
            ORDER BY id ASC
            LIMIT 1
        ) AS "lowestId" FROM images
        ORDER BY id DESC
        LIMIT 3;
    `);
}

module.exports.addImage = (title, username, description, url) => {
    return db.query(`
        INSERT INTO images (title, username, description, url)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `, [title, username, description, url]);
}

module.exports.getSingleImageInfo = imageId => {
    return db.query(`
        SELECT *
        FROM images
        WHERE id = $1
    `, [imageId]);
}

module.exports.getImageComments = imageId => {
    return db.query(`
        SELECT *
        FROM comments
        WHERE image_id = $1
    `, [imageId]);
}

module.exports.addComment = (imageId, username, comment) => {
    return db.query(`
        INSERT INTO comments (image_id, username, comment)
        VALUES ($1, $2, $3)
        RETURNING image_id, username, comment, created_at
    `, [imageId, username, comment]);
}

module.exports.getMoreImages = idNumber => {
    return db.query(`
        SELECT url, title, id, (
            SELECT id FROM images
            ORDER BY id ASC
            LIMIT 1
        ) AS "lowestId" FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 3;
    `, [idNumber]);
}