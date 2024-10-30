=== YouTube Block - A better way to embed YouTube videos, shorts, playlists ===
Contributors:      mr2p
Tags:              block, Gutenberg, youtube, embed, video
Requires PHP:      7.0.0
Requires at least: 6.3
Tested up to:      6.7
Stable tag:        1.1.0
License:           GPL-3.0
License URI:       https://www.gnu.org/licenses/gpl-3.0.html
Donate link:       https://boldblocks.net/?utm_source=wp.org&utm_campaign=readme&utm_medium=link&utm_content=BYEB+Donate

Embed YouTube videos without slowing down your site. Easily embed one or multiple videos, shorts, and playlists.

== Description ==

The default embed block for Youtube videos sucks. It slows down your site. The more videos on the page the more it slow. This single-block plugin fixes that.

Why this block is better than the default one:

* Instead of loading the entire iframe, only the video thumbnail is loaded, resulting in significant performance improvements
* Ability to play multiple different videos as a custom playlist or input a playlist ID to play the whole playlist
* Ability to use a custom image as the video thumbnail
* Ability to set a custom aspect ratio value for displaying any kind of YouTube videos
* Ability to loop continuously once it finishes playing
* Ability to show related videos from the same channel as the initial video
* Automatically load the video title as the caption
* The same UI as the default core/embed, and you can use the video title as the caption of the block with one click
* It can be transformed from/to the core embed block.
* Automatically convert all default core embed YouTube blocks to this block with one line of code.

This plugin also provides a PHP API for developers to render a YouTube video URL as this block; or to automatically transform core/embed YouTube videos into this block.

The simplest example is:

        better_youtube_embed_block_render_block( ['url' => 'https://youtu.be/paSXmpHU9K4'] );

The example with all the parameters is:

        better_youtube_embed_block_render_block(
          [
            'url'               => 'https://youtu.be/paSXmpHU9K4',
            'aspectRatio'       => '16/9',
            'isMaxResThumbnail' => false,
            'caption'           => 'My awesome video',
            'customThumbnail'   => 'https://example.com/bg.jpg',
            'settings'          => ['loop' => 1, 'rel' => 0],
            'echo'              => false,
          ]
        );

To automatically transform all core/embed YouTube videos on your site to this block, you need to put the following code to the wp-config.php file or your theme/plugin:

        define('BYEB_SPEED_UP_YOUTUBE_VIDEOS', true);

or

        add_filter( 'byeb_speed_up_youtube_videos', '__return_true' );

On iOS, browsers like Safari and Chrome require two clicks to play videos. If you want to allow users to play videos with a single click, you need to add the following code to the wp-config.php file or your theme/plugin:

        define('BYEB_FORCE_IFRAME_ON_UNSUPPORTED_BROWSERS', true);

Please check out this [page](https://contentblocksbuilder.com/video-tutorials/?utm_source=wp.org&utm_campaign=readme&utm_medium=link&utm_content=BYEB) to see how fast it helps. The page contains around 30 embedded Youtube videos but they don't slow down the page.

If this plugin is useful for you, please do a quick review and [rate it](https://wordpress.org/support/plugin/better-youtube-embed-block/reviews/#new-post) on WordPress.org to help us spread the word. I would very much appreciate it.

Please check out my other plugins if you're interested:

- **[Content Blocks Builder](https://wordpress.org/plugins/content-blocks-builder)** - This plugin turns the Block Editor into a powerful page builder by allowing you to create blocks, variations, and patterns directly in the Block Editor without needing a code editor.
- **[Meta Field Block](https://wordpress.org/plugins/display-a-meta-field-as-block)** - A block to display custom fields as blocks on the front end. It supports custom fields for posts, terms, users, and setting fields. It can also be used in the Query Loop block.
- **[SVG Block](https://wordpress.org/plugins/svg-block)** - A block to display SVG images as blocks. Useful for images, icons, dividers, and buttons. It allows you to upload SVG images and load them into the icon library.
- **[Icon separator](https://wordpress.org/plugins/icon-separator)** - A tiny block just like the core/separator block but with the ability to add an icon.
- **[Breadcrumb Block](https://wordpress.org/plugins/breadcrumb-block)** - A simple breadcrumb trail block that supports JSON-LD structured data and is compatible with WooCommerce.
- **[Block Enhancements](https://wordpress.org/plugins/block-enhancements)** - Adds practical features to blocks like icons, box shadows, transforms, etc.
- **[Counting Number Block](https://wordpress.org/plugins/counting-number-block)** - A block to display numbers with a counting effect

The plugin is developed using @wordpress/create-block.

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/better-youtube-embed-block` directory, or install the plugin through the WordPress plugins screen directly.
1. Activate the plugin through the 'Plugins' screen in WordPress


== Frequently Asked Questions ==

= What problem does this plugin solve? =

It provides a better solution to embed YouTube videos than the default one.

= Who needs this plugin? =

Anyone can use this plugin.

== Screenshots ==

1. Block edit screen

2. Block settings

== Changelog ==

= 1.1.0 =
*Release Date - 23 August 2024*

* Added   - Play multiple videos or the whole playlist
* Added   - Loop continuously once it finishes playing
* Added   - Show related videos from the same channel
* Added   - Allow rendering embeded frame when browsers require click two times to play videos
* Updated - Requires at least WordPress version 6.3

= 1.0.5 =
*Release Date - 15 June 2024*

* Added   - Support custom thumbnail for videos
* Added   - Allow editing media settings in the contentOnly mode
* Updated - Change the 'Requires at least' to 6.0
* Added   - Support clientNavigation interactivity

= 1.0.4 =
*Release Date - 23 February 2024*

* Added - Add a PHP API for developers to render a YouTube video URL as this block
* Added - A new option to load high-resolution image
* Added - Add the ability to render all core/embed for YouTube videos as this block

= 1.0.3 =
*Release Date - 05 January 2024*

* Added - Custom aspect ratio
* Added - Margin support feature

= 1.0.2 =
*Release Date - 11 August 2023*

* DEV - Update to apiVersion 3
* DEV - Change i18 texts for translation

= 1.0.1 =
*Release Date - 21 April 2023*

* DEV - Add keywords to the block

= 1.0.0 =
* Release Date - 23 November 2022*


