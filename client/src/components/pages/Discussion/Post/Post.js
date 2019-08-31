import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PostComment from './PostComment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import 'moment-timezone';
import {
	getPost,
	addComment,
	deleteComment,
	toggleEditPost,
	deletePost,
	updatePost
} from '../../../../actions/post';
import { setAlert, resetAlert } from '../../../../actions/alerts';
import img from '../../../../img/anonymous.png';
import ReadOnly from '../../../utils/draft-js/ReadOnly';
import TextEditor from '../../../utils/draft-js/TextEditor';
import PostEditor from './PostEditor';
import Spinner from '../../../utils/Spinner';
import scrollToTop from '../../../../utils/scrollToTop';

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
	setAlert,
	resetAlert,
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

	const handleSubmit = () => {
		// addComment = (contentState, postId, history, callback)
		addComment(textEditor.contentState, postId, history, setPage);
	};

	const handleToggle = () => {
		toggleEditPost(postEdit);
	};

	const handleDelete = () => {
		deletePost(postId, history);
	};

	// Client side pagination
	let renderComments, renderPageButtons, paginateComments;
	const limit = 6;
	//Prevent error when first loading page
	// check for invalid queries
	if (post) {
		// Need to wait until getPost is called first from effect
		const start = (page - 1) * limit;
		const end = page * limit;
		paginateComments = post.comments.slice(start, end); // comments that are filtered by page number

		renderComments = (
			<div className="Post__comments">
				{paginateComments.map(c => (
					<PostComment
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
		);

		// Rendering page buttons
		let nextPage, previousPage;
		if (post.totalPages > 1 && page !== post.totalPages)
			nextPage = (
				<Link
					to={`/discussion/post/${postId}?page=${page + 1}`}
					className="Post__page-buttons Post__page-next"
					onClick={() => {
						setPage(page + 1);
						scrollToTop();
					}}>
					Next &nbsp; &rarr;
				</Link>
			);
		if (page > 1)
			previousPage = (
				<Link
					to={`/discussion/post/${postId}?page=${page - 1}`}
					className="Post__page-buttons Post__page-prev"
					onClick={() => {
						setPage(page - 1);
						scrollToTop();
					}}>
					&larr; &nbsp; Previous
				</Link>
			);
		renderPageButtons = (
			<div className="Post__page">
				{previousPage}
				{page > 1 || post.totalPages > 1 ? <>Page {page}</> : ''}
				{nextPage}
			</div>
		);
	}

	return post === null || postLoading ? (
		<Spinner />
	) : postEdit ? (
		<PostEditor
			updatePost={updatePost}
			contentState={post.contentState}
			title={post.title}
			postId={postId}
			handleToggle={handleToggle}
			textEditor={textEditor}
		/>
	) : (
		<>
			<Link to="/discussion" className="Post__back">
				<span className="Post__back-visible">Go Back</span>
				<span className="Post__back-invisible">To discussion</span>
			</Link>
			<h1 className="Post__title">{post.title}</h1>
			<div className="Post__post">
				<div className="Post__postUser">
					<img src={img} alt="user-logo" className="Post__postUser-img" />
					<span className="Post__postUser-name">
						{post.user.firstName}
						<br /> {post.user.lastName}
					</span>
				</div>
				<div className="Post__postBody">
					<div className="Post__postBody-text">
						<ReadOnly contentState={post.contentState} />
					</div>
					<>
						<span className="Post__postBody-date">
							Posted:{' '}
							<Moment tz="Australia/Perth" format="ddd MMM DD YYYY HH:mm">
								{post.date}
							</Moment>
						</span>
						{post.lastEdited && (
							<span className="Post__postBody-edited">
								Last edited:{' '}
								<Moment tz="Australia/Perth" format="ddd MMM DD YYYY HH:mm">
									{post.lastEdited}
								</Moment>
							</span>
						)}
						{currentUser._id === post.user._id && (
							<div className="Post__postButtons">
								<button
									className="Post__postButtons-edit"
									onClick={handleToggle}>
									Edit
								</button>
								<button
									className="Post__postButtons-delete"
									onClick={handleDelete}>
									Delete
								</button>
							</div>
						)}
					</>
				</div>
			</div>
			{paginateComments.length > 3 && renderPageButtons}
			{renderComments}
			{renderPageButtons}
			<div className="Post__addComment">
				<h2 className="Post__addComment-title">Add Comment</h2>
				<TextEditor handleSubmit={handleSubmit} />
			</div>
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
		updatePost,
		setAlert,
		resetAlert
	}
)(Post);
