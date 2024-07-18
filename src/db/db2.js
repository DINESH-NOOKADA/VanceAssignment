const sqlite3 = require('sqlite3').verbose();

const createDatabase = (columnNames, dbPath, tableName) => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        return reject(err);
      }
    });

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS ${tableName} (
        ${columnNames.map((name) => `\`${name}\` TEXT`).join(', ')}
      )
    `;

    db.run(createTableQuery, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
        reject(err);
      } else {
        console.log('Table created or already exists.');
        resolve(db);
      }
    });
  });
};

const clearTable = (db, tableName) => {
  return new Promise((resolve, reject) => {
    const clearTableQuery = `DELETE FROM ${tableName}`;

    db.run(clearTableQuery, (err) => {
      if (err) {
        console.error('Error clearing table:', err.message);
        reject(err);
      } else {
        console.log('Table cleared.');
        resolve();
      }
    });
  });
};

const insertData = (db, columnNames, data, tableName) => {
  return new Promise((resolve, reject) => {
    const insertQuery = `
      INSERT INTO ${tableName} (${columnNames.map(name => `\`${name}\``).join(', ')})
      VALUES (${columnNames.map(() => '?').join(', ')})
    `;
    const stmt = db.prepare(insertQuery);

    data.forEach((row) => {
      stmt.run(row, (err) => {
        if (err) {
          console.error('Error inserting data:', err.message);
          reject(err);
        }
      });
    });

    stmt.finalize((err) => {
      if (err) {
        console.error('Error finalizing statement:', err.message);
        reject(err);
      } else {
        console.log('Data inserted into the table.');
        resolve();
      }
    });
  });
};

const getAllData = (db, tableName) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM ${tableName}`;

    db.all(query, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

module.exports = {
  createDatabase,
  clearTable,
  insertData,
  getAllData
};