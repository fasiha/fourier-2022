"use strict";
var _a, _b, _c;
var Plotly;
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
analyser.minDecibels = -90;
analyser.maxDecibels = -10;
analyser.smoothingTimeConstant = 0;
analyser.fftSize = 1 << 15;
navigator.mediaDevices.getUserMedia({ audio: { channelCount: { ideal: 1 } } })
    .then(function (stream) {
    var source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);
})
    .catch(function (err) { console.log('The following getUserMedia error occured: ' + err); });
const t = new Float32Array(analyser.fftSize);
const f = new Float32Array(analyser.frequencyBinCount); // half the length as t
const deltaFreq = 0.5 * audioCtx.sampleRate / analyser.frequencyBinCount;
const deltaTime = 1 / audioCtx.sampleRate;
const faxis = Array.from(Array(analyser.frequencyBinCount), (_, i) => i * deltaFreq);
const taxis = Array.from(Array(analyser.fftSize), (_, i) => i * deltaTime);
function record() {
    analyser.getFloatTimeDomainData(t);
    analyser.getFloatFrequencyData(f);
    console.dir({ t: [Math.min(...t), Math.max(...t)], f: [Math.min(...f), Math.max(...f)] });
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
    Plotly.newPlot('freq', [{ y: Array.from(f), x: faxis }]);
    Plotly.newPlot('time', [{ y: Array.from(t), x: taxis }]);
}
{
    (_a = document.querySelector('#record-button')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => record());
    (_b = document.querySelector('#play-button')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => play());
    (_c = document.querySelector('#viz-button')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => viz());
}
