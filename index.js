import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const users = [];   
const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 3000;
const app = express();
var msg = "The passwords doen not match!";
let currentUser;
let currentUserName="";
app.use(express.static(path.join(__dirname,"public")));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.render("register.ejs", {
        title: "Register",
        msg: ""
    });
});
app.post("/login",(req, res) => {
    const obj = req.body;
    if(obj.pass === obj.password){
        formToObject(obj);
        res.render("login.ejs", {
            title: "Login"
        });
    } else {
        res.render("register.ejs", {
            title: "Register",
            msg: msg
        });
    }
   
});
app.get("/home", (req, res) => {
    if(currentUser) currentUserName = currentUser['name'];
    res.render("post.ejs");
});
app.post("/home", (req, res) => {
     let user = getUser(users, currentUserName);
    user.contents.push(req.body.textarea);
    res.render("postList.ejs", {
        users: users
    });
});

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});

function formToObject(obj) {
    // Create a Person object
    const temp = new Person(obj.name, obj.email, obj.pass);
    users.push(temp);
    currentUser = temp;
}
// Constructor function for Person objects
function Person(name, email, pass) {
    this.name = name;
    this.email = email;
    this.pass = pass;
    this.contents = [];
  }
  
function getUser(obj, name) {
    let user;
    obj.forEach(usr => {
        if(usr.name === name){
            user = usr;
        }  
    });
    return user;
}