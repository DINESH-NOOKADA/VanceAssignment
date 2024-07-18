const schedule = require('node-schedule');
const { scrapeData } = require('./scrape.js');
const path = require('path')
const scrapeCurrencies = async () => {
  const currencyPairs = [
    { from: 'GBP', to: 'INR', periods: ['1W', '1M', '3M', '6M', '1Y'] },
    { from: 'AED', to: 'INR', periods: ['1W', '1M', '3M', '6M', '1Y'] }
  ];

  for (const pair of currencyPairs) {
    for (const period of pair.periods) {
      try {
        let dbPath = path.join(__dirname, `./db/${pair.from}${pair.to}_${period}.db`);
        console.log(dbPath);
        await scrapeData(pair.from, pair.to, period,dbPath,`${pair.from}${pair.to}_${period}`);
        console.log(`Scraped ${pair.from}-${pair.to} for period ${period}`);
      } catch (error) {
        console.error(`Error scraping ${pair.from}-${pair.to} for period ${period}:`, error);
      }
    }
  }
};


scrapeCurrencies().then(() => {
  console.log('Initial scraping task completed.');
  const job = schedule.scheduleJob('*/5 * * * *', () => {
    console.log('Starting scheduled scraping task...');
    scrapeCurrencies();
  });

  console.log('node-schedular job scheduled to run every 5 minutes.');
}).catch(error => {
  console.error('Error during the initial scraping task:', error);
});



