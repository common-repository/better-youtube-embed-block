/**
 * Internal dependencies
 */
const Player = ({
  id: videoId = "",
  isMaxResThumbnail = false,
  playLabel,
  backgroundImage,
  params = {},
}) => {
  if (!backgroundImage) {
    backgroundImage = `https://img.youtube.com/vi/${videoId}/${
      isMaxResThumbnail ? "maxresdefault" : "hqdefault"
    }.jpg`;
  }
  return (
    <div
      id={`yb-video-${videoId}`}
      className="yb-player"
      data-video-id={videoId}
      data-title={playLabel}
      style={{ backgroundImage: `url(${backgroundImage})` }}
      {...(Object.keys(params).length
        ? { "data-params": JSON.stringify(params) }
        : {})}
    >
      <button type="button" className="yb-btn-play">
        <span className="visually-hidden">{playLabel}</span>
      </button>
    </div>
  );
};
export default Player;
