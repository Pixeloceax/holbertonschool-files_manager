const { redisClient } = require("../utils/redis");
const { dbClient } = require("../utils/db");

const AppController = {};

AppController.getStatus = (req, res) => {
  const redisStatus = redisClient.connected;
  const dbStatus = dbClient.isConnected();

  res.status(200).json({ redis: redisStatus, db: dbStatus });
};

AppController.getStats = async (req, res) => {
  const userCount = await dbClient.db.collection("users").countDocuments();
  const fileCount = await dbClient.db.collection("files").countDocuments();

  res.status(200).json({ users: userCount, files: fileCount });
};

module.exports = AppController;
