const authenticated = require("../middleware/authenticated");

module.exports = (app) => {
    app.get("/app", authenticated, (req, res) => {
        res.sendFile('dist/html/main.html', {
            ":status": 200,
            "content-type": "text/html; charset=utf-8"
        });
    }); 
    app.get("/main.css", authenticated, (req, res) => {
        res.sendFile("dist/css/main.css", {
            ":status": 200,
            "content-type": "text/css; charset=utf-8"
        });
    });
    app.get("/main.js", authenticated, (req, res) => {
        res.sendFile("dist/js/main.js", {
            ":status": 200,
            "content-type": "application/javascript; charset=utf-8"
        });
    });
}