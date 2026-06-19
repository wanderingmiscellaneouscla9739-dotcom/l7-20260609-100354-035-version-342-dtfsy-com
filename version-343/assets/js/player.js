(function () {
  var video = document.getElementById("movie-video");
  var player = document.getElementById("movie-player");
  var trigger = document.getElementById("play-trigger");

  if (!video || !player || !trigger) {
    return;
  }

  var stream = video.getAttribute("data-stream");
  var loaded = false;

  function loadStream() {
    if (loaded || !stream) {
      return;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = stream;
    } else if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(stream);
      hls.attachMedia(video);
    } else {
      video.src = stream;
    }

    video.setAttribute("controls", "controls");
    loaded = true;
  }

  function startPlayback() {
    loadStream();
    trigger.classList.add("is-hidden");

    var promise = video.play();

    if (promise && typeof promise.catch === "function") {
      promise.catch(function () {
        trigger.classList.remove("is-hidden");
      });
    }
  }

  trigger.addEventListener("click", function (event) {
    event.preventDefault();
    startPlayback();
  });

  player.addEventListener("click", function (event) {
    if (event.target === video) {
      return;
    }

    startPlayback();
  });

  video.addEventListener("play", function () {
    trigger.classList.add("is-hidden");
  });
})();
