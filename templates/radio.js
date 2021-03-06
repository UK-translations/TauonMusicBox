
var connect_fault = 5;
var index = -1;
var status = 0;
var sound = document.createElement('audio');
sound.id       = 'audio-player';
sound.controls = 'controls';
sound.type     = 'audio/ogg';
sound.preload  = 'none';

function setArt(){

  $.getJSON("/radio/getpic",
      function(data) {
          index = data.index
          if (data.image != 'None'){
            $("#picture").attr('src', 'data:image/jpeg;base64,' + data.image)
          }
          else {
            $("#picture").attr('src', '#')
          }

          $('#title-text').text(data.artist + " - " + data.title)
          $('#lyrics').html(data.lyrics)

      });
}

function update() {
            connect_fault = connect_fault - 1
            $.getJSON("/radio/update_radio",
                function(data) {
                    connect_fault = connect_fault + 1
                    $("#seekfront").width(Math.round(data.position * 700))

                    if (data.index != index){
                      setArt();
                    }

                    if (status == 1 && data.index == -1) {
                        // The stream has stopped
                        status = 2;
                        sound.src = "";
                        sound.load();
                    }

                    if (status == 2 && data.index > -1){
                        // Stream starts again
                        status = 1;
                        sound.src = "http://" + window.location.hostname + ":" + data.port;

                    }

                    if (status == 0 && data.index > -1) {
                        // Show player for the first time when stream starts
                        status = 1;
                        sound.src = "http://" + window.location.hostname + ":" + data.port;
                        document.getElementById('player').appendChild(sound);
                    }
                });
        }

function tick(){

  update();
  if (connect_fault > 0) { setTimeout(tick, 5000); }
  else { alert("Connection lost, reload page to continue.")}
}


tick()
