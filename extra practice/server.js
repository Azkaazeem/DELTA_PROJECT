const express = require("express");
const app = express();
const user = require("./routes/user.js");
const post = require("./routes/post.js");
const session = require("express-session");

app.use(session({secret: "mysecretstring" , resave: false , saveUninitialized: true}));

app.get("/reqcount" , (req , res) => {
    if(req.session.count) {
        req.session.count++;
    } else {
        req.session.count = 1;
    }
    res.send(`you come on this website in same session ${req.session.count} times`)
}
)
// app.get("/test" , (req,res) => {
//     res.send("test successful!");
// });

app.listen("8080", () => {
    console.log("app is listening on port 8080");
});