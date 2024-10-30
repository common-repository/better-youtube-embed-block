/**
 * WordPress dependencies
 */

/**
 * https://stackoverflow.com/a/71010058/1038868
 **/
export function getVideoId(url) {
  // Video Id
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }

  let regex =
    /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/gm;

  const found = regex.exec(url);

  return found ? found[3] ?? "" : "";
}

export function getStyle({ aspectRatio }) {
  let style = {};
  const validPattern = /^((\.\d+)|(\d+(\.\d+)?)|(\d+\/([1-9]\d*)))$/;
  if (aspectRatio && validPattern.test(aspectRatio)) {
    const parts = aspectRatio.split("/");
    const aspectRatioValue =
      parts.length > 1 ? parseFloat(parts[0] / parts[1]) : parts[0];

    if (aspectRatioValue && !isNaN(aspectRatioValue)) {
      style = {
        "--byeb--aspect-ratio": `${parseFloat(100 / aspectRatioValue).toFixed(
          2
        )}%`,
      };
    }
  }

  return style;
}
