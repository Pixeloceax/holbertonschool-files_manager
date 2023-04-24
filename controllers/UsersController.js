const sha1 = require('sha1');
const mongodb = require('mongodb');
const Redis = require('../utils/redis');
const Mongo = require('../utils/db');

class UsersController {
  static async postNew(request, response) {
    const { email, password } = request.body;

    if (!email) {
      return response.status(400).json({ error: 'Missing email' });
    }

    if (!password) {
      return response.status(400).json({ error: 'Missing password' });
    }
    const existingUser = await Mongo.users.findOne({ email });
    if (existingUser) {
      return response.status(400).json({ error: 'User already exists' });
    }
    const newUser = await Mongo.users.insertOne({
      email,
      password: sha1(password),
    });
    return response.status(201).json({ id: newUser.insertedId, email });
  }

  static async getMe(request, response) {
    const token = request.header('X-Token');
    if (!token) {
      return response.status(401).json({ error: 'Unauthorized' });
    }
    const authToken = `auth_${token}`;
    const curUserToken = await Redis.get(authToken);
    if (!curUserToken) {
      return response.status(401).json({ error: 'Unauthorized' });
    }
    const curUser = await Mongo.users.findOne({
      _id: new mongodb.ObjectId(curUserToken),
    });
    if (!curUser) {
      return response.status(401).json({ error: 'Unauthorized' });
    }
    return response.status(200).json({ id: curUser._id, email: curUser.email });
  }
}

module.exports = UsersController;
