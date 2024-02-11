const fs = require('fs');
const dirpath = 'assets/';

module.exports = (app) => {
    app.get("/assets/.*", (req, res) => {
        const path = req.path.substring(req.path.indexOf('/assets/') + 8);
        const { size } = fs.statSync(dirpath + path);
        res.sendFile(dirpath + path, {
            ":status": 200,
            "content-type": "*/*",
            "content-size": size,
            "content-range": `bytes */${size}`,
            "accept-ranges": "bytes"
        });
    });
}