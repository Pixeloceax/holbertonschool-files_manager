const express = require('express');
const bodyParser = require('body-parser');
const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');
const AuthController = require('../controllers/AuthController');
// const FilesController = require('../controllers/FilesController');
const parser = bodyParser.json();

const router = express.Router({ mergeParams: true });

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/users', parser, (req, res) => UsersController.postNew(req, res));
router.get('/users/me', parser, (req, res) => UsersController.getOne(req, res));
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);
// router.post("/files", FilesController.postUpload);
// router.get('/files/:id', FilesController.getShow);
// router.get('/files', FilesController.getIndex);
// router.put('/files/:id/publish', FilesController.putPublish);
// router.put('/files/:id/unpublish', FilesController.putUnpublish);
// router.get('/files/:id/data', FilesController.getFile);

module.exports = router;
