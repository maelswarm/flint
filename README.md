# flint

A flash start website boilerplate

## Install

``` npm install ```

```Add a .env file at the project root```

## Run

launch an https server instance servering dist

``` npx gulp ```

## Todos

Make gulpfile easily configurable (.env)

Make server easily configurable (.env)

## Compilation

Gulp is used to minify/optimise html/css/js

Sass is in use

Wrapped https server instance in use.

## Routing

Similar express-like usage.

```js
    app.get("/", (req, res) => {
        res.sendFile('dist/html/home.html', {
            ":status": 200,
            "content-type": "text/html; charset=utf-8"
        });
    }); 

    app.post('/verify', async (req, res) => {
        const result = await db.verify(req.body.email, req.body.password, req.body.code);
        res.send(JSON.stringify({ msg: result.msg }), {
            ":status": 200,
            "content-type": "application/javascript; charset=utf-8"
        });
    });
```

Regexp may be used.

```js
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
```
