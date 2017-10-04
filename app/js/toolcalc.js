// Typical Chip Load Values for Various Size Cutters
//
// Tool Diameter	Hard Woods	  Softwood / Plywood	 MDF / Particle Board	Soft Plastics	 Hard Plastics	Aluminium
// 3mm	          0.08 - 0.13	  0.1 - 0.15	         0.1 - 0.18	          0.1 - 0.15	   0.15 - 0.2	    0.05 - 0.1
// 6mm	          0.23 - 0.28	  0.28 - 0.33	         0.33 - 0.41	        0.2 - 0.3	     0.25 - 0.3	    0.08 - 0.15
// 10mm	          0.38 - 0.46	  0.43 - 0.51	         0.51 - 0.58	        0.2 - 0.3	     0.25 - 0.3	    0.1 - 0.2
// 12mm and over	0.48 - 0.53	  0.53 - 0.58	         0.64 0.69	          0.25 - 0.36	   0.3 - 0.41	    0.2 - 0.25

// Feed = N x cpt x RPM
//
// N - number of cutting edges (flutes)
// cpt - chip load (chip per tooth) is the amount of material, which should be removed by each tooth of the cutter as it rotates and advances into the work. (mm per tooth)
// RPM - the speed at which the cutter revolves in the spindle. (Revolutions per minute)

//                   bnk hw    sw    mdf   sp   hp    al
var materials = ["blank", "Hardwood", "Softwood", "MDF", "Soft Plastics", "Hard Plastics", "Aluminum"]

var mincpt3mmtool =  [0, 0.08, 0.1,  0.1,  0.1, 0.15, 0.05]
var mincpt6mmtool =  [0, 0.23, 0.28, 0.33, 0.2, 0.25, 0.08]
var mincpt10mmtool = [0, 0.38, 0.43, 0.51, 0.2, 0.25, 0.1 ]
var mincpt12mmtool = [0, 0.48, 0.53, 0.64, 0.25, 0.3, 0.2 ]

var maxcpt3mmtool =  [0, 0.13, 0.15, 0.18, 0.15, 0.2, 0.1]
var maxcpt6mmtool =  [0, 0.28, 0.33, 0.41, 0.3, 0.3,  0.15]
var maxcpt10mmtool = [0, 0.46, 0.51, 0.58, 0.3, 0.3,  0.2]
var maxcpt12mmtool = [0, 0.53, 0.58, 0.69, 0.36, 0.41, 0.25]

function calcfeed() {
  var tool = $('#cnc_diameter').val()
  var i = $('#cnc_material').val()
  var flutes = $('#id_flutes').val()
  var spindlerpm = $('#id_speed').val()

  if ( !tool || !i || !flutes || !spindlerpm) {
    $('#feedrate').html("<div class='alert alert-danger'>Please complete all inputs!</div>")
  } else {
    var toolname = "up to 3.175";
    if (tool == 1) {
      var tool = "";
      var mincpt = mincpt3mmtool;
      var maxcpt = maxcpt3mmtool;
    }
    if (tool == 2) {
      var toolname = "up to 6.35";
      var mincpt = mincpt6mmtool;
      var maxcpt = maxcpt6mmtool;
    }
    if (tool == 3) {
      var toolname = "up to 9.525";
      var mincpt = mincpt10mmtool;
      var maxcpt = maxcpt10mmtool;
    }
    if (tool == 4) {
      var toolname = "up to 12.7";
      var mincpt = mincpt12mmtool;
      var maxcpt = maxcpt12mmtool;
    }

    // Feed = N x cpt x RPM
    var minfeed = flutes * mincpt[i] * spindlerpm
    var maxfeed = flutes * maxcpt[i] * spindlerpm

    console.log('for endmills ' + toolname +' and Material: ' + materials[i] +' we recommend CPT between ' + mincpt[i] + ' and ' + maxcpt[i] + '. That equates to a feedrate between ' + minfeed + ' and ' + maxfeed + 'mm/min'  )

    $('#feedrate').html("<div class='alert alert-success'>Try a feedrate between " + minfeed + " and " + maxfeed + "mm/min</div>")
  }



}
