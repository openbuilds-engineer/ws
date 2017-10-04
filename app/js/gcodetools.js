// Gcode Rotate from http://ideegeniali.altervista.org/progetti/?p=gcoderotator
	function rotategcode(angle) {
	 clearViewer()
	 var gcode=editor.getValue().split('\n');
	  var a,b,x,y,xstart,xend,ystart,yend;
	  var xy = new Array(2);
	  var errori = '';
	  var s = '';
	  //f.AreaOutput.value='';
	  for (var i=0; gcode.length>i; i++) {
	    a = gcode[i];
	    b = a;
	    xstart = (a + ' ').toUpperCase().indexOf('X');
	    if ((a + ' ').toUpperCase().lastIndexOf('X') != xstart) { xstart = -1 };
	    xend   = (a + ' ').toUpperCase().indexOf(' ',xstart);
	    ystart = (a + ' ').toUpperCase().indexOf('Y');
	    if ((a + ' ').toUpperCase().lastIndexOf('Y') != ystart) { ystart = -1 };
	    yend   = (a + ' ').toUpperCase().indexOf(' ',ystart);

	    if ((xstart == -1) && (ystart == -1)) {
	      ;
	    } else if ((xstart == -1) && (ystart != -1)) {
	      errori += (i+1)+'  ';
	    } else if ((xstart != -1) && (ystart == -1)) {
	      errori += (i+1)+'  ';
	    } else {
	      x  = parseFloat(a.substring(xstart+1,xend));
	      y  = parseFloat(a.substring(ystart+1,yend));
	      xy = Convert(x,y,angle);
	      x  = xy[0];
	      y  = xy[1];
	      x  = Math.round(x*1000)/1000;
	      y  = Math.round(y*1000)/1000;
	      if (ystart > xstart) {
					b=a.substring(0,xstart+1)+x+a.substring(xend,ystart+1)+y+a.substring(yend,a.length);
	      } else {
					b=a.substring(0,ystart+1)+y+a.substring(yend,xstart+1)+x+a.substring(xend,a.length);
	      }
	    }
	    s += b + '\n';
	  }
	  if (errori != '')
		{
			console.log('WARNING: Rotation had errors. Please Check...');
		} else {
			console.log('Rotation Succeeded. Please Check before cutting...');
		}
		// Result = s
		// console.log(s)
		editor.session.setValue(s);
	}

	// *** Rectangular Polar Coordinates Conversion ***
	function module(x,y) {
	  return (Math.sqrt(Math.pow(x,2)+Math.pow(y,2)));
	}

	function arg(x,y) {
	  return (Math.atan2(y,x));
	}

	function coorx(m,a) {
	  return (m * Math.cos(a));
	}

	function coory(m,a) {
	  return (m * Math.sin(a));
	}

	function Convert(OldX,OldY,angle) {
	  var x=OldX;
	  var y=OldY;
	  x-=parseFloat(0);
	  y-=parseFloat(0);

	  var mod_=module(x,y);

	 // Rotation Value
	  var arg_=arg(x,y);
	      var rotvalue=angle;
	      arg_ = arg_ + (rotvalue*Math.PI/180);

	  x=coorx(mod_,arg_);
	  y=coory(mod_,arg_);

	  var out = new Array(2);
	  out[0] = x;
	  out[1] = y;
	  return out;
	}

	// Gcode Scaling and Translate: from http://eng-serve.com/cnc/gcode_scale.html -->

	function scalegcode(x, y, z)
	{
		var theInput=editor.getValue();
		//theInput=theInput.replace(/[X|x|Y|y|Z|z|I|i|J|j].[0-9|.]+/g,function(m){return replacechar(m)});
		scaleX=x / 100;
		scaleY=y / 100;
		scaleZ=z / 100;

		theInput=theInput.replace(/[X|x]\s*-?[0-9|.]+/g,function(m){return scale("X",scaleX,m)});
		theInput=theInput.replace(/[Y|y]\s*-?[0-9|.]+/g,function(m){return scale("Y",scaleY,m)});
		theInput=theInput.replace(/[Z|Z]\s*-?[0-9|.]+/g,function(m){return scale("Z",scaleZ,m)});
		theInput=theInput.replace(/[I|i]\s*-?[0-9|.]+/g,function(m){return scale("I",scaleX,m)});
		theInput=theInput.replace(/[J|j]\s*-?[0-9|.]+/g,function(m){return scale("J",scaleY,m)});


		// I and J are always relative so no need to translate right?
		//theInput=theInput.replace(/[I|i].+[0-9|.]+/g,function(m){return translate("I",transX,m)});
		//theInput=theInput.replace(/[J|j].+[0-9|.]+/g,function(m){return translate("J",transY,m)});
		//textarea.value=outputstring;

		if (theInput == '')
			{
				console.log('WARNING: Scaling had errors. Please Check...');
			} else {
				console.log('Scaling Succeeded. Please Check before cutting...');
				editor.session.setValue(theInput);
		}

	}

	function movegcode(x, y, z)
	{
		theInput=editor.getValue();
		// theOutput=document.getElementById("gcodepreview");
		//theInput=theInput.replace(/[X|x|Y|y|Z|z|I|i|J|j].[0-9|.]+/g,function(m){return replacechar(m)});

		transX=x;
		transY=y;
		transZ=z;

		theInput=theInput.replace(/[X|x]\s*-?[0-9|.]+/g,function(m){return translate("X",transX,m)});
		theInput=theInput.replace(/[Y|y]\s*-?[0-9|.]+/g,function(m){return translate("Y",transY,m)});
		theInput=theInput.replace(/[Z|z]\s*-?[0-9|.]+/g,function(m){return translate("Z",transZ,m)});

		// I and J are always relative so no need to translate right?
		//theInput=theInput.replace(/[I|i].+[0-9|.]+/g,function(m){return translate("I",transX,m)});
		//theInput=theInput.replace(/[J|j].+[0-9|.]+/g,function(m){return translate("J",transY,m)});
		//textarea.value=outputstring;
		if (theInput == '')
			{
				console.log('WARNING: Translation had errors. Please Check...');
			} else {
				console.log('Translation Succeeded. Please Check before cutting...');
				editor.session.setValue(theInput);
		}

	}

	function translateaxis(value,match)
	{
		newValue=fd((match*1.0)+(value*1.0));

		return newValue;
	}
	function scaleaxis(value,match)
	{
		newValue=fd((match*1.0)*(value*1.0));

		return newValue;
	}
	function replacechar(match)
	{
		newValue=match;
		newValue=match.replace(/[0-9|.]+/,function(m){return replacenumber(m)});
		return newValue; //"Goo["+match+"]";
	}
	function translate(axis,value,match)
	{
		newValue=match;
		newValue=match.replace(/-?[0-9|.]+/,function(m){return translateaxis(value,m)});
		return newValue; //"Goo["+match+"]";
	}
	function scale(axis,value,match)
	{
		newValue=match;
		newValue=match.replace(/[0-9|.]+/,function(m){return scaleaxis(value,m)});
		return newValue; //"Goo["+match+"]";
	}

	function fd(number)
	{
		return number_format(number,6,".","");
	}
	function number_format( number, decimals, dec_point, thousands_sep )
	{
	      // http://kevin.vanzonneveld.net
	      // + original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
	      // + improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	      // + bugfix by: Michael White (http://crestidg.com)
	      // + bugfix by: Benjamin Lupton
	      // + bugfix by: Allan Jensen (http://www.winternet.no)
	      // + revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
	      // * example 1: number_format(1234.5678, 2, '.', '');
	      // * returns 1: 1234.57
	      var n = number, c = isNaN(decimals = Math.abs(decimals)) ? 2 : decimals;
	      var d = dec_point == undefined ? "," : dec_point;
	      var t = thousands_sep == undefined ? "." : thousands_sep, s = n < 0 ? "-" : "";
	      var i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
	      return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
	}
