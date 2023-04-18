import express from "express";
import AppController from "../controllers/AppController.js";
import UsersController from "../controllers/UsersController.js";
import AuthController from "../controllers/AuthController.js";
import bodyParser from "body-parser";
const parser = bodyParser.json();

const router = express.Router();

router.get("/status", AppController.getStatus);
router.get("/stats", AppController.getStats);
router.post("/users", parser, (req, res) => UsersController.postNew(req, res));
router.get("/users/me", parser, (req, res) => UsersController.getOne(req, res));
router.get("/connect", parser, (req, res) =>
  AuthController.getConnect(req, res)
);
router.get("/disconnect", parser, (req, res) =>
  AuthController.getDisconnect(req, res)
);

export default router;
