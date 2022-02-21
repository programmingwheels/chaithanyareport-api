const express = require("express")
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const { getConsolidatedReport } = require("./controllers/report");
const cors = require("cors")

app.use(cors());

mongoose.connect(process.env.MONGO_URI)
    .then((result) => {
        console.log(`Connection Established`)
    })
    .catch(err => {
        console.log(err)
    })

app.get("/get-consolidated-report", getConsolidatedReport);


const port = process.env.PORT || 3333

app.listen(port, () => {
    console.log(`Server is running on a port ${port}`);
})