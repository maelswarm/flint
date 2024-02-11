const db = require('../db/index.js');

module.exports = (app) => {
    app.get("/verify", (req, res) => {
        res.sendFile('dist/html/verify.html', {
            ":status": 200,
            "content-type": "text/html; charset=utf-8",
            "set-cookie": "TOKEN=deleted; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        });
    });

    app.get("/verify.css", (req, res) => {
        res.sendFile('dist/css/verify.html', {
            ":status": 200,
            "content-type": "text/html; charset=utf-8",
            "set-cookie": "TOKEN=deleted; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        });
    });

    app.get("/verify.js", (req, res) => {
        res.sendFile('dist/js/verify.js', {
            ":status": 200,
            "content-type": "text/html; charset=utf-8",
            "set-cookie": "TOKEN=deleted; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        });
    });

    app.post('/verify', async (req, res) => {
        const result = await db.verify(req.body.email, req.body.password, req.body.code);
        res.send(JSON.stringify({ msg: result.msg }), {
            ":status": 200,
            "content-type": "application/javascript; charset=utf-8"
        });
    });
}