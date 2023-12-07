let express = require('express') 
let fs = require('fs')

let jsonServer = require('json-server')
let bodyparser =  require('body-parser')
let app = express()
var path = require('path')


app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

const jsonServerMiddleWare =  jsonServer.router("api.json")

app.use('/api',jsonServerMiddleWare)




app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname,'public')));


app.get('/',(req,res)=>{
    res.redirect('/homepage')
})
 
app.get('/homepage',(req,res)=>{
    res.render("homepage")
    res.sendStatus(200)
})
app.post('/homepage', (req, res)=>{
    res.redirect('/homepage')
})
app.get('/about',(req,res)=>{
    res.render("about")
})
app.post('/about', (req, res)=>{
    res.redirect('/about')
})
app.get('/contact',(req,res)=>{
    res.render("contact")
})
app.post('/contact', (req, res)=>{
    res.redirect('/contact')
})
app.get('/addUser',(req,res)=>{
    res.render("addUser")
})
app.post('/addUser', (req, res)=>{
    res.redirect('/addUser')
})






app.post('/users', (req, res)=>{
    const users = JSON.parse(fs.readFileSync("api.json")).users
    let user = {
        id:Date.now(),
        fname:req.body.fname,
        lname:req.body.lname,
        email:req.body.email,
        address:req.body.address,
        country:req.body.country
    }
    users.push(user)
    fs.writeFileSync('api.json', JSON.stringify({users}))
    res.redirect('/users')
})

app.get("/delUser/:id",(req,res)=>{
    const users = JSON.parse(fs.readFileSync("api.json")).users;
    const userIndex = users.findIndex((u)=> u.id === parseInt(req.params.id));
    if(userIndex===-1) return req.status(404).send("User not found");
    users.splice(userIndex,1);
    fs.writeFileSync("api.json", JSON.stringify({users}));
    res.redirect('/users')
})


app.get("/editUser/:id",(req,res)=>{
    const users = JSON.parse(fs.readFileSync("api.json")).users;
    const user = users.find((u)=> u.id === parseInt(req.params.id));
    res.render('editUser', {data:users, userData:user})
})


app.post('/editUser/:id',(req,res) => {
    const users = JSON.parse(fs.readFileSync("api.json")).users;
    const user = users.find((u) => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).send("User not found");
    Object.assign(user, req.body) 
    fs.writeFileSync("api.json", JSON.stringify({users}));
    res.redirect('/users')
})






app.get('/users',(req,res)=>{
    const users = JSON.parse(fs.readFileSync("api.json")).users
    res.render("listUsers", {data: users})
})


app.listen (5000, () => {
console.log ("App is listening on port 5000")
})