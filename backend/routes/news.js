// routes/news.js
const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// GET /api/news - все статьи
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, image, date, title, description
      FROM news 
      ORDER BY id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /api/news/:id - одна статья
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT id, image, date, title, description 
      FROM news 
      WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Статья не найдена' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;