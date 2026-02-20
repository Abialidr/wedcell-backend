// var express = require('express');
// var app = express();
// var path = require('path');
// var PORT = 3000;
 
// Without middleware
app.get('/76EEF7768982FD673F68729262210EAE.txt', function(req, res){
    var options = {
        root: path.join(__dirname)
    };
     
    var fileName = '76EEF7768982FD673F68729262210EAE.txt';
    res.sendFile(fileName, options, function (err) {
        if (err) {
            next(err);
        } else {
             console.log('Sent:', fileName);
            
        }
    });
});
 
