//Importing Required Modules
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

//constants
const PORT = 3000;
const app = express();

const users = [];   
const __dirname = dirname(fileURLToPath(import.meta.url));
const userLoggedIn = { name: "", email: "", pass: "" }; // To Track the user logged in

// Variables
var msg = "The passwords doen not match!";
let isLogged = false;

//Declaring static path and to access from data used bodyParser
app.use(express.static(path.join(__dirname,"public")));
app.use(bodyParser.urlencoded({extended: true}));

//GET Routes

//Default Route. Register page
app.get("/", (req, res) => {
    res.render("register.ejs", {
        title: "Register",
        msg: "",
        key: isLogged ? "Logout" : "Login"
    });
});

//Home Route, where User can post if they are logged in
app.get("/home", (req, res) => {
    res.render("post.ejs",{
        title: "Post",
        key: isLogged ? "Logout" : "Login",
        postMsg: "Type Here ..."
    });
});

//Login Route, where User can login
app.get("/login", (req, res) => {
    res.render("login.ejs",{
        title: "Login",
        msg: "",
        key: isLogged ? "Logout" : "Login"
    });
});

//Route, where all posts are displayed
app.get("/postList", (req,res)=> {
    res.render("postList.ejs", {
            users: users,
            title: "PostList",
            key: isLogged ? "Logout" : "Login"
        });
});

//Route to logout and be redirected to login Route
app.get("/logout", (req, res) => {
    userLoggedIn.name = "";
    userLoggedIn.email = "";
    userLoggedIn.pass = "";
    isLogged = false; 
    res.render("login.ejs",{
        title: "Login",
        msg: "",
        key: isLogged ? "Logout" : "Login"
    });
});

//POST Routes

//Users will be registered
app.post("/register",(req, res) => {
    let obj = req.body;
    if(obj.pass === obj.password && !checkForExistenceOfUser(users, obj.email)){ // To determine If the user is new
        formToObject(obj); // Create and push User Object
        // console.log(users); // Check console for users
        res.render("login.ejs",{
            title: "Login",
            msg: "",
            key: isLogged ? "Logout" : "Login"
        }); 
    } else if(checkForExistenceOfUser(users, obj.email) && obj.pass === obj.password){ // If already a user, ask them to login
        res.render("register.ejs", {
            title: "Register",
            msg: "You are already registerd!. Login to proceed",
            key: isLogged ? "Logout" : "Login"
        });
    } else if(obj.pass !== obj.password){ // If passwords mismatch
        res.render("register.ejs", {
            title: "Register",
            msg: msg,
            key: isLogged ? "Logout" : "Login"
        });
    }
   
});

//Users will be logged in
app.post("/login", (req, res) => {
    let obj = req.body;
    if(validateUser(users, obj.email, obj.pass)) { // validate user
        updateLogger(users.find((user) => user.email === obj.email)); // update the user as logged in
        res.render("post.ejs",{
            title: "Post",
            key: isLogged ? "Logout" : "Login",
            postMsg: "Type Here ..."
        });
    } else {
        res.render("login.ejs",{
            title: "Login",
            msg: "Username or Password is wrong else register first!",
            key: isLogged ? "Logout" : "Login"
        });
    }
});


//Users post will be added in the postList
app.post("/home", (req, res) => {
     let user = users.findIndex((user) => user.email === userLoggedIn.email); // Find user logged in
     if(user != -1 && req.body.textarea != ""){ // If logged in and they are not submitting empty posts
        try {
            users[user].contents.push(req.body.textarea);
            res.render("post.ejs",{
                title: "Post",
                key: isLogged ? "Logout" : "Login",
                postMsg: "Type Here ..."
            });
        } catch (error) { // If they are not logged in
            console.log(error);
            res.render("login.ejs",{
                title: "Login",
                msg: "Login/register first!",
                key: isLogged ? "Logout" : "Login"
            });   
        }
     }else {
        res.render("post.ejs",{
            title: "Post",
            key: isLogged ? "Logout" : "Login",
            postMsg: "Login to post!"
        });
     }
});



app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});

function formToObject(obj) {
    const temp = new Person(obj.name, obj.email, obj.pass);     // Create a Person object
    users.push(temp); // Push to user Array
}
// Constructor function for Person objects
function Person(name, email, pass) {
    this.name = name;
    this.email = email;
    this.pass = pass;
    this.contents = [""];
  }
  
//Function to check if user in users array
function checkForExistenceOfUser(users, email) {
    if(users.length > 0){
        for (let user in users) {
            if(users[user].email === email) {  
                return true;
            }
        }
    }
    return false;
}

//Function to validate user
function validateUser(users, email, password) {
    if(users.length <=0 ){
        return false;
    }
    for (let user in users) {
        if(users[user].email === email && users[user].pass === password) {
            return true;
        }
    }
}

//Function to update userLoggedIn object
function updateLogger(user){
    userLoggedIn.name = user.name;
    userLoggedIn.email = user.email;
    userLoggedIn.pass = user.pass;
    isLogged = true;
}