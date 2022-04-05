const app = require('./app.js');

// const PORT = 8000;

// app.listen(PORT, () => console.log(`server should be running at http://localhost:${PORT}/`))

app.listen(process.env.PORT || 8000, () => console.log("Server is running..."));