const express = require("express");
const router = express.Router();
const { pool } = require("./db");

router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT thumbnails.*, videos.url as video_url
      FROM thumbnails
      JOIN videos ON thumbnails.video_id = videos.id
      ORDER BY videos.created_at DESC
      `);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching thumbnails", error: err });
  }
});

module.exports = router;
