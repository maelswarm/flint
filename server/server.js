const cluster = require('cluster');
const numCPUs = require("os").cpus().length;
const Doppel = require('./doppel.js');
const app = new Doppel({ key: __dirname + '/keys/server.key', cert: __dirname + '/keys/server.cert' });
const routes = require('./routes/index.js')

routes.forEach((route) => {
    route(app);
});

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on("exit", (worker, code, signal) => {
        let newWorker = cluster.fork();
        console.log(`worker ${worker.process.pid} died`);
        console.log(`worker ${newWorker.process.pid} born`);
    });
} else {
    app.start("0.0.0.0", "8000");
}