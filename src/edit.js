/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { InspectorControls,useBlockProps } from '@wordpress/block-editor';
import { PanelBody, TextControl, CheckboxControl, SelectControl } from '@wordpress/components';
import { useSelect } from "@wordpress/data";
import parse from 'html-react-parser';



/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */

// i couldn't get the actual styles files to work for some reason so this is my work around for now
const styles = {
	blogListOuter: {
		boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)", 
		padding: "24px", 
		display: "flex", 
		gap: "16px", 
		margin: "16px"
	},
	imageNotAvailable: {
		backgroundColor: "gray", 
		width: "33.33%", 
		display: "flex", 
		alignItems: "center", 
		justifyContent: "center"
	},
	blogContentSmall: {
		width: "66.66%"
	}
}


export default function Edit( { attributes, setAttributes } ) {
	const { numberOfPostsToDisplay, certainPostCategory, showPostThumbnail } = attributes;
	const blockProps = useBlockProps();
	// get all categories to list
	const postCategories = useSelect((select)=> {
		return select('core').getEntityRecords('taxonomy', 'category');
	});
	// get the category to display the name later
	const chosenCategory = useSelect((select)=> {
		return select('core').getEntityRecords('taxonomy', 'category', { include: certainPostCategory });
	});

	let categoryOptions = [];

	// create options array of objects
	if(postCategories){
		categoryOptions = postCategories.map( value =>{
			const obj = {};
			obj.label = value.name;
			obj.value = value.id;
			return obj;
		});
	}

	const posts = useSelect((select) => {
		// posts are defined and categories are greater than 0
		if(certainPostCategory){
			// reformat the categories to be wordpress query friendly
			return select('core').getEntityRecords('postType','post', {per_page: numberOfPostsToDisplay, categories: certainPostCategory});
		} else {
			return select('core').getEntityRecords('postType','post', {per_page: numberOfPostsToDisplay});
		}
	});



	// i wanted to use numbercontrol for number of posts but it was marked experimental and i didn't bother
	// textcontrol with the parseint seems to do the job just fine
	return (
		<>
			<InspectorControls>
				<PanelBody title="Settings">
					<TextControl
						label="Number of Posts to display, defaults to 1"
						value={numberOfPostsToDisplay || 1}
						onChange={(value)=>{
							if(value == ""){   
								// lets create a nice default number of 3 to show if they enter nothing
								setAttributes({numberOfPostsToDisplay: 1});
							} else {
								setAttributes({numberOfPostsToDisplay: parseInt(value)});
							}
						}}
					/>
					<SelectControl
						label="Category"
						value={certainPostCategory}
						options={categoryOptions}
						onChange={(category)=> setAttributes({certainPostCategory: parseInt(category)})}
					/>
					<CheckboxControl
						label="Show photo thumbnails?"
						value={showPostThumbnail}
						checked={showPostThumbnail}
						onChange={(value)=> setAttributes({showPostThumbnail: value})}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<h2>Latest {chosenCategory && chosenCategory[0].name} Blogs</h2>
				{!posts && "No Posts"}
				{posts && posts.length > 0 && posts.map((post)=>{
					return (
						<>
							<hr/>
							<div style={styles.blogListOuter}>
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
									<p>By {post.author_info.display_name}</p>
								</div>
							</div>
						</>
					)
				})}
			</div>
		</>
	);
}
