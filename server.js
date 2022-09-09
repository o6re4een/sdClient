const express = require("express")
var https = require('https');
var http = require('http');
const path = require("path")
const PORT = process.env.PORT || 80

const app = express()
app.use(express.static(__dirname))
app.use(express.static(path.resolve(__dirname, 'build')))

app.get("*", (req, res)=>{
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})
http.createServer(app).listen(80);