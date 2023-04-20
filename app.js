const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const { join } = require("path");
const { readFile } = require("fs/promises");
const express = require("express");
const app = express();
const videosRouter = require("./src/api/videos");
const thumbnailsRouter = require("./src/api/thumbnails");
const commentRouter = require('./src/api/comments');
const indexRouter = express.Router();
const cors = require('./src/setup/cors');

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors);


indexRouter.get("/", async (req, res) => {
  const appJson = await readFile(join(__dirname, "./app.json"));
  res.json(JSON.parse(appJson));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.use("/api/videos", videosRouter);
app.use("/api/thumbnails", thumbnailsRouter);
app.use('/api/videos/:id/comments', commentRouter);
app.use("/", indexRouter);
