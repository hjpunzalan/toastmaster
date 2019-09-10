import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Comments from './Comments';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
	getPost,
	addComment,
	deleteComment,
	toggleEditPost,
	deletePost,
	updatePost
} from '../../../actions/post';
import img from '../../../img/anonymous.png';
import TextEditor from '../../utils/draft-js/TextEditor';
import PostEditor from './PostEditor';
import Spinner from '../../utils/Spinner';
import PostHead from './PostHead';
import PageButtons from './PageButtons';

const Post = ({
	match: {
		params: { postId }
	},
	getPost,
	toggleEditPost,
	deletePost,
	postEdit,
	updatePost,
	addComment,
	deleteComment,
	post,
	textEditor,
	history,
	location,
	currentUser,
	postLoading
}) => {
	useEffect(() => {
		// runs once and on updatePost
		getPost(postId, pageQuery, history, page, setPage);
		// eslint-disable-next-line
	}, []);

	// Sets default pageQuery if theres not set
	const pageQuery = parseInt(location.search.split('?page=')[1]) || 1;
	const [page, setPage] = useState(
		location.search.includes('?page=')
			? pageQuery // page from query
			: 1
	);

	const handleSubmit = () =>
		addComment(textEditor.contentState, postId, history, setPage);
	const handleToggleEditPost = () => toggleEditPost(postEdit);
	const handleDeletePost = () => deletePost(postId, history);

	// Client side pagination
	//Prevent error when first loading page
	// check for invalid queries
	// Need to wait until getPost is called first from effect
	const limit = 6;
	const start = (page - 1) * limit;
	const end = page * limit;

	return post === null || postLoading ? (
		<Spinner />
	) : postEdit ? (
		<PostEditor
			updatePost={updatePost}
			contentState={post.contentState}
			title={post.title}
			postId={postId}
			handleToggle={handleToggleEditPost}
			textEditor={textEditor}
		/>
	) : (
		<>
			<Link to="/discussion" className="Post__back">
				<span className="Post__back-visible">Go Back</span>
				<span className="Post__back-invisible">To discussion</span>
			</Link>
			<div className="Post__title-container">
				<h1 className="Post__title">{post.title}</h1>
			</div>
			<PostHead
				post={post}
				currentUser={currentUser}
				handleToggleEditPost={handleToggleEditPost}
				handleDeletePost={handleDeletePost}
			/>
			{post && (
				<>
					{post.comments.slice(start, end).length > 3 && (
						<PageButtons
							page={page}
							setPage={setPage}
							totalPages={post.totalPages}
							postId={postId}
						/>
					)}
					<div className="Post__comments">
						{post.comments.slice(start, end).map(c => (
							<Comments
								key={c._id}
								img={img}
								contentState={c.contentState}
								id={c._id}
								postId={postId}
								date={c.date}
								user={c.user}
								deleteComment={deleteComment}
								page={page}
								history={history}
								setPage={setPage}
								currentUser={currentUser}
							/>
						))}
					</div>
					<PageButtons
						page={page}
						setPage={setPage}
						totalPages={post.totalPages}
						postId={postId}
					/>
					<div className="Post__addComment">
						<h2 className="Post__addComment-title">Add Comment</h2>
						<TextEditor handleSubmit={handleSubmit} />
					</div>
				</>
			)}
		</>
	);
};

Post.propTypes = {
	getPost: PropTypes.func.isRequired,
	addComment: PropTypes.func.isRequired,
	toggleEditPost: PropTypes.func.isRequired,
	deletePost: PropTypes.func.isRequired,
	deleteComment: PropTypes.func.isRequired,
	updatePost: PropTypes.func.isRequired,
	contentState: PropTypes.string, //Converted to JSON string before sending to database and reconverted by texteditor
	textEditor: PropTypes.object.isRequired,
	postEdit: PropTypes.bool.isRequired,
	post: PropTypes.object,
	currentUser: PropTypes.object,
	postLoading: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
	postEdit: state.post.postEdit,
	post: state.post.post,
	textEditor: state.textEditor,
	currentUser: state.auth.currentUser,
	postLoading: state.post.postLoading
});

export default connect(
	mapStateToProps,
	{
		getPost,
		addComment,
		toggleEditPost,
		deletePost,
		deleteComment,
		updatePost
	}
)(Post);