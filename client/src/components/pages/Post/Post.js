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
import Spinner from '../../utils/Spinner';
import PostHead from './PostHead';
import PageButtons from './PageButtons';
import CreatePost from '../../utils/CreatePost';

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
	post: { post },
	textEditor,
	history,
	location,
	currentUser,
	postLoading,
	users: { Moderator }
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
	const [title, setTitle] = useState('');

	// handlers
	const handleSubmit = () =>
		addComment(textEditor.contentState, postId, history, setPage);
	const handleToggleEditPost = () => {
		setTitle(post.title);
		toggleEditPost();
	};
	const handleDeletePost = () => deletePost(postId, history);
	const handleUpdate = plainText => {
		// plain text from textEditor
		updatePost(postId, title, textEditor.contentState, plainText);
	};

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
		<CreatePost
			handleToggle={handleToggleEditPost}
			title={title}
			setTitle={setTitle}
			handleSubmit={handleUpdate}
			withPlainText={true}
			contentState={post.contentState}
			type={'edit'}
		/>
	) : (
		<>
			<Link to="/discussion" className="Post__goBack">
				<button className="Post__goBack-visible">Go Back</button>
				<button className="Post__goBack-invisible">To discussion</button>
			</Link>
			<div className="Post__title-container">
				<h1 className="Post__title">{post.title}</h1>
			</div>
			<PostHead
				Moderator={Moderator}
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
								Moderator={Moderator}
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
	postLoading: PropTypes.bool.isRequired,
	users: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	postEdit: state.post.postEdit,
	post: state.post,
	textEditor: state.textEditor,
	currentUser: state.auth.currentUser,
	users: state.users,
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
