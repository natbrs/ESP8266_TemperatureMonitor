import express from 'express';
import { sequelize, Weather } from './database.js';
import { engine } from 'express-handlebars';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

console.log(__dirname);

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

app.set('views', path.join(__dirname, 'views/'));

sequelize.sync().then(() => {
  console.log("Banco sincronizado");
}).catch((error) => {
  console.error("Error no banco:", error);
});

app.get('/', async (response) => {
  try {
    const sensor = await Weather.findAll({
      attributes: ['wea_temp', 'wea_humid', 'createdAt', 'updatedAt']
    });

    response.render('home', { sensor });
    console.log(sensor)
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    response.status(500).send('Erro interno do servidor');
  }
});

app.get("/dashboard", async (req, res) => {
  try {
    await Weather.create({
      wea_temp: req.query.wea_temp,
      wea_humid: req.query.wea_humid
    });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
  console.log(`Servidor HTTPS está em execução na porta ${PORT}`);
});
