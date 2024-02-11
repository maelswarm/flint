const bcrypt = require('bcrypt');
const MongoClient = require('mongodb').MongoClient;
const { sendMessage } = require('./send-verification.js');
const uri = "mongodb://127.0.0.1:27017";
let client = null;

module.exports = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            client = new MongoClient(uri);
            await client.connect();
            const dbo = client.db("db");
            password = bcrypt.hashSync(password, 10);
            let query = { email };
            const user = await dbo.collection("users").find(query).toArray();
            if (!user?.length) {
                if (password.length < 8) {
                    db.close();
                    resolve({ msg: "Password less than 8 characters." });
                }
                const code = await sendMessage("roecrew@gmail.com", email, "Verification");
                await dbo.collection("users").insertMany([{ email: query.email, password, signupCode: { code, timestamp: (new Date()).getTime() }, verified: false }]);
                client.close();
                resolve({ msg: "Signup Successful" });
            } else {
                client.close();
                resolve({ msg: "Invalid or duplicate username" }); å
            }
        } catch (err) {
            console.error(err);
            client.close();
            resolve({ msg: "Please try again later" });
        }
    });
}