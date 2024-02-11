const db = require('../db/index.js');

module.exports = (app) => {
    app.post('/login', async (req, res) => {
        const result = await db.login(req.body.email, req.body.password);
        console.log(result)
        res.send(JSON.stringify({msg: result.msg }), {
            ":status": 200,
            "content-type": "application/javascript; charset=utf-8",
            "set-cookie": "TOKEN=" + result.token
        });
    });
}