Forex Data Scraper
This project scrapes forex data from Yahoo Finance and stores it in a local SQLite database. It provides an API endpoint to retrieve the data and includes a scheduler to automatically update the data at specified intervals.


first clone the Assignment 
git clone https://github.com/DINESH-NOOKADA/VanceAssignment.git

Now go to VanceAssignment folder and run " npm install "
after run " node index.js "
You must see a message :
Server running at http://localhost:6010

Now to test the api provided go to 
http://localhost:6010/api-docs/ in the browser

Wait for sometime after executing the route
if you see an message like 
" [25376:4352:0718/153948.652:ERROR:ssl_client_socket_impl.cc(878)] handshake failed; returned -1, SSL error code 1, net_error -101" ignore it 

unless you see an error 
your console should look like this 
"
scraping started
DevTools listening on ws://127.0.0.1:60453/devtools/browser/f8f1762f-16ed-4063-8979-0d74fcde257b
Table created or already exists.
Table cleared.
Data inserted into the table.
scraping done
"
you will see the response as an array of objects 

To run the scheduler go to src folder , Now run node scheduler.js , Generally the data in the website changes every midnight 
so the scheduler starts executing at 00:00 everyday to check the data you can go to db folder after exection completion.
But i set the scheduler to start immediately and then continue running every 5 minutes. You can check the data stored in src/db folder