require("dotenv").config()
import express from "express"
import config from "config"
import { connectToMongoDb } from "./utils/database"
import { router } from "./routes"
import { v2 as cloudinary } from "cloudinary"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import deserializeUser from "./middleware/deserializeUser"

const app = express()
const PORT: number = config.get<number>("PORT") || 7000
const MONGO_URL = process.env.MONGO_URL || ""

cloudinary.config({
  cloud_name: "difibvzqe",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

app.use(cookieParser())
app.use(express.json())
app.use(helmet())

app.use(deserializeUser)

app.use(router)

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

const server = app.listen(PORT, async () => {
  await connectToMongoDb(MONGO_URL)
  console.log(`🚀 Server started on http://localhost:${PORT}`)
})
