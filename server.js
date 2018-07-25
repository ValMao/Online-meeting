var fs = require('fs');
var express = require('express');
var app = express();
var options = {
    key: fs.readFileSync('fake-keys/privatekey.pem'),
    cert: fs.readFileSync('fake-keys/certificate.pem')
};
var server = require('https').createServer(options, app);

server.listen(4000, function(){
    console.log("listening to port 4000 (https://localhost:4000)");
});

// Static files
app.use(express.static('public'));

app.get('/', function(req,res){
    res.sendfile(__dirname + '/public/login.html');
}); 

app.get('/login', function(req,res){
    res.sendfile(__dirname + '/public/login.html');
}); 

app.get('/conference-room', function(req,res){
    res.sendfile(__dirname + '/public/conference-room.html');
}); 

