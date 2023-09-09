const express = require('express');
const { sequelize, Sensor } = require('./database.js');
const { engine } = require('express-handlebars');
const https = require('https');
const fs = require('fs');


const app = express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');\

app.use(express.json());

sequelize.sync().then(() => {
  console.log("Banco sincronizado");
}).catch((error) => {
  console.error("Error no banco:", error);
});

app.get('/', async (request, response) => {
  try {
    const sensors = await Sensor.findAll({
        attributes: ['wea_temp', 'wea_humid', 'wea_id', 'createdAt']
    });

    response.render('home', { sensors });
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    response.status(500).send('Erro interno do servidor');
  }
});


app.get('/add-value', async (request, response) => {
  try {
    await Sensor.create({
      temp: request.query.temp,
      hum: request.query.umi
    });
    response.send('Leitura adicionada com sucesso!');
  } catch (error) {
    console.error('Erro ao inserir dados:', error);
    response.status(500).send('Erro interno do servidor');
  }
});

const server = https.createServer(options, app);

server.listen(3000, () => {
  console.log('Servidor HTTPS está em execução na porta 300');
});