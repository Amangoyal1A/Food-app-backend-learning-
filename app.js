const express = require('express')
const app = express();

app.get('/', (req, res) => {
res.sendFile('./views/index.html',{root:__dirname})
})

app.get('/about', (req, res) => {
    res.sendFile('./views/about.html',{root:__dirname})
    })
//redirect
app.get('/about-us',(req,res)=>{
    res.redirect('/about')
})    
//404

app.use((req,res)=>{
    res.status(404).sendFile('./views/404.html',{root:__dirname})
})
const server = app.listen(3000, () => {
  console.log(`Server listening on port ${server.address().port}`)
})
