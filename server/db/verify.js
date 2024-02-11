const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://127.0.0.1:27017/";

module.exports = (email, password, code) => {
    return new Promise(async (resolve, reject) => {
        try {
            client = new MongoClient(uri);
            await client.connect();
            const dbo = client.db("db");
            let query = { email };
            const result = await dbo.collection("users").find(query).toArray();
            const isValidPw = bcrypt.compareSync(password, result[0].password);
            if (result?.length) {
                if (result[0]?.email === email && isValidPw && parseInt(code) === parseInt(result[0]?.signupCode?.code)) {
                    await dbo.collection("users").updateOne({ "_id": result[0]._id }, { $set: { verified: true } });
                    client.close();
                    resolve({ msg: "Verification Successful" });
                } else {
                    client.close();
                    resolve({ msg: "Invalid Password or Verification code" });
                }
            } else {
                client.close();
                resolve({ msg: "Invalid or duplicate username" });
            }
        } catch (err) {
            console.error(err);
            client.close();
            resolve({ msg: "Please try again later" });
        }
    });
}