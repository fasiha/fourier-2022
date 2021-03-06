"use strict";
var _a, _b;
var Plotly;
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
analyser.minDecibels = -90;
analyser.maxDecibels = -10;
analyser.smoothingTimeConstant = .25;
analyser.fftSize = 1 << 15;
const t = new Float32Array(analyser.fftSize);
const f = new Float32Array(analyser.frequencyBinCount); // half the length as t
const deltaFreq = 0.5 * audioCtx.sampleRate / analyser.frequencyBinCount;
const deltaTime = 1 / audioCtx.sampleRate;
const faxis = Array.from(Array(analyser.frequencyBinCount), (_, i) => i * deltaFreq);
const taxis = Array.from(Array(analyser.fftSize), (_, i) => i * deltaTime);
let asked = false;
function ask() {
    navigator.mediaDevices.getUserMedia({ audio: { channelCount: { ideal: 1 } } })
        .then(function (stream) {
        var source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
    })
        .catch(function (err) { console.log('The following getUserMedia error occured: ' + err); });
}
function record() {
    if (!asked) {
        ask();
        asked = true;
    }
    analyser.getFloatTimeDomainData(t);
    analyser.getFloatFrequencyData(f);
    viz();
}
function play() {
    let newBuf = audioCtx.createBuffer(1, analyser.fftSize, audioCtx.sampleRate);
    var nowBuffering = newBuf.getChannelData(0);
    nowBuffering.set(t);
    let newSource = audioCtx.createBufferSource();
    newSource.buffer = newBuf;
    newSource.connect(audioCtx.destination);
    newSource.start(0);
}
function viz() {
    Plotly.newPlot('freq', [{ y: Array.from(f), x: faxis }], { xaxis: { type: 'log', autorange: true } });
    Plotly.newPlot('time', [{ y: Array.from(t), x: taxis }]);
}
{
    (_a = document.querySelector('#record-button')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => record());
    (_b = document.querySelector('#play-button')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => play());
}
