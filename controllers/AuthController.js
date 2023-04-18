import ObjectId from "mongodb";
import dbClient from "../utils/db";
import redisClient from "../utils/redis";
import { v4 as uuidv4 } from "uuid";
import sha1 from "sha1";

class AuthController {
  static async getConnect(req, res) {
    const auth = req.headers.authorization.split(" ")[1];
    const UserEmail = Buffer.from(auth, "base64")
      .toString("ascii")
      .split(":")[0];
    const UserPassword = Buffer.from(auth, "base64")
      .toString("ascii")
      .split(":")[1];
    if (
      !dbClient.db.collection("users").findOne({ email: UserEmail }) &&
      !dbClient.db.collection("users").findOne({ password: UserPassword })
    ) {
      return res.status(401).send("Unauthorized");
    }
    const token = uuidv4();
    const USER = await dbClient.db
      .collection("users")
      .findOne({ email: UserEmail, password: sha1(UserPassword) });

    const gen = `auth_${token}`;
    const ID = USER._id.toString();
    await redisClient.set(gen, ID, 24 * 60 * 60);
    return res.status(200).send({ token });

    // curl 0.0.0.0:5000/users/me -H "X-Token: cab4ab1c-3201-41a6-a00e-31af60b6a73a" ; echo ""
    // curl 0.0.0.0:5000/disconnect -H "X-Token: 3a4d320f-adeb-4558-ae27-4a4d19861464" ; echo ""
  }

  static async getDisconnect(req, res) {
    const token = req.headers["x-token"];
    const user = await dbClient.db
      .collection("users")
      .findOne({ _id: ObjectId(token) });
    if (!user) {
      return res.status(401).send("Unauthorized");
    }
    const gen = `auth_${token}`;
    await redisClient.del(gen);
    return res.status(200).send({});
  }
}

export default AuthController;
