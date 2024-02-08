const express = require('express');
const app = express();
const cors = require('cors');
const Port = 3000;

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

const router = require('./routes/index')

app.use("/api/v1", router);

app.listen(Port, () => {
    console.log("server started on ", Port);
})