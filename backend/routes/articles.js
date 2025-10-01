// routes/articles.js
const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const jwt = require('jsonwebtoken');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, image, date, title, description 
      FROM articles 
      ORDER BY id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;