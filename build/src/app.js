"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("config"));
const database_1 = require("./utils/database");
const routes_1 = require("./routes");
const cloudinary_1 = require("cloudinary");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const deserializeUser_1 = __importDefault(require("./middleware/deserializeUser"));
const app = (0, express_1.default)();
const PORT = config_1.default.get("PORT") || 7000;
const MONGO_URL = process.env.MONGO_URL || "";
cloudinary_1.v2.config({
    cloud_name: "difibvzqe",
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use(deserializeUser_1.default);
app.use(routes_1.router);
// app.post("/upload", upload.single("avatar"), async (req, res) => {
//   try {
//     const fileBuffer = req.file?.buffer
//     if (fileBuffer) {
//       const base64String = fileBuffer.toString("base64")
//       const cloudinaryUrlObj = await cloudinary.uploader.upload(
//         `data:image/jpeg;base64,${base64String}`
//       )
//       const cloudinaryPathUrl = cloudinaryUrlObj.secure_url
//       return res.status(201).json(cloudinaryPathUrl)
//     }
//   } catch (error) {
//     console.log(error)
//   }
// })
const server = app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, database_1.connectToMongoDb)(MONGO_URL);
    console.log(`🚀 Server started on http://localhost:${PORT}`);
}));
