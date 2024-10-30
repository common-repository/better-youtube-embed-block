/**
 * Handle Youtube video
 * Adapted from https://github.com/paulirish/lite-youtube-embed
 */
class YoutubeVideoHandler {
  constructor(element, forceIframe) {
    // Bail if there is no valid element
    if (!element || !element?.dataset?.videoId) {
      return;
    }

    this.element = element;
    this.videoId = this.element.dataset.videoId;
    this.needsYTApi =
      /Mobi/i.test(window.navigator.userAgent) ||
      /Apple/i.test(navigator.vendor);
    this.forceIframe = forceIframe && /iPhone/.test(window.navigator.userAgent);

    // Kick start
    this.init();
  }

  /**
   * Kick start
   */
  init() {
    /**
     * Force rendering iframe on unsupported browsers
     */
    if (this.forceIframe) {
      const observer = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (!entry.target.classList.contains("is-activated")) {
                // Create the iframe
                this.createIframe(this.getParams(entry.target));

                // Mark the video is activated
                entry.target.classList.add("is-activated");

                // Stop observing the element since the video is now loaded
                observer.unobserve(entry.target);
              }
            }
          });
        },
        {
          rootMargin: "0px",
        }
      );

      observer.observe(this.element);
    }

    /**
     * Click the block
     */
    this.element.addEventListener("click", () => {
      if (this.element.classList.contains("is-activated")) {
        return;
      }

      this.element.classList.add("is-activated");

      // Get params
      const params = this.getParams(this.element);
      if (this.needsYTApi) {
        this.playVideo(Object.fromEntries(params.entries()));
      } else {
        const iframeElement = this.createIframe(params);
        iframeElement.focus();
      }
    });
  }

  getParams(element) {
    const params = new URLSearchParams(
      element?.dataset?.params ? JSON.parse(element.dataset.params) : {}
    );
    params.append("autoplay", "1");
    params.append("playsinline", "1");

    return params;
  }

  async playVideo(playerVars) {
    this.loadYTAPI();

    await this.ytApiPromise;

    const videoPlaceholder = document.createElement("div");
    this.element.append(videoPlaceholder);
    const videoId = this.videoId;

    new YT.Player(videoPlaceholder, {
      width: "100%",
      videoId,
      playerVars,
      events: {
        onReady: (event) => event.target.playVideo(),
      },
    });
  }

  loadYTAPI() {
    if (window?.YT?.Player) {
      return;
    }

    this.ytApiPromise = new Promise((res, rej) => {
      var el = document.createElement("script");
      el.src = "https://www.youtube.com/iframe_api";
      el.async = true;
      el.onload = () => {
        YT.ready(res);
      };
      el.onerror = rej;
      this.element.append(el);
    });
  }

  createIframe(params) {
    const iframeElement = document.createElement("iframe");
    iframeElement.width = 560;
    iframeElement.height = 315;
    iframeElement.title = this.element?.dataset?.title ?? "Play";
    iframeElement.allow =
      "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
    iframeElement.allowFullscreen = true;
    iframeElement.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(
      this.videoId
    )}?${params.toString()}`;

    this.element.append(iframeElement);

    return iframeElement;
  }
}

/**
 * Kick start the script on frontend.
 */
window.addEventListener("DOMContentLoaded", function () {
  const ytPlayers = document.querySelectorAll(
    ".wp-block-boldblocks-youtube-block .yb-player"
  );

  if (ytPlayers && ytPlayers.length) {
    ytPlayers.forEach(
      (element) =>
        new YoutubeVideoHandler(
          element,
          element.parentNode.classList.contains("force-iframe")
        )
    );
  }
});
