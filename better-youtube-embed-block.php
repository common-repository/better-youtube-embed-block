<?php
/**
 * Plugin Name:       Better YouTube Embed Block
 * Description:       Embed YouTube videos without slowing down your site.
 * Requires at least: 6.3
 * Requires PHP:      7.0
 * Version:           1.1.0
 * Author:            Phi Phan
 * Author URI:        https://boldblocks.net
 * Plugin URI:        https://boldblocks.net?utm_source=BYEB&utm_campaign=visit+site&utm_medium=link&utm_content=Plugin+URI
 * License:           GPL-3.0
 *
 * @package BoldBlocks
 * @copyright Copyright(c) 2022, Phi Phan
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function better_youtube_embed_block_init() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'better_youtube_embed_block_init' );

/**
 * The API to render a YouTube video URL as a better youtube embed block
 *
 * @param array   $args {
 *   @param string  $url: YouTube video URL
 *   @param string  $caption: The video caption
 *   @param boolean $isMaxResThumbnail: Load high-resolution image or not
 *   @param string  $aspectRatio: 1, 2, 4/3, 9/16, etc.
 *   @param string  $customThumbnail: The URL of a custom image
 *   @param array   $settings: loop, rel, videoids or playlistId
 *   @param boolean $echo
 * }
 * @return string
 */
function better_youtube_embed_block_render_block( $args ) {
	$output = '';
	$args   = wp_parse_args(
		$args,
		[
			'url'               => '',
			'caption'           => '',
			'isMaxResThumbnail' => false,
			'aspectRatio'       => '',
			'customThumbnail'   => '',
			'settings'          => [],
			'echo'              => false,
		]
	);

	$url      = $args['url'] ?? '';
	$video_id = '';
	if ( $url ) {
		$regex = '/(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/';
		if ( preg_match( $regex, $url, $matches ) ) {
			$video_id = $matches[3];
		}
	}

	if ( $video_id ) {
		$video_id      = esc_attr( $video_id );
		$image_name    = $args['isMaxResThumbnail'] ? 'maxresdefault' : 'hqdefault';
		$caption       = $args['caption'] ? '<figcaption class="yb-caption">' . esc_html( $args['caption'] ) . '</figcaption>' : '';
		$aspect_ratio  = $args['aspectRatio'];
		$thumbnail_url = $args['customThumbnail'] ? $args['customThumbnail'] : 'https://img.youtube.com/vi/' . $video_id . '/' . $image_name . '.jpg';
		$style         = '';
		if ( $aspect_ratio ) {
			if ( preg_match( '/(\d+)(\/(\d+))*/', $aspect_ratio, $aspect_ratio_matches ) ) {
				$w = absint( $aspect_ratio_matches[1] );
				if ( $w ) {
					if ( absint( $aspect_ratio_matches[3] ?? 0 ) ) {
						$h          = absint( $aspect_ratio_matches[3] );
						$percentage = round( ( 1 / ( $w / $h ) ) * 100, 2 );
					} else {
						$percentage = round( ( 1 / $w ) * 100, 2 );
					}

					if ( $percentage ) {
						$style = ' style="--byeb--aspect-ratio:' . $percentage . '%;"';
					}
				}
			}
		}

		$settings = $args['settings'];
		$params   = [];
		if ( $settings['multipleMode'] ?? false ) {
			if ( 'multiple' === $settings['multipleMode'] && ( $settings['videoIds'] ?? false ) ) {
				$params['playlist'] = "{$video_id},{$settings['videoIds']}";
			} elseif ( 'playlist' === $settings['multipleMode'] && ( $settings['playlistId'] ?? false ) ) {
				$params['list'] = $settings['playlistId'];
			}
		}

		if ( 1 === ( $settings['loop'] ?? '' ) ) {
			$params['loop'] = 1;
			if ( ! ( $params['playlist'] ?? false ) && ! ( $params['list'] ?? false ) ) {
				$params['playlist'] = $video_id;
			}
		}

		if ( 0 === ( $settings['rel'] ?? '' ) ) {
			$params['rel'] = 0;
		}

		$data_params = $params ? ' data-params="' . esc_attr( wp_json_encode( $params ) ) . '"' : '';

		$output = '<figure class="wp-block-boldblocks-youtube-block"' . $style . '><div id="yb-video-' . $video_id . '" class="yb-player" data-video-id="' . $video_id . '" data-title="Play"' . $data_params . ' style="background-image:url(' . esc_attr( $thumbnail_url ) . ')"><button type="button" class="yb-btn-play"><span class="visually-hidden">Play</span></button></div>' . $caption . '</figure>';

		$block_instance = [
			'blockName'    => 'boldblocks/youtube-block',
			'attrs'        => [
				'url'               => $url,
				'isMaxResThumbnail' => intval( $args['isMaxResThumbnail'] ),
			],
			'innerHTML'    => $output,
			'innerContent' => [ $output ],
		];

		$output = ( new WP_Block( $block_instance ) )->render();
	}

	if ( $args['echo'] ) {
		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo $output;
	} else {
		return $output;
	}
}

/**
 * Force render the core/embed block as a better youtube embed block
 */
add_filter(
	'render_block_core/embed',
	function( $block_content, $block ) {
		if ( 'youtube' !== ( $block['attrs']['providerNameSlug'] ?? '' ) ) {
			return $block_content;
		}

		if ( ! apply_filters( 'byeb_speed_up_youtube_videos', defined( 'BYEB_SPEED_UP_YOUTUBE_VIDEOS' ) && BYEB_SPEED_UP_YOUTUBE_VIDEOS ) ) {
			return $block_content;
		}

		$attrs = $block['attrs'] ?? [];
		return better_youtube_embed_block_render_block(
			[
				'url'     => $attrs['url'] ?? '',
				'caption' => $attrs['caption'] ?? '',
			]
		);
	},
	10,
	2
);

/**
 * Allow once click to play video on unsupported browsers
 */
if ( defined( 'BYEB_FORCE_IFRAME_ON_UNSUPPORTED_BROWSERS' ) && BYEB_FORCE_IFRAME_ON_UNSUPPORTED_BROWSERS ) {
	add_filter(
		'render_block_boldblocks/youtube-block',
		function( $block_content ) {
			$block_reader = new \WP_HTML_Tag_Processor( $block_content );
			if ( $block_reader->next_tag() ) {
				$block_reader->add_class( 'force-iframe' );
			}
			return $block_reader->get_updated_html();
		},
		10,
	);
}
