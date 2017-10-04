var socket;
var server = ''; //192.168.14.100';
var programBoard = {};

var grblParams = {
}

var smoothieParams = {
}


function friendlyPort(i) {
    // var likely = false;
    var img = 'usb.png';
    var note = '';
    var manufacturer = availports[i].manufacturer
    if (manufacturer == `(Standard port types)`) {
      img = 'serial.png'
      note = 'Motherboard Serial Port';
    } else if ( availports[i].productId && availports[i].vendorId ) {
        if (availports[i].productId == '6015' && availports[i].vendorId == '1D50') {
          // found Smoothieboard
          img = 'smoothieboard.png';
          note = 'Smoothieware USB Port';
          // if (wizardBoard == 'Smoothieboard') {
          //   likely = true;
          // } else {
          //   likely = false;
          // }
        }
        if (availports[i].productId == '6001' && availports[i].vendorId == '0403') {
          // found FTDI FT232
          img = 'usb.png';
          note = 'FTDI USB to Serial';
        }
        if (availports[i].productId == '6015' && availports[i].vendorId == '0403') {
          // found FTDI FT230x
          img = 'usb.png';
          note = 'FTDI USD to Serial';
        }
        if (availports[i].productId == '606D' && availports[i].vendorId == '1D50') {
          // found TinyG G2
          img = 'usb.png';
          note = 'Tiny G2';
        }
        if (availports[i].productId == '003D' && availports[i].vendorId == '2341') {
          // found Arduino Due Prog Port
          img = 'due.png';
          note = 'Arduino Due Prog';
        }
        if (availports[i].productId == '0043' && availports[i].vendorId == '2341' || availports[i].productId == '0001' && availports[i].vendorId == '2341' || availports[i].productId == '0043' && availports[i].vendorId == '2A03') {
          // found Arduino Uno
          img = 'uno.png';
          note = 'Arduino Uno';
        }
        if (availports[i].productId == '2341' && availports[i].vendorId == '0042') {
          // found Arduino Mega
          img = 'mega.png';
          note = 'Arduino Mega';
        }
        if (availports[i].productId == '7523' && availports[i].vendorId == '1A86') {
          // found CH340
          img = 'uno.png';
          note = 'CH340 Arduino Fake';
        }
        if (availports[i].productId == 'EA60' && availports[i].vendorId == '10C4') {
          // found CP2102
          img = 'nodemcu.png';
          note = 'NodeMCU';
        }
    } else {
      img = "usb.png";
    }

    return {
      img: img,
      note: note
    };
}

function initSocket() {

    // Enable debug
    // localStorage.debug = '*';

    socket = io.connect(server); // socket.io init
    socket.emit('closePort', 1);
    socket.emit('firstLoad', 1);

    socket.on('statusjson', function (data) {
        console.log(data);
    });

    socket.on('activeIP', function (data) {
        console.log(data);
    });
    socket.on('activePort', function (data) {
        console.log(data);
    });
    socket.on('connectStatus', function (data) {
        console.log(data);
    });
    socket.on('error', function (data) {
        console.log(data);
    });
    socket.on('feedOverride', function (data) {
        console.log(data);
    });
    socket.on('firmware', function (data) {
        console.log(data);
        // var firmwaredat = ""
        // firmwaredat += data.firmware;
        // firmwaredat += ' ';
        // firmwaredat += data.version;
        // firmwaredat += ' ';
        // firmwaredat += data.date;
        // $('#fwdat').val(firmwaredat)
        //
        // if (data.firmware === 'grbl') {
        //   socket.emit('runCommand', '$$');
        //   $('#grblSaveBtn').removeAttr('disabled');
        //   $('#grblFirmwareBtn').removeAttr('disabled');
        // } else {
        //   $('#grblSaveBtn').attr('disabled','disabled');
        //   $('#grblFirmwareBtn').attr('disabled','disabled');
        // }
    });
    socket.on('mPos', function (data) {
        console.log(data);
        // var pos = ""
        // pos += 'X:' + data.x + '; ';
        // pos += 'Y:' + data.y + '; ';
        // pos += 'Z:' + data.z + '; ';
        // $('#mPos').val(pos)
    });
    socket.on('wOffset', function (data) {
        console.log(data);
        // var pos = ""
        // pos += 'X:' + data.x + '; ';
        // pos += 'Y:' + data.y + '; ';
        // pos += 'Z:' + data.z + '; ';
        // $('#wOffset').val(pos)
    });
    socket.on('wPos', function (data) {
        // console.log(data);
        // var pos = ""
        // pos += 'X:' + data.x + '; ';
        // pos += 'Y:' + data.y + '; ';
        // pos += 'Z:' + data.z + '; ';
        // $('#wPos').val(pos)
    });
    socket.on('qCount', function (data) {
        console.log(data);
        // $('#qCount').val(data)
    });
    socket.on('rapidOverride', function (data) {
        console.log(data);
    });
    socket.on('realFeed', function (data) {
        console.log(data);
    });
    socket.on('realSpindle', function (data) {
        console.log(data);
    });
    socket.on('runStatus', function (data) {
        console.log(data);
        // $('#runStatus').val(data)
    });
    socket.on('spindleOverride', function (data) {
        console.log(data);
    });


    socket.on('ports', function (data) {
        availports = data;
        console.log(data);
        // populatePortsMenu();
    });

    socket.on('data', function (data) {
      // console.log(data)
      //   $('#syncstatus').html('Socket OK');
      //   // isConnected = true;
      //   if ( data.indexOf('alpha_steps_per_mm') === 0 || data.indexOf('beta_steps_per_mm') === 0 || data.indexOf('gamma_steps_per_mm') === 0 || data.indexOf('x_axis_max_speed') === 0 || data.indexOf('y_axis_max_speed') === 0 || data.indexOf('z_axis_max_speed') === 0 || data.indexOf('acceleration') === 0 || data.indexOf('z_acceleration') === 0 || data.indexOf('endstops_enable') === 0) {
      //      smoothieSettings(data)
      //  } else if (data.indexOf('$') === 0) {
      //      grblSettings(data)
      //  } else if (data.indexOf('<') === 0) {
      //      updateStatus(data);
      //  } else if (data.indexOf('{\"sr\"') === 0) {
      //      updateStatusTinyG(data);
      //  } else if (data === 'ok') {
      //      printLog(data, '#cccccc', "usb");
      //  } else {
      //      data = data.replace(/(\r\n|\n|\r)/gm,""); // strip blank newline sent by Grbl/lwcomms after connecting
      //      if (data.length > 0) {
      //        printLog(data, msgcolor, "usb");
      //      }
      //  }
   });

   socket.on('connectStatus', function (data) {
      console.log(data);
        // $('#syncstatus').html('Socket OK');
        // if (data.indexOf('opened') >= 0) {
        //     isConnected = true;
        // }
        // $('#connectStatdat').val(data)
    });

    socket.on('progStatus', function (data) {
         console.log(data)
        //  //  $('#syncstatus').html('Socket OK');
        //  $('#progStatdat').val(data)
        //  if (data.indexOf('Programmed Succesfully') != -1 || data.indexOf('flash complete') != -1) {
        //    canWeEnableUpload()
        //  }
        //  printLog(data, msgcolor, "usb");
     });

    $('#sendCommand').on('click', function () {
        var commandValue = $('#command').val();
        sendGcode(commandValue);
        $('#command').val('');
    });


};

function selectPort(i) {
    socket.emit('closePort', 1);
    var port = friendlyPort(i);
    var template = `
    <img src="images/`+ port.img +`"> `+availports[i].comName+`: <small> `+ port.note +`</small>&nbsp;<span class="glyphicon glyphicon-chevron-down"></span>`
    $('#portType').html(template);
    // console.log('connect btn');
      var portName = $('#port').val();
      var baudRate = $('#baud').val();
      socket.emit('connectTo', 'usb,' + availports[i].comName + ',' + '115200');


};

function closePort() {
  socket.emit('closePort', 1);
  populatePortsMenu();
  $('.mdata').val('');
}

function populatePortsMenu() {
  var portsdat = "";
  $('#portsmenu').empty();
  $('#ports').empty();
  var port = friendlyPort(0)
  var template = `
    <div class="btn-group" style="width: 100%">
      <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="portType">
        <img src="images/notconnect.png">
        Not Connected<small> - please select</small>&nbsp;
        <span class="glyphicon glyphicon-chevron-down"></span>
      </button>

      <ul class="dropdown-menu" id="portsmenu">

      </ul>
      <btn class="btn btn-comms btn-danger" onclick="closePort();"><i class="fa fa-times" aria-hidden="true"></i></btn>
    </div>`

  $('#ports').append(template);

  for (i=0; i<availports.length; i++) {
      var port = friendlyPort(i)
      // if (port.likely) {
      //     checkmark = `<i style="color: #bfffbf;" class="fa fa-fw fa-check-circle" aria-hidden="true"></i>`;
      // } else {
      //     checkmark = `<i style="color: #ffbfbf;" class="fa fa-fw fa-times-circle" aria-hidden="true"></i>`;
      // }
      var portslist = `
      <li>
        <a href="#" title="Select this card" onclick="selectPort(`+i+`)"><img src="images/`+ port.img + `"> `+availports[i].comName+`: <small> `+ port.note +`</small>&nbsp;</a>
      </li>`
      $('#portsmenu').append(portslist);
      portsdat += availports[i].comName +'; '
  };
  $('#availPortdat').val(portsdat)

}

function sendGcode(gcode) {
    printLog("[sent] "+ gcode, msgcolor, 'terminal')
    if (gcode) {
        // console.log('Sending', gcode)
            socket.emit('runCommand', gcode);
            if (gcode = '$$' ) {
              grblSettings
            }
    }
}

  function updateStatus(data) {
      // Smoothieware: <Idle,MPos:49.5756,279.7644,-15.0000,WPos:0.0000,0.0000,0.0000>
      // till GRBL v0.9: <Idle,MPos:0.000,0.000,0.000,WPos:0.000,0.000,0.000>
      // since GRBL v1.1: <Idle|WPos:0.000,0.000,0.000|Bf:15,128|FS:0,0|Pn:S|WCO:0.000,0.000,0.000> (when $10=2)

      // Extract state
      var state = data.substring(data.indexOf('<') + 1, data.search(/(,|\|)/));
      if (state === 'Alarm') {
          $("#machineStatus").removeClass('badge-ok');
          $("#machineStatus").addClass('badge-notify');
          $("#machineStatus").removeClass('badge-warn');
          $("#machineStatus").removeClass('badge-busy');
          if ($('#alarmmodal').is(':visible')) {
              // Nothing, its already open
          } else {
              $('#alarmmodal').modal('show');
          }
      } else if (state === 'Home') {
          $("#machineStatus").removeClass('badge-ok');
          $("#machineStatus").removeClass('badge-notify');
          $("#machineStatus").removeClass('badge-warn');
          $("#machineStatus").addClass('badge-busy');
          if ($('#alarmmodal').is(':visible')) {
              $('#alarmmodal').modal('hide');
          }
      } else if (state === 'Hold') {
          $("#machineStatus").removeClass('badge-ok');
          $("#machineStatus").removeClass('badge-notify');
          $("#machineStatus").addClass('badge-warn');
          $("#machineStatus").removeClass('badge-busy');
          if ($('#alarmmodal').is(':visible')) {
              $('#alarmmodal').modal('hide');
          }
      } else if (state === 'Idle') {
          $("#machineStatus").addClass('badge-ok');
          $("#machineStatus").removeClass('badge-notify');
          $("#machineStatus").removeClass('badge-warn');
          $("#machineStatus").removeClass('badge-busy');
          if ($('#alarmmodal').is(':visible')) {
              $('#alarmmodal').modal('hide');
          }
      } else if (state === 'Run') {
          $("#machineStatus").removeClass('badge-ok');
          $("#machineStatus").removeClass('badge-notify');
          $("#machineStatus").removeClass('badge-warn');
          $("#machineStatus").addClass('badge-busy');
          if ($('#alarmmodal').is(':visible')) {
              $('#alarmmodal').modal('hide');
          }
      }
      $('#machineStatus').html(state);
      $('#connectStatdat').val(state);

      // Extract Pos
      var startPos = data.search(/wpos:/i) + 5;
      var pos;
      if (startPos > 5) {
          pos = data.replace('>', '').substr(startPos).split(/,|\|/, 3);
      } else {
          startPos = data.search(/mpos:/i) + 5;
          if (startPos > 5) {
              pos = data.replace('>', '').substr(startPos).split(/,|\|/, 3);
          }
      }
      if (Array.isArray(pos)) {
          var xpos = parseFloat(pos[0]).toFixed(2);
          var ypos = parseFloat(pos[1]).toFixed(2);
          var zpos = parseFloat(pos[2]).toFixed(2);

          $('#mX').html(xpos);
          $('#mY').html(ypos);
          $('#mZ').html(zpos);
          // if (bullseye) {
          //     setBullseyePosition(pos[0], pos[1], pos[2]); // Also updates #mX #mY #mZ
          // }

          // if (playing) {
          //   TweenMax.to(controls.target, 1, { x: (xpos - (laserxmax / 2)), y: (ypos - (laserymax / 2)), z: zpos });
          //   TweenMax.to(camera.position, 1, { x: xpos, y: ypos, z: 500 });
          // }
      }

      // Extract override values (for Grbl > v1.1 only!)
      startOv = data.search(/ov:/i) + 3;
      if (startOv > 3) {
          var ov = data.replace('>', '').substr(startOv).split(/,|\|/, 3);
          //printLog("Overrides: " + ov[0] + ',' + ov[1] + ',' + ov[2],  msgcolor, "USB");
          if (Array.isArray(ov)) {
              $('#oF').html(ov[0].trim() + '<span class="drounitlabel"> %</span>');
              //$('#oR').html(ov[1].trim() + '%');
              $('#oS').html(ov[2].trim() + '<span class="drounitlabel"> %</span>');
          }
      }

      // Extract realtime Feedrate (for Grbl > v1.1 only!)
      var startFS = data.search(/FS:/i) + 3;
      if (startFS > 3) {
          var fs = data.replace('>', '').substr(startFS).split(/,|\|/, 2);
          if (Array.isArray(fs)) {
              //$('#mF').html(fs[0].trim());
              //$('#mS').html(fs[1].trim());
          }
      }
  }
