const app = require('./app.js');

const PORT = 8000;

app.listen(PORT, () => console.log(`server should be running at http://localhost:${PORT}/`))