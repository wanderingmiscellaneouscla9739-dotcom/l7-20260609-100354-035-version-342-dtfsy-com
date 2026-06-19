import { H as Hls } from './hls-vendor.js';

var players = Array.prototype.slice.call(document.querySelectorAll('.movie-player'));
var hlsMap = new WeakMap();

function activatePlayer(player) {
  var video = player.querySelector('video');
  var stream = player.getAttribute('data-stream');

  if (!video || !stream) {
    return;
  }

  if (!hlsMap.has(video)) {
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
      hlsMap.set(video, true);
    } else if (Hls && Hls.isSupported()) {
      var hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(stream);
      hls.attachMedia(video);
      hlsMap.set(video, hls);
    } else {
      video.src = stream;
      hlsMap.set(video, true);
    }
  }

  player.classList.add('is-playing');
  var playResult = video.play();

  if (playResult && typeof playResult.catch === 'function') {
    playResult.catch(function () {
      video.setAttribute('controls', 'controls');
    });
  }
}

players.forEach(function (player) {
  var button = player.querySelector('.play-layer');
  var video = player.querySelector('video');

  if (button) {
    button.addEventListener('click', function () {
      activatePlayer(player);
    });
  }

  if (video) {
    video.addEventListener('click', function () {
      if (!player.classList.contains('is-playing')) {
        activatePlayer(player);
      }
    });
  }
});
