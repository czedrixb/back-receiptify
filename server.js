require('dotenv').config();
const express = require('express');
const authRoute = require("./routes/authRoute");
const errorMiddleware = require('./middleware/errorMiddleware');
const app = express();

const PORT = process.env.PORT || 8000

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
    res.json('hello api');
});

app.use('/api', authRoute);


app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Node API running on port ${PORT}`);
});