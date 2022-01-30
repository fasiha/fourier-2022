const audioCtx: AudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

const analyser = audioCtx.createAnalyser();
analyser.minDecibels = -90;
analyser.maxDecibels = -10;
analyser.smoothingTimeConstant = 0;
analyser.fftSize = 1 << 15;

navigator.mediaDevices.getUserMedia({audio : {channelCount : {ideal : 1}}})
    .then(function(stream) {
      var source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
    })
    .catch(function(err) { console.log('The following getUserMedia error occured: ' + err); });

const t = new Float32Array(analyser.fftSize);
const f = new Float32Array(analyser.fftSize);

function record() {
  analyser.getFloatTimeDomainData(t);
  analyser.getFloatFrequencyData(f);

  console.dir({t : [ Math.min(...t), Math.max(...t) ], f : [ Math.min(...f), Math.max(...f) ]});
}

function play() {
  let newBuf = audioCtx.createBuffer(1, analyser.fftSize, audioCtx.sampleRate);
  var nowBuffering = newBuf.getChannelData(0);
  nowBuffering.set(t)

  let newSource = audioCtx.createBufferSource();
  newSource.buffer = newBuf;
  newSource.connect(audioCtx.destination);
  newSource.start(0);
}
