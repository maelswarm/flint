const db = require('../db/index.js');

module.exports = (app) => {
    app.post('/signup', async (req, res) => {
        console.log(req);
        if(!req.body?.email || !req.body?.password) {
            res.send(JSON.stringify({msg: 'Failure'}), {
                ":status": 200,
                "content-type": "application/javascript; charset=utf-8"
            });
            return;
        }
        console.log(req.body);
        const result = await db.signup(req.body.email, req.body.password);
        res.send(JSON.stringify({msg: result.msg }), {
            ":status": 200,
            "content-type": "application/javascript; charset=utf-8"
        });
    });
}