const db = require('../db/index.js');
const authenticated = require("../middleware/authenticated");

module.exports = (app) => {
    app.get('/logout', authenticated, async (req, res) => {
        //const result = await db.logout();
        res.send(null, {
            ":status": 301,
            "location": '/', "set-cookie": "TOKEN=deleted; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        });
    });
}