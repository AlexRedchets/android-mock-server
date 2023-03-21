const express = require('express');
const routes = require('./routes/routes');
const port = 3000;

const app = express();

// prettify json response
app.set('json spaces', 4);

app.use('/', routes);

app.listen(port, () => {
  console.log(`SWM Mock server is running on port ${port}`)
});
