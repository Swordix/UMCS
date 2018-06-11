const util = require('util');
const md = require('./modules/umcs.module.js');
var dvc = require("./models/device.js");
var deviceBD = require('mongoose').model('device');

const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const parser = new Readline();
const port = new SerialPort('/dev/ttyS0', { autoOpen: false, baudRate: 115200 });
port.pipe(parser);

port.open(function (err) {
    if (err) {
        return console.log('Error opening port: ', err.message);
    }
    port.write('main screen turn on');
});

var deviceinc = 0;
var index = 0;
var arr = [0];
var response = '';

deviceBD.ensureIndexes({ "sn_cpu": 1 });
deviceBD.ensureIndexes({ "dev_address": 2 });

parser.on('readable', function () {

    var s = parser.read();
    var pck = new md.packet(s);
    var eid = new md.EID(pck.eid);
    index++;

    if ((pck.reply == "RECV_CAN") && (eid.dir == 1) && (eid.dev_address == 4095) && (pck.crcbool)) {

        deviceBD.find({}, function (err, devices) {
            for (var i = 0; i < devices.length; i++) {
                if (arr.indexOf(devices[i].dev_address) == -1) { arr.push(devices[i].dev_address); }
            };
        });

        deviceBD.find({ sn_cpu: pck.can_data, type: eid.dev_type }, function (err, devices) {
            for (var i = 0; i < 4094; i++) {
                if (arr.indexOf(i) == -1) {
                    deviceinc = i;
                    arr.push(i);
                    break;
                }
            }

            if (devices.length == 0) {
                deviceBD.create({ sn_cpu: pck.can_data, type: eid.dev_type, dev_address: deviceinc }, function (err, res) {
                    if (!err) {
                        console.log('new device created: ' + pck.can_data + ' dev_address: ' + res.dev_address);
                    };
                });

            } else {
                deviceinc = devices[0].dev_address;
            };

            response = util.format('CMD=SEND_CAN:INDEX=%s:EID=%s:CAN_DATA=%s:CRC=NONE\r\n', index.toString().zfill(4), md.pickEID(eid.dev_type, eid.command, deviceinc), pck.can_data);
            port.write(response);

        });

    };

    if ((pck.reply == "RECV_CAN") && (eid.dir == 1) && (pck.crcbool) && (eid.dev_address != 4095)) {
        var type = eid.dev_type;
        switch (type) {
            case 1: {//adc

                deviceBD.findOne({ "dev_address": eid.dev_address }, function (err, device) {
                    var ch_dt1 = parseInt(md.selectData(pck.can_data, 0, 2), 16).toString(10);
                    var ch_dt2 = parseInt(md.selectData(pck.can_data, 2, 4), 16).toString(10);
                    var ch_div1 = md.selectData(pck.can_data, 4, 5).substring(0, 1);
                    var ch_div2 = md.selectData(pck.can_data, 4, 5).substring(1, 2);
                    var volt = parseInt(md.selectData(pck.can_data, 5, 7), 16).toString(10);

                    device['volt'] = volt;

                    if (device.child.length == 0) {
                        device.child.push({ 'sn': 1});
                        device.child.push({ 'sn': 2 });
                        console.log('new adc device created channel 1 and 2');
                    } else {
                        device.child[0]['data'] = ch_dt1;
                        device.child[0]['div'] = ch_div1;
                        device.child[1]['data'] = ch_dt2;
                        device.child[1]['div'] = ch_div2;
                    }

                    device.save(function (err, res) { });
                });
                break;
            }
            case 2: {//1-wire
                var sn = md.selectData(pck.can_data, 0, 7);
                var data = parseInt(md.selectData(pck.can_data, 7, 8), 16).toString(10);
                deviceBD.findOne({ "dev_address": eid.dev_address }, function (err, device) {
                
                    for (var i = 0; i < device.child.length; i++) {
                        var ys = true;
                        if (device.child[i]['sn'] == sn) {
                            device.child[i]['data'] = data;
                            ys = false;
                            break;
                        } else {
                            if ((device.child.length - 1 == i) && (ys)) {
                                device.child.push({ 'sn': sn });
                                ys = false;
                                console.log('new 1-wire device created sn: ' + sn); 
                            }
                        }
                    };

                    if (device.child.length == 0) {
                        device.child.push({ 'sn': sn });
                        console.log('new 1-wire device created sn: ' + sn);
                    }

                    device.save(function (err, res) { });

                });
            }
        };
    };
});

setInterval(function () {
    if (index >= 9999) index = 0;
    var command = 0;

    deviceBD.find({}, function (err, devices) {
        for (var i = 0; i < devices.length; i++) {
            index++;
            var type = devices[i].type;
            switch (type) {
                case 1: command = 2; break;
                case 2: command = 1024; break;
            };
            response = util.format('CMD=SEND_CAN:INDEX=%s:EID=%s:CAN_DATA=:CRC=NONE\r\n          ', index.toString().zfill(4), md.pickEID(type, command, devices[i].dev_address));
            port.write(response);
        };

    });

    //deviceBD.find({}, null, {}, function (err, res) {
    //    console.log(res); //вот здесь будут все документы
    //});
}, 300);
