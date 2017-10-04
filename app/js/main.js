var editor = ace.edit("editor");

$(document).ready(function() {

    editor.session.setMode("ace/mode/cncpro");
    editor.setTheme('ace/theme/github')
    editor.setOption('printMarginColumn', 0)
    editor.session.setValue(gcodesample);  // from samplefile.js
    setTimeout(function(){ $('#gcodetobesent').html(editor.session.getLength()); }, 200);
    setTimeout(function(){ doPreview(); }, 200);
    editor.container.addEventListener("contextmenu", function(e) {
        var template = `<a class="dropdown-item" href="#"><i class="fa fa-fw fa-list-ol" aria-hidden="true"></i>&nbsp;Queue from here</a>
        <a class="dropdown-item" href="#"><i class="fa fa-fw fa-play" aria-hidden="true"></i>&nbsp;Execute line: <code>` + editor.session.getLine(editor.getSelectionRange().start.row) + `</code></a>
        <a class="dropdown-item" href="#" onclick="sim(`+ (editor.getSelectionRange().start.row + 1)+`)"><i class="fa fa-fw fa-fighter-jet" aria-hidden="true"></i>&nbsp;Simulate from here</a>`
        $("#dropdowncontent").html(template)
        // console.log(e);
        setposition(e);
        e.preventDefault();
        $('#linenumber').html((editor.getSelectionRange().start.row + 1));
        // alert('success! - rightclicked line ' + (editor.getSelectionRange().start.row + 1));
    }, false);

    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })

    //File -> Open
    var fileOpen = document.getElementById('file');
    fileOpen.addEventListener('change', readFile, false);

    // Fix for opening same file from http://stackoverflow.com/questions/32916687/uploading-same-file-into-text-box-after-clearing-it-is-not-working-in-chrome?lq=1
    $('#file').bind('click', function() {
      $('#file').val(null);
    });


    init3D();
    initSocket();

});

var successcolor, msgcolor, errorcolor
function printLog() {}

function readFile(evt) {
  clearViewer()
  // console.log(evt);
    var f = evt.target.files[0];
    if (f) {
        var r = new FileReader();
        if (f.name.match(/.gcode$/i)) {
            r.readAsText(evt.target.files[0]);
            r.onload = function(event) {
                // document.getElementById('gcodepreview').value = this.result;
                editor.session.setValue(this.result);
                doPreview();
            };
        }
    }
};

function saveFile() {
    var textToWrite = editor.getValue();
    var blob = new Blob([textToWrite], {type: "text/plain"});
    invokeSaveAsDialog(blob, 'file.gcode');
};

/**
 * @param {Blob} file - File or Blob object. This parameter is required.
 * @param {string} fileName - Optional file name e.g. "image.png"
 */
function invokeSaveAsDialog(file, fileName) {
    if (!file) {
        throw 'Blob object is required.';
    }

    if (!file.type) {
        file.type = 'text/plain';
    }

    var fileExtension = file.type.split('/')[1];

    if (fileName && fileName.indexOf('.') !== -1) {
        var splitted = fileName.split('.');
        fileName = splitted[0];
        fileExtension = splitted[1];
    }

    var fileFullName = (fileName || (Math.round(Math.random() * 9999999999) + 888888888)) + '.' + fileExtension;

    if (typeof navigator.msSaveOrOpenBlob !== 'undefined') {
        return navigator.msSaveOrOpenBlob(file, fileFullName);
    } else if (typeof navigator.msSaveBlob !== 'undefined') {
        return navigator.msSaveBlob(file, fileFullName);
    }

    var hyperlink = document.createElement('a');
    hyperlink.href = URL.createObjectURL(file);
    hyperlink.target = '_blank';
    hyperlink.download = fileFullName;

    if (!!navigator.mozGetUserMedia) {
        hyperlink.onclick = function() {
            (document.body || document.documentElement).removeChild(hyperlink);
        };
        (document.body || document.documentElement).appendChild(hyperlink);
    }

    var evt = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
    });

    hyperlink.dispatchEvent(evt);

    if (!navigator.mozGetUserMedia) {
        URL.revokeObjectURL(hyperlink.href);
    }
}


function setposition(e) {
    var bodyOffsets = document.body.getBoundingClientRect();
    tempX = e.pageX //- bodyOffsets.left;
    tempY = e.pageY;
    // console.log(tempX);
    $("#editorContextMenu").show().css({ display: "block", left: e.pageX, top: e.pageY });
}

$('#menuitems').on('click', function(e){
	setposition(e);
});
