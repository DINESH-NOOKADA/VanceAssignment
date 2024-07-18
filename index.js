const express = require('express');
const bodyParser = require('body-parser');
const forexDataRoutes = require('./src/routes/forexData');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', forexDataRoutes);

const options = {
  definition:{
    openapi:"3.0.0",
    info:{
      title:"Vance Assignment [ forex data ]"
    },
    servers:[
      {
        url:'http://localhost:3000/',
      }
    ],
  },
  apis:["./src/routes/*.js"]
};

 const specs = swaggerJSDoc(options)
 app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(specs))

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
