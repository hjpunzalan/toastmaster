import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import PostComment from './PostComment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import 'moment-timezone';
import { setAlert, resetAlert } from '../../../../actions/alerts';
import {
	getPost,
	addComment,
	deleteComment,
	toggleEditPost,
	deletePost,
	updatePost
} from '../../../../actions/post';
import img from '../../../../img/anonymous.png';
import ReadOnly from '../../../utils/draft-js/ReadOnly';
import TextEditor from '../../../utils/draft-js/TextEditor';
import PostEditor from './PostEditor';
import Spinner from '../../../utils/Spinner';
import scrollToTop from '../../../../hooks/scrollToTop';

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
	resetAlert
}) => {
	useEffect(() => {
		getPost(postId); // eslint-disable-next-line
	}, []);

	// Sets default pageQuery if theres not set
	let totalPages;
	const [page, setPage] = useState(
		location.search.includes('?page=')
			? parseInt(location.search.split('?page=')[1]) // page from query
			: 1
	);

	const handleSubmit = () => {
		addComment(textEditor.contentState, postId);
		// Redirect to last page when sending comment
		history.push(`/discussion/post/${postId}?page=${totalPages}`);
		// scrollToTop();
		setPage(totalPages);
	};

	const handleToggle = () => {
		toggleEditPost(postEdit);
	};

	const handleDelete = () => {
		deletePost(postId, history);
	};

	// Client side pagination
	let renderComments;
	const limit = 6; // comments per page
	// Prevents initial state error where post = null
	if (post) {
		totalPages = Math.ceil(post.comments.length / limit);
		//Prevent error when first loading page
		// check for invalid queries
		if ((page > totalPages && page !== 1) || isNaN(page)) {
			history.push(`/discussion/post/${postId}`);
			setPage(1);
		} else {
			const start = (page - 1) * limit;
			const end = page * limit;
			const paginateComments = post.comments.slice(start, end); // comments that are filtered by page number

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
						/>
					))}
				</div>
			);
		}
	}

	// Rendering page buttons
	let nextPage, previousPage;
	if (totalPages > 1 && page !== totalPages)
		nextPage = (
			<Link
				to={`/discussion/post/${postId}?page=${page + 1}`}
				className="Post__page-buttons Post__page-next"
				onClick={() => {
					setPage(page + 1);
					scrollToTop();
				}}>
				Next page
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
				Previous page
			</Link>
		);
	const renderPageButtons = (
		<div className="Post__page">
			{previousPage}
			{nextPage}
		</div>
	);

	return post === null ? (
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
			<h1 className="Post__title">{post.title}</h1>
			<div className="Post__post">
				<div className="Post__postUser">
					<img src={img} alt="user-logo" className="Post__postUser-img" />
					<span className="Post__postUser-name">Random User</span>
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
						<div className="Post__postButtons">
							<button className="Post__postButtons-edit" onClick={handleToggle}>
								Edit
							</button>
							<button
								className="Post__postButtons-delete"
								onClick={handleDelete}>
								Delete
							</button>
						</div>
					</>
				</div>
			</div>
			{renderPageButtons}
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
	post: PropTypes.object
};

const mapStateToProps = state => ({
	postEdit: state.post.postEdit,
	post: state.post.post,
	textEditor: state.textEditor
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
