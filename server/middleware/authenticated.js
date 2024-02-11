const jwt = require('jsonwebtoken');
const isVerifiedUser = require('../db/isVerifiedUser');

module.exports = (req, res, next) => {
    console.log(req.headers)
    if (!req.headers.cookie) {
        console.log("here")
        res.send(null, {
            ":status": 301,
            "location": '/', "set-cookie": "TOKEN=deleted; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        });
        return;
    }
    const token = req.headers.cookie.substring(req.headers.cookie.indexOf('TOKEN=') + 6);
    if (!token) {
        res.send(null, {
            ":status": 301,
            "location": '/', "set-cookie": "TOKEN=deleted; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        });
        return;
    }
    jwt.verify(token, 'mysecret', { algorithm: 'HS512' }, function (err, decoded) {
        if (err) {
            res.send(null, {
                ":status": 301,
                "location": '/', "set-cookie": "TOKEN=deleted; expires=Thu, 01 Jan 1970 00:00:00 GMT"
            });
            return;
        }
        console.log(decoded.iat, (new Date()).getTime() / 1000)
        if (decoded.iat < ((new Date()).getTime() / 1000) - 60) {
            res.send(null, {
                ":status": 301,
                "location": '/', "set-cookie": "TOKEN=deleted; expires=Thu, 01 Jan 1970 00:00:00 GMT"
            });
            return;
        }
        isVerifiedUser(decoded?.email).then(() => {
            next(req, res);
        }).catch(() => {
            res.send(null, {
                ":status": 301,
                "location": '/', "set-cookie": "TOKEN=deleted; expires=Thu, 01 Jan 1970 00:00:00 GMT"
            });
            return;
        });
    });
}