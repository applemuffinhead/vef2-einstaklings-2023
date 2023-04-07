const express = require("express");
const router = express.Router();
const { Pool } = require("pg");
const dotenv = require("dotenv");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const storage = multer.memoryStorage();
const parser = multer({ storage: storage });

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// sækja öll myndbönd
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM videos");
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching videos", error: err });
  }
});

// Sækja eitt myndband í einu
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM videos WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      res.status(404).json({ message: "Video not found" });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (err) {
    res.status(500).json({ message: "Error fetching video", error: err });
  }
});
router.post("/upload", parser.single("video"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ message: "No file uploaded" });
  } else {
    try {
      const { title, description } = req.body;
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "video",
              folder: "videos",
              format: "mp4",
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          )
          .end(req.file.buffer);
      });

      console.log(result);

      const thumbnailOptions = {
        width: 300,
        height: 200,
        crop: "fill",
        format: "jpg",
        quality: "auto",
      };
      
      const thumbnailUrl = result.secure_url.replace(
        "/upload/",
        `/upload/c_fill,h_${thumbnailOptions.height},q_auto,w_${thumbnailOptions.width}/`
      ).replace(".mp4", ".jpg");
      
      

      const videoUrl = result.secure_url;
      console.log("videoUrl:", videoUrl); 
      const videoInsertResult = await pool.query(
        "INSERT INTO videos (title, description, url) VALUES ($1, $2, $3) RETURNING *",
        [title, description, videoUrl]
      );

      const thumbnailInsertResult = await pool.query(
        "INSERT INTO thumbnails (video_id, url) VALUES ($1, $2) RETURNING *",
        [videoInsertResult.rows[0].id, thumbnailUrl]
      );

      res.status(201).json({
        message: "Video uploaded successfully",
        video: videoInsertResult.rows[0],
        thumbnail: thumbnailInsertResult.rows[0],
      });
    } catch (err) {
      res.status(500).json({ message: "Error uploading video", error: err });
    }
  }
});

// Breytum myndbandi
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, url, thumbnail_url } = req.body;

  try {
    const result = await pool.query(
      "UPDATE videos SET title = $1, description = $2, url = $3, thumbnail_url = $4 WHERE id = $5 RETURNING *",
      [title, description, url, thumbnail_url, id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ message: "Video not found" });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (err) {
    res.status(500).json({ message: "Error updating video", error: err });
  }
});


// Eyðum myndbandi
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM videos WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      res.status(404).json({ message: "Video not found" });
    } else {
      res
        .status(200)
        .json({ message: `Video with ID ${id} deleted successfully` });
    }
  } catch (err) {
    res.status(500).json({ message: "Error deleting video", error: err });
  }
});

module.exports = router;
