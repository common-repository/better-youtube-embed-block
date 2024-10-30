/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import {
  InspectorControls,
  useBlockProps,
  RichText,
  useBlockEditingMode,
  MediaUpload,
  MediaUploadCheck,
} from "@wordpress/block-editor";
import { useState, useRef } from "@wordpress/element";
import {
  PanelBody,
  Spinner,
  TextControl,
  ToggleControl,
  BaseControl,
  Button,
  __experimentalHStack as HStack,
  __experimentalToggleGroupControl as ToggleGroupControl,
  __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from "@wordpress/components";

/**
 * Internal dependencies
 */
import { ReactComponent as BlockIcon } from "./assets/block-icon.svg";
import Placeholder from "./components/placeholder";
import BlockControls from "./components/block-controls";
import Player from "./components/player";
import BlockWrapper from "./components/block-wrapper";
import { getVideoId, getStyle } from "./utils";

import "./editor.scss";

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit(props) {
  const {
    attributes: {
      url = "",
      caption,
      isMaxResThumbnail,
      aspectRatio,
      customThumbnail,
      settings = {},
    },
    isSelected,
    setAttributes,
    onFocus,
    clientId,
  } = props;

  const {
    multipleMode,
    videoIds = "",
    playlistId = "",
    loop = 0,
    rel,
  } = settings;
  const [editingURL, setEditingURL] = useState(url);
  const videoId = getVideoId(url);
  const edittingVideoId = getVideoId(editingURL);
  const [isEditingURL, setIsEditingURL] = useState(false);
  const isShowingPlaceholder = !videoId || isEditingURL;
  const [isFetchingCaption, setIsFetchingCaption] = useState(false);
  const customImageButtonRef = useRef();

  const submitEmbed = (editingURL) => {
    if (!caption && edittingVideoId && videoId !== edittingVideoId) {
      // Update caption
      setIsFetchingCaption(true);
      fetchCaption(editingURL);
    }

    setAttributes({ url: editingURL });
  };

  const fetchCaption = (newURL) => {
    if (newURL) {
      if (newURL.length === 11) {
        newURL = `https://youtu.be/${newURL}`;
      }

      fetch(`https://www.youtube.com/oembed?format=json&url=${newURL}`)
        .then((res) => (res.ok ? res.json() : false))
        .then((data) => {
          if (data && data?.title) {
            setAttributes({ caption: data.title });
          }
        })
        .finally(() => setIsFetchingCaption(false));
    }
  };

  const blockProps = useBlockProps({ style: getStyle({ aspectRatio }) });

  const blockEditingMode = useBlockEditingMode
    ? useBlockEditingMode()
    : "default";

  if (isShowingPlaceholder) {
    return (
      <BlockWrapper {...blockProps}>
        <Placeholder
          icon={BlockIcon}
          label={__(
            "Youtube URL or Youtube Video ID",
            "better-youtube-embed-block"
          )}
          onFocus={onFocus}
          value={editingURL}
          isInvalidURL={
            !edittingVideoId && editingURL && editingURL?.length > 5
          }
          onSubmit={(event) => {
            if (event) {
              event.preventDefault();
            }

            setIsEditingURL(false);
            submitEmbed(editingURL);
          }}
          onChange={(event) => {
            setEditingURL(event.target.value);
          }}
        />
      </BlockWrapper>
    );
  }

  const settingsLabel = __("Media settings", "better-youtube-embed-block");
  const settingsControl = (
    <>
      <MediaUploadCheck>
        <BaseControl>
          <BaseControl.VisualLabel>
            {__("Custom thumbnail", "better-youtube-embed-block")}
          </BaseControl.VisualLabel>
          <TextControl
            value={customThumbnail ?? ""}
            onChange={(customThumbnail) => setAttributes({ customThumbnail })}
            placeholder="https://example.com/bg.jpg"
            autoComplete="off"
            className="custom-video-thumbnail"
          />
          <MediaUpload
            title={__("Input custom thumbnail", "better-youtube-embed-block")}
            onSelect={(image) => setAttributes({ customThumbnail: image.url })}
            allowedTypes={["image"]}
            render={({ open }) => (
              <HStack spacing={2} justify="flex-start">
                <Button
                  variant="secondary"
                  onClick={open}
                  ref={customImageButtonRef}
                >
                  {!customThumbnail
                    ? __("Select image", "better-youtube-embed-block")
                    : __("Replace image", "better-youtube-embed-block")}
                </Button>
                {!!customThumbnail && (
                  <Button
                    onClick={() => {
                      setAttributes({ customThumbnail: undefined });
                      customImageButtonRef.current.focus();
                    }}
                    variant="secondary"
                  >
                    {__("Remove image", "better-youtube-embed-block")}
                  </Button>
                )}
              </HStack>
            )}
          />
        </BaseControl>
      </MediaUploadCheck>

      <ToggleControl
        label={__(
          "Load the high-resolution image",
          "better-youtube-embed-block"
        )}
        checked={isMaxResThumbnail ?? false}
        onChange={(isMaxResThumbnail) => setAttributes({ isMaxResThumbnail })}
        help={__(
          "Enable this setting only if the video has a high-resolution image.",
          "better-youtube-embed-block"
        )}
        disabled={!!customThumbnail}
      />

      <TextControl
        label={__("Aspect ratio", "better-youtube-embed-block")}
        list={`${clientId}-aspect-ratio`}
        value={aspectRatio}
        onChange={(aspectRatio) => setAttributes({ aspectRatio })}
        placeholder="16/9"
        autoComplete="off"
        help={__(
          "Set a custom aspect ratio for the video. Some common values are '16/9' for HD videos, '9/16' for short videos. The default value is '16/9'.",
          "better-youtube-embed-block"
        )}
      />
      <datalist id={`${clientId}-aspect-ratio`}>
        <option value="9/16" />
        <option value="1" />
        <option value="4/3" />
        <option value="2" />
        <option value="21/9" />
      </datalist>

      <ToggleGroupControl
        isBlock
        isDeselectable
        label={__("Multiple mode", "better-youtube-embed-block")}
        value={multipleMode}
        onChange={(multipleMode) =>
          setAttributes({ settings: { ...settings, multipleMode } })
        }
        className="byeb-multiple-mode"
      >
        <ToggleGroupControlOption
          aria-label={__("Multiple videos", "better-youtube-embed-block")}
          label={__("Multiple", "better-youtube-embed-block")}
          showTooltip
          value="multiple"
        />
        <ToggleGroupControlOption
          aria-label={__("The whole playlist", "better-youtube-embed-block")}
          label={__("Playlist", "better-youtube-embed-block")}
          showTooltip
          value="playlist"
        />
      </ToggleGroupControl>

      {multipleMode === "multiple" && (
        <TextControl
          label={__("Input video IDs", "better-youtube-embed-block")}
          value={videoIds}
          onChange={(videoIds) =>
            setAttributes({ settings: { ...settings, videoIds } })
          }
          help={__(
            "Input a comma-separated list of video IDs",
            "better-youtube-embed-block"
          )}
          autoComplete="off"
        />
      )}

      {multipleMode === "playlist" && (
        <TextControl
          label={__("Input a playlist ID", "better-youtube-embed-block")}
          value={playlistId}
          onChange={(playlistId) =>
            setAttributes({ settings: { ...settings, playlistId } })
          }
          help={__(
            "Make sure the initial video is from this playlist.",
            "better-youtube-embed-block"
          )}
          autoComplete="off"
        />
      )}

      <ToggleControl
        label={__("Loop continuously", "better-youtube-embed-block")}
        checked={loop === 1}
        onChange={(value) =>
          setAttributes({ settings: { ...settings, loop: value ? 1 : 0 } })
        }
        help={__(
          "Play all other videos or the entire playlist, if any, and then start again. If there is only one video, it will play repeatedly.",
          "better-youtube-embed-block"
        )}
      />

      <ToggleControl
        label={__(
          "Show related videos from the same channel",
          "better-youtube-embed-block"
        )}
        checked={rel === 0}
        onChange={(value) =>
          setAttributes({ settings: { ...settings, rel: value ? 0 : 1 } })
        }
      />
    </>
  );

  return (
    <>
      {isSelected && (
        <>
          <BlockControls
            showEditButton={videoId}
            switchBackToURLInput={() => setIsEditingURL(true)}
            showFetchCaption={!!getVideoId(url)}
            url={url}
            fetchCaption={fetchCaption}
            showSettings={blockEditingMode === "contentOnly"}
            settingsLabel={settingsLabel}
            settingsControl={settingsControl}
          />
          {videoId && (
            <InspectorControls group="settings">
              <PanelBody title={settingsLabel} initialOpen={true}>
                {settingsControl}
              </PanelBody>
            </InspectorControls>
          )}
        </>
      )}
      <BlockWrapper {...blockProps}>
        {!isShowingPlaceholder && videoId && (
          <>
            <Player
              id={videoId}
              playLabel={__("Play", "better-youtube-embed-block")}
              isMaxResThumbnail={isMaxResThumbnail}
              backgroundImage={customThumbnail}
            />
            {isFetchingCaption ? (
              <Spinner />
            ) : (
              <RichText
                tagName="figcaption"
                className="yb-caption"
                placeholder={__("Add caption", "better-youtube-embed-block")}
                value={caption}
                onChange={(caption) => setAttributes({ caption })}
                inlineToolbar
              />
            )}
          </>
        )}
      </BlockWrapper>
    </>
  );
}
