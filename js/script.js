

$(document).ready(function(){

    $('.spinner-wrap').click(function(){
        var $this = $(this),
            musicContainer = document.getElementById('audio-box');
            audio = musicContainer.lastChild
            bpm = audio.bpm
            pulse = (60/bpm)*1000;

        if (audio.paused === false){
            audio.pause();
            audio.currentTime = 0;
            $this.removeClass('playing');
            clearInterval(intervals);
        }
        else {
            audio.play();
            $this.addClass('playing');
            pulsing();
            intervals = setInterval(function(){pulsing()},pulse)
        }

        function pulsing(){
            $this.addClass('pulse');
            setTimeout(function(){
                $this.removeClass('pulse')
            }, pulse-100);
        }
    });
});
//Analysed track

var temperedGlass = new Audio();
temperedGlass.src = 'songs/temperedGlass.mp3';
temperedGlass.bpm = 132.76;
temperedGlass.controls = false;
temperedGlass.loop = true;
temperedGlass.autoplay = false;

var track = temperedGlass;

//Variables
var canvas, ctx, source, analyser, fbc_array, bars, bar_width, bar_height;

window.addEventListener('load', initMp3Player, false);
function initMp3Player() {
    document.getElementById('audio-box').appendChild(track);
    context = new AudioContext();
    analyser = context.createAnalyser();
    canvas = document.getElementById('analyser-render');
    ctx = canvas.getContext('2d');
    //Re-route audio to processing graph
    source = context.createMediaElementSource(document.getElementById('audio-box').lastChild);
    source.connect(analyser);
    analyser.connect(context.destination);
    frameLooper();
}
//frameLooper animates style of graphics to the audio frequency
function frameLooper(){
    window.requestAnimationFrame(frameLooper); //Can be used instead of setInterval or setTimeout
    fbc_array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(fbc_array);
    ctx.clearRect(0, 0, canvas.width, canvas.height); //Clear the canvas
    ctx.fillStyle = '#f6f6c4'; //Color of the background-position
    bars = 100;
    for (var i = 0; i < bars; i++){
        bar_x = i * 3;
        bar_width = 2;
        bar_height = -(fbc_array[i] / 2);
        //Parameter below: fillRect( x, y, width, height)
        ctx.fillRect(bar_x, canvas.height, bar_width, bar_height);
    }
}
