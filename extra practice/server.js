const express = require("express");
const app = express();
const user = require("./routes/user.js");
const post = require("./routes/post.js");
const cookieParser = require("cookie-parser");

app.listen("8080", () => {
    console.log("app is listening on port 8080");
});

app.use(cookieParser());

app.get("/" , (req , res) => {
    res.send("User home page");
});

app.get("/getcookie" , (req , res) => {
    res.cookie("greet" , "hello");
    res.send("send your some cookie");
});

app.get("/greet" , (req , res) => {
    let {name = "anonyms"} = req.cookie;
    res.send(`Hi, ${name}`);
});

app.use("/user" , user);
app.use("/posts" , post);