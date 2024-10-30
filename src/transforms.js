/**
 * WordPress dependencies
 */
import { createBlock } from "@wordpress/blocks";

/**
 * Internal dependencies
 */
import metadata from "./block.json";

const { name: YoutubeBlockName } = metadata;

/**
 * Transform from/to core/embed back-and-forth.
 */
const transforms = {
  from: [
    {
      type: "block",
      blocks: ["core/embed"],
      isMatch: ({ providerNameSlug }) => {
        return providerNameSlug === "youtube";
      },
      transform: ({ url, caption }) => {
        return createBlock(YoutubeBlockName, {
          url,
          caption,
        });
      },
    },
  ],
  to: [
    {
      type: "block",
      blocks: ["core/embed"],
      transform: ({ url, caption }) => {
        url = url && url.length === 11 ? `https://youtu.be/${url}` : url;

        return createBlock("core/embed", {
          url,
          caption,
          providerNameSlug: "youtube",
          responsive: true,
        });
      },
    },
  ],
};

export default transforms;
