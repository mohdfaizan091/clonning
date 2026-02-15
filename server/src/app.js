import express from "express";

const app = express();


//health route
app.get("/home" , (req, res) => {
    res.send("server is health");
})

//export app
export default app;