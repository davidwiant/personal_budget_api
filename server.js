const express = require('express');
const app = express();

module.exports = app;

const PORT = process.env.port || 3000;

app.get('/', (req, res, next) => {
    res.send('Hello World');
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
