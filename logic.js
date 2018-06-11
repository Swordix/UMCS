var arr_and = [     //логическа И: 4 входа, 1 выход
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null]
];

//----------------------------------------------------------------------------------------------------------------------
var arr_or = [     //логическая ИЛИ: 4 входа, 1 выход
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null]
];
//----------------------------------------------------------------------------------------------------------------------
var arr_inv = [     //логический ИНВЕРТОР: вход, выход
    [null, null],
    [null, null],
    [null, null],
    [null, null],
    [null, null],
    [null, null],
    [null, null],
    [null, null],
    [null, null],
    [null, null]
];
//----------------------------------------------------------------------------------------------------------------------
var arr_schmitt = [     //логический Триггер Шмитта: вход, верхняя граница, нижняя граница, выход
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null]
];

//----------------------------------------------------------------------------------------------------------------------
var arr_rs = [     //Переключатель: вход, ресет, выход
    [null, null, null],
    [null, null, null],
    [null, null, null]
];

var count = 0;
require('events').EventEmitter.defaultMaxListeners = 0;
setInterval(function (){


    nil = 0;
    one = 0;
    for (var i = 0; i < arr_and.length; i++) {
        for (var n = 0; n < 4; n++) {
            if (arr_and[i][n] != null) {
                if (arr_and[i][n] == 0) {
                    nil++;
                };

                if (arr_and[i][n] == 1) {
                    one++;
                };
            };
        };

        if ((nil == 0) && (one > 1)) {
            arr_and[i][4] = 1;
        } else {
            arr_and[i][4] = 0;
        };
    };

    for (var i = 0; i < arr_or.length; i++) {
        if (arr_or[i][0] || arr_or[i][1] || arr_or[i][2] || arr_or[i][3]) {
            arr_or[i][4] = 1;
        } else {
            arr_or[i][4] = 0;
        }
    }

    for (var i = 0; i < arr_inv.length; i++) {
        if (arr_inv[i][0] == 1) {
            arr_inv[i][1] = 0
        } else {
            arr_inv[i][1] = 1
        };
    };

    for (var i = 0; i < arr_schmitt.length; i++) {
        if (arr_schmitt[i][0] >= arr_schmitt[i][1] && arr_schmitt[i][1] != null && arr_schmitt[i][0] <= arr_schmitt[i][2] && arr_schmitt[i][2] != null) {
            arr_schmitt[i][3] = 1
        } else {
            arr_schmitt[i][3] = 0
        };
    };

    for (var i = 0; i < arr_rs.length; i++) {
        if (arr_rs[i][0] == 1 && (arr_rs[i][1] == 0 || arr_rs[i][1] == null)) {
            arr_rs[i][2] = 1
        } else {
            arr_rs[i][2] = 0
        };
    };

    out = {};
    out.and = [{
        and_0: arr_and[0][4], and_1: arr_and[1][4], and_2: arr_and[2][4],
        and_3: arr_and[3][4], and_4: arr_and[4][4], and_5: arr_and[5][4],
        and_6: arr_and[6][4], and_7: arr_and[7][4], and_8: arr_and[8][4],
        and_9: arr_and[9][4]
    }];

    out.or = [{
        or_0: arr_or[0][4], or_1: arr_or[1][4], or_2: arr_or[2][4],
        or_3: arr_or[3][4], or_4: arr_or[4][4], or_5: arr_or[5][4],
        or_6: arr_or[6][4], or_7: arr_or[7][4], or_8: arr_or[8][4],
        or_9: arr_or[9][4]
    }];

    out.inv = [{
        inv_0: arr_inv[0][1], inv_1: arr_inv[1][1], inv_2: arr_inv[2][1],
        inv_3: arr_inv[3][1], inv_4: arr_inv[4][1], inv_5: arr_inv[5][1],
        inv_6: arr_inv[6][1], inv_7: arr_inv[7][1], inv_8: arr_inv[8][1],
        inv_9: arr_inv[9][1]
    }];

    out.schmitt = [{
        schmitt_0: arr_schmitt[0][3], schmitt_1: arr_schmitt[1][3], schmitt_2: arr_schmitt[2][3],
        schmitt_3: arr_schmitt[3][3], schmitt_4: arr_schmitt[4][3], schmitt_5: arr_schmitt[5][3],
        schmitt_6: arr_schmitt[6][3], schmitt_7: arr_schmitt[7][3], schmitt_8: arr_schmitt[8][3],
        schmitt_9: arr_schmitt[9][3]
    }];
    
    out.rs = [{
        rs_0: arr_rs[0][2], rs_1: arr_rs[1][2], rs_2: arr_rs[2][2]
    }];

    process.send({ out });

    process.on("message", (m) => {

        if (m == 'reset') {
            clear();
        }
    });
   
}, 40);

function clear(){
    for (var i = 0; i < arr_and.length; i++) {
        for (var n = 0; n < 4; n++) {
            arr_and[i][n] = null;
        };
    };

    for (var i = 0; i < arr_or.length; i++) {
        for (var n = 0; n < 4; n++) {
            arr_or[i][n] = null;
        };
    };
    
    for (var i = 0; i < arr_inv.length; i++) {
        arr_inv[i][0] = null;
    };

    for (var i = 0; i < arr_schmitt.length; i++) {
        for (var n = 0; n < 4; n++) {
            arr_schmitt[i][n] = null;
        };
    };

    for (var i = 0; i < arr_rs.length; i++) {
        for (var n = 0; n < 3; n++) {
            arr_rs[i][n] = null;
        };
    };
}
var dvc = require("./models/device.js");
var deviceBD = require('mongoose').model('device');
var cvc = require("./models/connect.js");
var connectBD = require('mongoose').model('connect');
var conn, in_net, in_val, cell, arr, device_arr=0;


setInterval(function (){ //ОУ!*/
    deviceBD.find({}, function (err, devices) {
        device_arr = devices;
    });
}, 200);


setInterval(function (){ //ОУ!*/
    connectBD.find({}, function (err, connects) {

        for (var i = 0; i < connects.length; i++) {
           conn = connects[i];
           in_val = conn.in_val[0];
           in_net = conn.in_net[0];
           id = (conn.id).split("_");
           
                for (var n = 0; n < in_net.length; n++){
                    if (in_net[n] != null){
                        inid = (in_net[n]).split("_");

                        if ((inid[0]=='ADC')||(inid[0]=='OneWire')){
                            //----------------------------------------device!
                            for (var o = 0; o < device_arr.length; o++) {
                                for (var h = 0; h < device_arr[o].child.length; h++) {
                                    var sn = device_arr[o].child[h].sn;
                                        if (sn==inid[2]){
                                            var value = device_arr[o].child[h].data;
                                            var arr = eval('arr_' + id[0])[id[1]];
                                            arr[0] = value;
                                            arr[1] = in_val[0];
                                            arr[2] = in_val[1];
                                        };
                                };
                            };
                            //----------------------------------------device!
                        }else{
                            cell = eval('arr_' + inid[0])[inid[1]].length-1;
                            eval('arr_' + id[0])[id[1]][n] = eval('arr_' + inid[0])[inid[1]][cell];
                        };
                    };
                };

        };


    });

}, 300);
