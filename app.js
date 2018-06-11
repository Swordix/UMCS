const sp = require("child_process");
let childlogic = sp.fork('./logic.js');
let childhttp = sp.fork('./serial.js');

////--------------------------------------------------------Работа с http-------------------------------------------------------
var dvc = require("./models/device.js");
var cvc = require("./models/connect.js");
var usr = require("./models/users.js");
var deviceBD = require('mongoose').model('device');
var connectBD = require('mongoose').model('connect');
var usersBD = require('mongoose').model('user');
var path = require('path');
var express = require("express");
var app = express();
var querylogic = {};
const md = require('./modules/umcs.module.js');

childlogic.on("message", (data) => {
    querylogic = data.out;
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/client/index.html'));
});

app.use(express.static(path.join(__dirname + '/client/')));

app.get("/config/GET_BLOCKS_VALUES/", function (request, response) {
    response.setHeader('Content-Type', 'application/json');
    response.send(JSON.stringify(querylogic, null, 4));
});

app.get("/config/GET_SENSORS_VALUES/", function (request, response) {
    response.setHeader('Content-Type', 'application/json');

    var obj = {};
    var name = '';
    deviceBD.find({}, function (err, devices) {

        for (var i = 0; i < devices.length; i++) {
            switch (devices[i].type) {
                case 0: { //широковещательный по типу модуля;
                    break;
                }
                case 1: { //модуль mADC;
                    name = 'ADC_' + devices[i].dev_address;
                    break;
                }
                case 2: { //модуль mOneWire;
                    name = 'OneWire_' + devices[i].dev_address;
                    break;
                }
            }

            obj[name] = devices[i];
        }
        response.send(JSON.stringify(obj, null, 4));
    });

});    

app.get('/SET_BLOCK', function (request, response) {
    console.log('***********************'); 
    console.log(request.url);
    console.log('***********************');
    var id, name, x, y, in_net, in_val;

    
    connectBD.remove({}, function (err) { 
        console.log('collection "connect" removed, next save..');
        childlogic.send('reset');
    });

    response.setHeader('Content-Type', 'text/plain'); 
    var js = md.selectJSON(request.url);

    for (var i = 0; i < js.length; i++) {
        id = js[i].id;
        name = js[i].name;
        x = js[i].x;
        y = js[i].y;
        in_net = [js[i].in_net[0], js[i].in_net[1], js[i].in_net[2], js[i].in_net[3]];
        in_val = [js[i].in_val[0], js[i].in_val[1], js[i].in_val[2], js[i].in_val[3]];

        connectBD.collection.update({ id: id }, {
            $addToSet: {
                'name': name, 'x': x, 'y': y, 'in_net': in_net, 'in_val': in_val
            }
        }, { upsert: true }, function (err, res) {
            if ((!err) && (js.length == i)) {
                response.end('saved!');
                console.log('collection "connect" saved!');
            };
        });
    };
});

app.get('/GET_BLOCK', function (request, response) {
    var obj = {};
    response.setHeader('Content-Type', 'application/json');
    connectBD.find({}, function (err, connects) {
        for (var i = 0; i < connects.length; i++) {
            obj[connects[i].id] = connects[i];
        };

        if (!err) response.send(JSON.stringify(obj, null, 4));
    });
});

app.get('/DELETE_All', function (request, response) {
    //deviceBD.remove({}, function (err) {
    //    console.log('collection "device" removed!');
    //});

    connectBD.remove({}, function (err) {
        console.log('collection "connect" removed!');
    });

    childlogic.send('reset');
    response.send('ok');
});

app.get('/DELETE_WIDGET', function (request, response) {
   
    response.setHeader('Content-Type', 'text/plain'); 
    var js = md.selectJSON(request.url);
    var id = js[0].id;
    
    connectBD.remove({ id: id }, function (err) { 
        console.log('widget'+ id + 'removed');
        response.send('ok');
    });

});

app.listen(3000, function () {
    console.log("Working on port 3000");
});
