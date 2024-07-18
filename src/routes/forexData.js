const express = require('express');
const router = express.Router();
const { scrapeData } = require('../scrape.js');
const { getAllData } = require('../db/db2.js');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

/**
 * @swagger
 * /api/forex-data:
 *   post:
 *     summary: Scrape and retrieve forex data
 *     parameters:
 *       - in: query
 *         name: from
 *         required: true
 *         schema:
 *           type: string
 *         description: The from currency code (e.g., GBP, AED)
 *       - in: query
 *         name: to
 *         required: true
 *         schema:
 *           type: string
 *         description: The to currency code (e.g., INR)
 *       - in: query
 *         name: period
 *         required: true
 *         schema:
 *           type: string
 *         description: The timeframe for which you want to query data (e.g., 1M, 3M)
 *     responses:
 *       200:
 *         description: A list of forex data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Date:
 *                     type: string
 *                     example: "2023-06-30"
 *                   Open:
 *                     type: string
 *                     example: "1.2500"
 *                   High:
 *                     type: string
 *                     example: "1.2600"
 *                   Low:
 *                     type: string
 *                     example: "1.2400"
 *                   Close:
 *                     type: string
 *                     example: "1.2550"
 *                   AdjClose:
 *                     type: string
 *                     example: "1.2550"
 *                   Volume:
 *                     type: string
 *                     example: "1000000"
 *       500:
 *         description: Internal server error
 */

router.post('/api/forex-data', async (req, res) => {
    const { from, to, period } = req.query;
    const dbPath = path.join(__dirname, `../db/dataFolder/postData.db`);
    const tableName = 'postData'
    try {
      console.log('scraping started');
      await scrapeData(from, to, period,dbPath,tableName);
      console.log("scraping done");
      const db = new sqlite3.Database(dbPath);
      const rows = await getAllData(db,tableName);
      res.status(200).json(rows)
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;
