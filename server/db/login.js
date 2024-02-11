const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
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
      const encryptedPassword = result[0]?.password;
      if (!encryptedPassword) {
        client.close();
        return resolve({ msg: "Login Incorrect" });
      }
      const isValid = bcrypt.compareSync(password, encryptedPassword) && result[0]?.verified === true;
      if (isValid) {
        const token = jwt.sign({ email }, 'mysecret', { algorithm: 'HS512' });
        client.close();
        resolve({ msg: "", token });
      } else {
        client.close();
        resolve({ msg: "Login Incorrect" });
      }
    } catch (err) {
      console.error(err);
      client.close();
      resolve({ msg: "Please try again later" });
    }
  });
}