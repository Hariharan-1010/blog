import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const users = [];   
const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 3000;
const app = express();

app.use(express.static(path.join(__dirname,"public")));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.render("register.ejs", {
        title: "Register"
    });
});
app.post("/login",(req, res) => {
    
    console.log(req.body.name);
    res.render("login.ejs", {
        title: "Login"
    });
   const obj = req.body;
    formToObject(obj);
});

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});

function formToObject(obj) {
    // Create a Person object
    const temp = new Person(obj.name, obj.email, obj.pass);
    users.push(temp);
    console.log(users);
}
// Constructor function for Person objects
function Person(name, email, pass) {
    this.name = name;
    this.email = email;
    this.pass = pass;
  }
  
