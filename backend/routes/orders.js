// routes/orders.js
const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// GET /api/orders - все заказы
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, user_id, items, status, total_price, delivery_time, delivery_date, location, created_at 
      FROM orders 
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /api/orders/user/:userId - заказы пользователя
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(`
      SELECT id, items, status, total_price, delivery_time, delivery_date, location, created_at 
      FROM orders 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `, [userId]);

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// POST /api/orders - создать заказ
router.post('/', async (req, res) => {
  const { userId, items, totalPrice, deliveryTime, deliveryDate, location } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO orders (user_id, items, total_price, delivery_time, delivery_date, location)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, status, created_at`,
      [userId, JSON.stringify(items), totalPrice, deliveryTime, deliveryDate, location]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Ошибка при создании заказа' });
  }
});

// PATCH /api/orders/:id/status - обновить статус заказа
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await pool.query(
      `UPDATE orders SET status = $1 WHERE id = $2 RETURNING id, status`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Заказ не найден' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Ошибка при обновлении статуса' });
  }
});

module.exports = router;