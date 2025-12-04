const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const routes = require('./routes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
    origin: '*', 
    credentials: true,
}));
app.use(express.json());



app.use('/api', routes);



sequelize.sync({ alter: true }) 
  .then(() => {
    console.log('Database Connected & Synced');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log('Error: ' + err));