<?php
/**
 * Plugin Name:       Blog List Block
 * Description:       Example block scaffolded with Create Block tool.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       blog-list-block
 *
 * @package           create-block
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function blog_list_block_blog_list_block_block_init() {
	register_block_type( __DIR__ . '/build' );
}

// add my style sheet
function styling_features() {
   // Add support for block styles.
   add_theme_support( 'editor-styles' );
   add_editor_style('./build/index.css');
   wp_enqueue_style( 'style', get_stylesheet_uri() );
}

add_action('after_setup_theme', 'styling_features');
add_action( 'init', 'blog_list_block_blog_list_block_block_init' );

