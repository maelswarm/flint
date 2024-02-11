const jwt = require('jsonwebtoken');
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://127.0.0.1:27017/";

module.exports = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            client = new MongoClient(uri);
            await client.connect();
            const dbo = client.db("db");
            let query = { email };
            const result = await dbo.collection("users").find(query).toArray();
            // if (result?.length > 0) {
            //     await dbo.collection("users").updateOne({ "_id": result[0]._id }, { $set: { verified: true } });
            //     client.close();
            //     resolve({ msg: "Logout Successful" });
            // } else {
            //     client.close();
            //     resolve({ msg: "Logout Failure" });
            // }
        } catch (err) {
            console.error(err);
            client.close();
            resolve({ msg: "Please try again later" });
        }
    });
}