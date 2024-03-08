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


//Default home Route that is register
app.get("/", (req, res) => {
    res.render("register.ejs", {
        title: "Register",
        msg: ""
    });
});

//Get route for posts
app.get("/home", (req, res) => {
    if(currentUser) currentUserName = currentUser['name'];
    res.render("post.ejs",{
        title: "Post"
    });
});

//Get route for login, for buttons
app.get("/login", (req, res) => {
    res.render("login.ejs",{
        title: "Login",
        msg: ""
    });
});

//Get for postList
app.get("/postList", (req,res)=> {
    res.render("postList.ejs", {
            users: users,
            title: "PostList"
        });
});

//Post for login , still work needed
app.post("/register",(req, res) => {
    let obj = req.body;
    if(obj.pass === obj.password && !checkForExistenceOfUser(users, obj.email)){
        formToObject(obj);
        console.log(users);
        res.render("login.ejs",{
            title: "Login",
            msg: ""
        }); 
    } else if(checkForExistenceOfUser(users, obj.email)){
        res.render("register.ejs", {
            title: "Register",
            msg: "You are already registerd!. Login to proceed",
        });
    } else if(obj.pass !== obj.password){
        res.render("register.ejs", {
            title: "Register",
            msg: msg
        });
    }
   
});

//Posting the post
app.post("/home", (req, res) => {
     let user = getUser(users, currentUserName);
     console.log(`user => ${user}\n`);
     console.log(`users: ${users}, index = ${user}, that user => ${users[user]} `);
     if(user != -1 && req.body.textarea != ""){
        try {
            users[user].contents.push(req.body.textarea);
            res.render("post.ejs",{
                title: "Post"
            });
        } catch (error) {
            console.log(error);
            res.render("register.ejs", {
                title: "Register",
                msg: "Register to post !",
            });    
        }
     }else {
        res.render("post.ejs",{
            title: "Post"
        });
     }
});

//post for login
app.post("/login", (req, res) => {
    let obj = req.body;
    if(validateUser(users, obj.email, obj.pass)) {
        res.render("post.ejs",{
            title: "Post"
        });
    } else {
        res.render("login.ejs",{
            title: "Login",
            msg: "Username or Password is wrong else register first!"
        });
    }
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
    this.contents = [""];
  }
  
function getUser(arrayOfObj, name) {
    if(arrayOfObj.length > 0){
        let user;
        for(let i in arrayOfObj) {
            if(arrayOfObj[i].name === name){
                user = i;
            }  
        };
        console.log(`userin getUser ${user}`);
        return user;
    }
    else return "";
}

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