module.exports = (app) => {
    app.get("/", (req, res) => {
        res.sendFile('dist/html/home.html', {
            ":status": 200,
            "content-type": "text/html; charset=utf-8"
        });
    }); 
    app.get("/home.css", (req, res) => {
        res.sendFile("dist/css/home.css", {
            ":status": 200,
            "content-type": "text/css; charset=utf-8"
        });
    });
    app.get("/home.js", (req, res) => {
        res.sendFile("dist/js/home.js", {
            ":status": 200,
            "content-type": "application/javascript; charset=utf-8"
        });
    });
}