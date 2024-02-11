const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require('path');
const HTTP_METHODS = {
    ACL: 'ACL',
    CONNECT: 'CONNECT',
    GET: 'GET',
    LOCK: 'LOCK',
    MKACTIVITY: 'MKACTIVITY',
    MOVE: 'MOVE',
    PATCH: 'PATCH',
    PROPPATCH: 'PROPPATCH',
    REBIND: 'REBIND',
    SOURCE: 'SOURCE',
    UNBIND: 'UNBIND',
    UNSUBSCRIBE: 'UNSUBSCRIBE',
    BIND: 'BIND',
    COPY: 'COPY',
    HEAD: 'HEAD',
    'M-SEARCH': 'M-SEARCH',
    MKCALENDAR: 'MKCALENDAR',
    NOTIFY: 'NOTIFY',
    POST: 'POST',
    PURGE: 'PURGE',
    REPORT: 'REPORT',
    SUBSCRIBE: 'SUBSCRIBE',
    UNLINK: 'UNLINK',
    CHECKOUT: 'CHECKOUT',
    DELETE: 'DELETE',
    LINK: 'LINK',
    MERGE: 'MERGE',
    MKCOL: 'MKCOL',
    OPTIONS: 'OPTIONS',
    PROPFIND: 'PROPFIND',
    PUT: 'PUT',
    SEARCH: 'SEARCH',
    TRACE: 'TRACE',
    UNLOCK: 'UNLOCK'
}
let decodeURI = true;
const defaultHeaders = {
    ":status": 200,
    "content-type": "*/*; charset=utf-8"
};
const setExpiration = (headers) => {
    let expireDate = new Date();
    expireDate.setHours(expireDate.getHours() + 1);
    headers['expires'] = expireDate;
    headers['last-modified'] = new Date();
    return headers;
}

function Request(req, data) {
    this.req = req;
    this.query = req.url.indexOf('?') > -1 ? req.url.substring(req.url.indexOf('?') + 1) : '';
    this.headers = req.headers;
    this.url = req.url;
    this.body = data === "" ? undefined : data;
    if (this.body !== undefined && this.headers['content-type'] !== undefined && this.headers['content-type'].indexOf('application/json') > -1) {
        try {
            this.body = JSON.parse(this.body);
        } catch {
            this.body = "";
        }
    }
}
function Response(res) {
    this.send = (data, headers) => {
        if (headers !== undefined) {
            let keys = Object.keys(headers);
            for (let i = 0; i < keys.length; ++i) {
                if (keys[i].indexOf(':') === 0) {
                    headers[keys[i].substring(1)] = headers[keys[i]];
                    delete headers[keys[i]];
                }
            }
        }
        res.writeHead(headers.status, headers);
        res.end(data);
    }
    this.sendFile = (filepath, headers) => {
        if (headers !== undefined) {
            let keys = Object.keys(headers);
            for (let i = 0; i < keys.length; ++i) {
                if (keys[i].indexOf(':') === 0) {
                    headers[keys[i].substring(1)] = headers[keys[i]];
                    delete headers[keys[i]];
                }
            }
        }
        fs.readFile(filepath, (err, buff) => {
            if (err) {
                res.writeHead(404);
                res.end();
                return;
            }
            res.writeHead(200, headers);
            res.end(buff);
        });
    }
}
let storeRoutes = args => {
    let path = "";
    let callbacks = [];
    for (let i = 0; i < args.length; ++i) {
        if (i === 0) {
            path = args[i];
        } else {
            if (typeof args[i] === "Array") {
                callbacks.concat(args[i]);
            } else {
                callbacks.push(args[i]);
            }
        }
    }
    return { path, callbacks };
};

Object.keys(HTTP_METHODS).forEach((key, idx) => {
    key = key.toLowerCase();
    Doppel.prototype[key] = function () {
        if (this.routes[key] === undefined) {
            this.routes[key] = {};
        }
        let { path, callbacks } = storeRoutes(arguments);
        this.routes[key][path] = { callbacks };
    };
});

function Doppel(options) {
    this.routes = {};
    this.host = options.host || "127.0.0.1";
    this.port = options.port || 443;
    this.key = options.key ? fs.readFileSync(options.key, "utf8") : undefined;
    this.cert = options.cert ? fs.readFileSync(options.cert, "utf8") : undefined;
    this.ca = options.ca ? fs.readFileSync(options.ca, "utf8") : undefined;
}


let execRoute = (route, i, req, res) => {
    console.log(route)
    if (i < route.callbacks.length - 1) {
        route.callbacks[i](req, res, (rreq, rres) => {
            execRoute(route, i + 1, rreq, rres);
        });
    } else if (i === route.callbacks.length - 1) {
        route.callbacks[i](req, res);
    }
};
let determineRoute = (routes, req, data, res) => {
    routes = routes[req.method.toLowerCase()];
    let route = undefined;
    const url = req.url === '/' ? '/' : req.url.indexOf('?') > -1 ? req.url.substring(0, req.url.indexOf('?')) : req.url;
    for (let i = Object.keys(routes).length - 1; i >= 0; --i) {
        let matchRegExp = new RegExp("^" + Object.keys(routes)[i] + "$", "g");
        if (matchRegExp.test(url)) {
            route = routes[Object.keys(routes)[i]]
            break;
        }
        route = undefined
    }
    if (route) {
        const request = new Request(req, data);
        const response = new Response(res);
        execRoute(route, 0, request, response);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end();
    }
};
Doppel.prototype.start = function (host, port) {
    host = host || this.host;
    port = port || this.port;
    let data = "";
    const routes = this.routes;
    https
        .createServer({ cert: this.cert, key: this.key }, function (req, res) {
            req.on("data", chunk => {
                data += chunk;
            });
            req.on("end", () => {
                determineRoute(routes, req, data, res);
            });
            req.on("error", err => {
                console.log(err);
            });
        })
        .listen(port, host);
};
module.exports = Doppel;