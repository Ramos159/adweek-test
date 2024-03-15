<?php
/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */
	$num_of_posts = $attributes['numberOfPostsToDisplay'];
	$category_id = $attributes['certainPostCategory'];
	$show_thumbnail = $attributes['showPostThumbnail'];

	$posts = new WP_Query(array(
		'post_type'      => 'post',
		'posts_per_page' => $num_of_posts,
		'cat'            => $category_id
	));

	$category_name = get_cat_name($category_id);

?>
<div <?php echo get_block_wrapper_attributes(); ?>>
	<h2>Latest <?php echo $category_name; ?> Blogs</h2>
	<?php if($posts->have_posts()) : while($posts->have_posts()) : $posts->the_post()?>
		<hr/>
		<div style="box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1); padding: 24px; display: flex; gap: 16px; margin: 16px;">
			<?php if($show_thumbnail): ?>
				<div style="<?php if(has_post_thumbnail()): ?>background-image: url(<?php the_post_thumbnail_url()?>);width: 33.33%; background-position: center; background-size: cover; <?php else: ?> background-color: gray; width: 33.33%; display: flex; align-items: center; justify-content: center; <?php endif;?>">
					<?php if(!has_post_thumbnail()):?> <p style="text-align: center;">No Image<p> <?php endif;?>
				</div>
			<?php endif; ?>
			<div style="<?php if($show_thumbnail): ?> width: 66.66%<?php endif;?>">
				<a href="<?php echo get_the_permalink();?>" target="_blank" ><h2><?php the_title(); ?></h2></a>
				<?php the_excerpt(); ?>
				<p>By <?php the_author(); ?></p>
			</div>
		</div>
	<?php endwhile; else: ?>
		<p>No Posts</p>
	<?php endif; ?>
</div>

		<!-- <div style={styles.blogListOuter}>
			{
				showPostThumbnail ? (
					<div style={post.featured_image_src ? {width: "33.33%", backgroundImage: `url(${post.featured_image_src})`, backgroundPosition: "center", backgroundSize: "cover" } : styles.imageNotAvailable}>
						{post.featured_image_src ? null : <p style={{textAlign: "center"}}>No Featured Image</p>}
					</div>
				) : null
			}
			<div style={ showPostThumbnail ? styles.blogContentSmall : null}>
				<a href={post.link} target="_blank" ><h2>{post.title.rendered}</h2></a>
				{parse(post.excerpt.rendered)}
				<p>By <a href={post.author_info.author_link} target="_blank">{post.author_info.display_name}</a></p>
			</div>
		</div> -->

