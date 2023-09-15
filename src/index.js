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

app.get('/', async (req, res) => {
  try {
    const sensor = await Weather.findAll({
      attributes: ['wea_temp', 'wea_humid', 'createdAt', 'updatedAt']
    });

    res.render("home", { sensor });
    console.log(sensor);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/dashboard", async (req, res) => {
  try {
    const data = req.body;

    await Weather.create({
      wea_temp: data.wea_temp,
      wea_humid: data.wea_humid
    });
    res.send("Data inserted successfully");

  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});