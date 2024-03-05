import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';


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
    res.render("login.ejs", {
        title: "Login"
    });
});

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});
