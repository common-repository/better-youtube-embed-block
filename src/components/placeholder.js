/**
 * WordPress dependencies
 */
import { __, _x } from "@wordpress/i18n";
import { Button, Placeholder } from "@wordpress/components";
import { BlockIcon } from "@wordpress/block-editor";

/**
 * Internal dependencies
 */

const YTPlaceholder = ({
  icon,
  label,
  value,
  onChange,
  onSubmit,
  isInvalidURL = false,
}) => {
  const helpText = __(
    "Input a YouTube video URL or an ID",
    "better-youtube-embed-block"
  );
  return (
    <Placeholder
      icon={<BlockIcon icon={icon} showColors />}
      label={label}
      className="boldblocks-youtube"
      instructions={helpText}
    >
      <form
        className="boldblocks-youtube__form"
        onSubmit={onSubmit}
        style={{ gap: "8px" }}
      >
        <input
          type="text"
          value={value || ""}
          className="components-placeholder__input"
          aria-label={label}
          placeholder={helpText}
          onChange={onChange}
          style={{ flex: "1 1 auto" }}
        />
        <Button
          variant="primary"
          type="submit"
          className="components-placeholder__submit"
        >
          {_x("Embed", "Embed button label", "better-youtube-embed-block")}
        </Button>
      </form>
      {isInvalidURL && (
        <div className="components-placeholder__error">
          <div className="components-placeholder__instructions">{helpText}</div>
        </div>
      )}
    </Placeholder>
  );
};

export default YTPlaceholder;
