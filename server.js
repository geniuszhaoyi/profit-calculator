const express = require('express');
const path = require('path');

const app = express();

const nameOfApp = 'pc';

// Serve only the static files form the dist directory
app.use(express.static(__dirname + `/dist/${nameOfApp}`));

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + `/dist/${nameOfApp}/index.html`));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);