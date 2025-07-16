const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const geminiRoute = require('./routes/gemini');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/gemini', geminiRoute);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 