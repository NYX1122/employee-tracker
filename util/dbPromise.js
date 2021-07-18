const db = require('../db/connection');
const cTable = require('console.table');

const dbFunction = (query) => {
    db.query(query, (err, results) => {
        if (err) {
            console.log(err);
            return;
        }
        return results;
    });
}

module.exports = dbFunction;