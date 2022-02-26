const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();

app.listen(3000, () => {
    console.log("Server started ...");
});

app.get("/", (Request, Response) => {
    Response.send("Hello From The Server");
})