const express = require("express");
const router = express.Router({ mergeParams: true });
const { pool } = require("../api/db");

// sækjum comments
router.get('/', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT id, video_id, author, content, created_at FROM comments WHERE video_id = $1', [id]);
      res.status(200).json(result.rows);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching comments', error: err });
    }
  });
  
// gerum nýtt comment
router.post("/", async (req, res) => {
  try {
    const { id } = req.params; 
    const { author, content, created_at } = req.body; 
    console.log("Received data:", { id, author, content, created_at });
    const result = await pool.query(
      "INSERT INTO comments (video_id, author, content, created_at) VALUES ($1, $2, $3, $4) RETURNING *",
      [id, author, content, created_at] 
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: "Error adding comment", error: err });
  }
});

module.exports = router;
