import dbClient from "../utils/db.js";
import sha1 from "sha1";
import { ObjectId } from "mongodb";

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
}

export default UsersController;
