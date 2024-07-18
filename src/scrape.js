const { Builder, By, error } = require("selenium-webdriver");
const { createDatabase, insertData, clearTable } = require("./db/db2.js");

const getTimePeriod = (period) => {
  const now = new Date();
  let startDate;

  switch (period) {
    case "1W":
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case "1M":
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case "3M":
      startDate = new Date(now.setMonth(now.getMonth() - 3));
      break;
    case "6M":
      startDate = new Date(now.setMonth(now.getMonth() - 6));
      break;
    case "1Y":
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    default:
      throw new Error("Unsupported period format");
  }

  return {
    start: Math.floor(startDate.getTime() / 1000),
    end: Math.floor(Date.now() / 1000),
  };
};

const scrapeData = async (from, to, period,dbPath,tableName) => {
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    const { start, end } = getTimePeriod(period);
    const baseUrl = `https://finance.yahoo.com/quote/${from}${to}%3DX/history/?period1=${start}&period2=${end}`;
    await driver.get(baseUrl);
    const table = await driver.findElement(By.css("table.svelte-ewueuo"));
    const headers = await table.findElements(By.tagName("th"));
    const rows = await table.findElements(By.tagName("tr"));
    const data = [];
    for (const row of rows) {
      const cols = await row.findElements(By.tagName("td"));
      const rowData = await Promise.all(
        cols.map(async (col) => await col.getText())
      );
      data.push(rowData);
    }
    const columnNames = await Promise.all(
      headers.map(async (header) => await header.getText())
    );
    const db =await  createDatabase(columnNames,dbPath,tableName);
    await clearTable(db,tableName);
    await insertData(db, columnNames, data,tableName);
  } catch (err) {
    console.log(error);
  } finally {
    await driver.quit();
  }
};

module.exports = { scrapeData };
