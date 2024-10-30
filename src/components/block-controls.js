/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { ToolbarButton, ToolbarGroup, Dropdown } from "@wordpress/components";
import { BlockControls } from "@wordpress/block-editor";
import { edit, caption, settings as settingsIcon } from "@wordpress/icons";

const YTBlockControls = ({
  showEditButton,
  switchBackToURLInput,
  showFetchCaption,
  fetchCaption,
  url,
  showSettings,
  settingsLabel,
  settingsControl,
}) => (
  <>
    <BlockControls>
      <ToolbarGroup>
        {showEditButton && (
          <ToolbarButton
            className="components-toolbar__control"
            label={__("Edit URL/ID", "better-youtube-embed-block")}
            icon={edit}
            onClick={switchBackToURLInput}
          />
        )}
        {showFetchCaption && (
          <ToolbarButton
            className="components-toolbar__control"
            label={__(
              "Fetch the video title as the caption",
              "better-youtube-embed-block"
            )}
            icon={caption}
            onClick={() => fetchCaption(url)}
          />
        )}
        {showSettings && (
          <Dropdown
            popoverProps={{
              position: "bottom right",
            }}
            contentClassName="byeb-dropdown"
            renderToggle={({ isOpen, onToggle }) => (
              <ToolbarButton
                label={settingsLabel}
                onClick={onToggle}
                aria-haspopup="true"
                aria-expanded={isOpen}
                icon={settingsIcon}
              />
            )}
            renderContent={() => settingsControl}
          />
        )}
      </ToolbarGroup>
    </BlockControls>
  </>
);

export default YTBlockControls;
