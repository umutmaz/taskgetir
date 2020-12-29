const express = require('express');
const cors = require('cors');
const swagger = require("swagger-ui-express");
const swaggerJSON = require("./swagger.json");
const service = require("./service")
const db = require("./db")
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


app.use("/records",service)
app.use("/api", swagger.serve, swagger.setup(swaggerJSON));
app.get("/test", async (req, res) => {
    res.json({ message: "pass!" });
  });


db.connect().then(()=>{
    app.listen(port, () => {
        console.log(`Server is running on port: ${port}`);
    });
})

module.exports = app;