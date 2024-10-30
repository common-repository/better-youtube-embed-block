/**
 * WordPress dependencies
 */
import { useBlockProps, RichText } from "@wordpress/block-editor";

/**
 * Internal dependencies
 */
import BlockWrapper from "./components/block-wrapper";
import Player from "./components/player";
import { getVideoId, getStyle } from "./utils";

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */
export default function save(props) {
  const {
    attributes: {
      url,
      caption,
      aspectRatio,
      isMaxResThumbnail,
      customThumbnail,
      settings: { multipleMode, videoIds, playlistId, loop = 0, rel = 1 } = {},
    },
  } = props;

  const videoId = getVideoId(url);

  const params = {};

  if (multipleMode) {
    if (multipleMode === "multiple" && videoIds) {
      params.playlist = `${videoId},${videoIds}`;
    } else if (multipleMode === "playlist" && playlistId) {
      params.list = playlistId;
    }
  }

  if (loop === 1) {
    params.loop = 1;
    if (!params?.playlist && !params?.list) {
      params.playlist = videoId;
    }
  }

  if (rel === 0) {
    params.rel = 0;
  }

  return (
    <BlockWrapper {...useBlockProps.save({ style: getStyle({ aspectRatio }) })}>
      {videoId && (
        <>
          <Player
            id={videoId}
            playLabel="Play"
            isMaxResThumbnail={isMaxResThumbnail}
            backgroundImage={customThumbnail}
            params={params}
          />
          {!RichText.isEmpty(caption) && (
            <RichText.Content
              className="yb-caption"
              tagName="figcaption"
              value={caption}
            />
          )}
        </>
      )}
    </BlockWrapper>
  );
}
