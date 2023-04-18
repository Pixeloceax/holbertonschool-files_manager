import dbClient from "../utils/db.js";
import sha1 from "sha1";
import ObjectId from "mongodb";
import redisClient from "../utils/redis.js";

class UsersController {
  static async postNew(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    if (!email) {
      return res.status(400).json({ message: "Missing email" });
    }
    if (!password) {
      return res.status(400).json({ message: "Missing password" });
    }
    if (await dbClient.db.collection("users").findOne({ email })) {
      return res.status(400).json({ message: "Already exist" });
    }
    const hashedPassword = sha1(password);
    const user = await dbClient.db.collection("users").insertOne({
      email,
      password: hashedPassword,
    });
    const objectId = new ObjectId(user.insertedId);
    // await dbClient.db.collection("users").insertOne(user);
    return res.status(201).send({ id: objectId, email });
  }

  static async getOne(req, res) {
    const id = req.headers["x-token"];
    if (!id) {
      return res.status(401).send({ error: "Unauthorized ID" });
    }
    const userId = await redisClient.get(`auth_${id}`);
    if (!userId) {
      return res.status(401).send({ error: "Unauthorized userId" });
    }
    const user = await dbClient.db
      .collection("users")
      .findOne({ _id: ObjectId(userId) });
    if (!user) {
      return res.status(401).send({ error: "Unauthorized user" });
    }
    return res.status(200).send({ id: user._id, email: user.email });
  }
}

export default UsersController;
