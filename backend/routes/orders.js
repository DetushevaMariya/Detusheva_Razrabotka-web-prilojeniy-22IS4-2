const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const jwt = require('jsonwebtoken');

//Получение заказов текущего пользователя авторизованного
router.get('/', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Требуется авторизация' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const userId = decoded.userId;
    const date = req.query.date || null;

    console.log('=== GET /orders ===');
    console.log('Token:', token);
    console.log('Decoded:', decoded);
    console.log('UserId:', userId);
    console.log('Date query:', date);

    let query = 'SELECT * FROM orders WHERE user_id = $1';
    const params = [userId];

    if (date) {
  const startDate = new Date(date);
  const endDate = new Date(date);
  endDate.setDate(endDate.getDate() + 1);

  query += ' AND delivery_date >= $2 AND delivery_date < $3';
  params.push(
    startDate.toISOString().split('T')[0], 
    endDate.toISOString().split('T')[0]   
  );
}

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    
    console.log('Found orders:', result.rows.length);

    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка в GET /orders:', err.message); 
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});
//Получение всех заказов 
router.get('/all', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id, user_id, items, status, total_price, 
        delivery_time, delivery_date, 
        settlement, street, house, apartment, additional, phone, 
        created_at 
      FROM orders 
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка в /all:', err.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

//Получение заказов по айди пользователя
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

router.post('/', async (req, res) => {
  const { 
    items, 
    totalPrice, 
    date, 
    timeSlot, 
    settlement, 
    street, 
    house, 
    apartment, 
    additional, 
    phone 
  } = req.body;

  //Проверка обязательных полей
  if (!items || !totalPrice || !date || !timeSlot || !settlement || !street || !phone) {
    return res.status(400).json({ error: 'Заполните все обязательные поля' });
  }

  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    let userId = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        userId = decoded.userId;
      } catch (err) {
        console.warn('Токен недействителен, заказ без авторизации');
      }
    }

    // Вставляем заказ
    const result = await pool.query(
      `INSERT INTO orders (
        user_id, items, total_price, delivery_date, delivery_time, 
        settlement, street, house, apartment, additional, phone
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id`,
      [
        userId,
        JSON.stringify(items),
        totalPrice,
        date,
        timeSlot,
        settlement,
        street,
        house,
        apartment,
        additional,
        phone
      ]
    );

    res.status(201).json({ orderId: result.rows[0].id });
  } catch (err) {
    console.error('Ошибка создания заказа:', err.message);
    res.status(500).json({ error: 'Не удалось создать заказ' });
  }
});

//Обновление статуса заказа
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
