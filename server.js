require('dotenv').config();
const express = require('express');
const session = require('express-session');
const authRoute = require("./routes/authRoute");
const errorMiddleware = require('./middleware/errorMiddleware');
const app = express();

const PORT = process.env.PORT || 8000

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET || 'defaultsecret',
    resave: false,
    saveUninitialized: true,
}));

app.use('/api', authRoute);


app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Node API running on port ${PORT}`);
});