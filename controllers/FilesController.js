// const DBClient = require("../utils/db");
// const RedisClient = require("../utils/redis");
// import Queue from "bull";
// import { v4 as uuid4 } from "uuid";
// import { contentType } from "mime-types";

// const mongo = require("mongodb");
// const process = require("process");
// const fs = require("fs");

// class FilesController {
//   static async postUpload(req, res) {
//     const gen = req.header["x-token"];

//     const UserId = await RedisClient.get(`auth_${gen}`);
//     if (!UserId) {
//       return res.status(401).send("Unauthorized");
//     }

//     const db = await DBClient.connection();
//     let connnection = db.collection("users");
//     const user = await connnection.findOne({ _id: new mongo.ObjectID(UserId) });

//     const fileOptions = ["folder", "file", "image"];
//     const { name, type, data } = req.body;
//     let parentId = req.body.parentId ? req.body.parentId : 0;
//     let isPublic = req.body.isPublic ? req.body.isPublic : false;

//     if (!name) return res.status(400).json({ error: "Missing name" });
//     if (!type || !fileTypeOptions.includes(type))
//       return res.status(400).json({ error: "Missing type" });
//     if (!data && type !== "folder")
//       return res.status(400).json({ error: "Missing data" });
//     if (parentId) {
//       const folder = await database
//         .collection("files")
//         .findOne({ _id: mongo.ObjectID(parentId) });
//       if (!folder) return res.status(400).json({ error: "Parent not found" });
//       if (folder.type !== "folder")
//         return res.status(400).json({ error: "Parent is not a folder" });
//     }

//     if (type === "folder") {
//       const query = await database.collection("files").insertOne({
//         userId: new mongo.ObjectID(user._id),
//         name,
//         type,
//         isPublic,
//         parentId: parentId ? mongo.ObjectID(parentId) : 0,
//       });
//       const folder = query.ops[0];
//       folder.id = folder._id;
//       return res.status(201).json(folder);
//     }

//     let path = process.env["FOLDER_PATH"] || "/tmp/files_manager";
//     // if (parentId !== 0) path = `${path}/${parentId}`;
//     const file = {
//       userId: user._id,
//       name,
//       type,
//       isPublic,
//       parentId,
//       localPath: `${path}/${uuid4()}`,
//     };

//     database.collection("files").insertOne(file, (err, result) => {
//       if (err) return;
//       const file = result.ops[0];
//       file.id = file._id;

//       const callback = (err) => {
//         if (err) return res.status(500).send(`oh no\n${err.message}`);
//         return res.status(201).json(file);
//       };

//       fs.mkdir(path, async () => {
//         if (file.type === "image") {
//           const queue = new Queue("fileQueue");
//           await queue.add({ userId: file.userId, fileId: file.id });
//           fs.writeFile(
//             file.localPath,
//             Buffer.from(data, "base64").toString("binary"),
//             callback
//           );
//         } else {
//           fs.writeFile(
//             file.localPath,
//             Buffer.from(data, "base64").toString("utf-8"),
//             callback
//           );
//         }
//       });
//     });
//   }
// }

// module.exports = FilesController;
