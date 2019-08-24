import React, { useEffect } from 'react';
import PostComment from './PostComment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import 'moment-timezone';
import {
	getPost,
	addComment,
	toggleEditPost,
	deletePost
} from '../../../../actions/post';
import { resetAlert } from '../../../../actions/alerts';
import img from '../../../../img/anonymous.png';
import ReadOnly from '../../../utils/draft-js/ReadOnly';
import TextEditor from '../../../utils/draft-js/TextEditor';
import PostEditor from './PostEditor';
import Spinner from '../../../utils/Spinner';

const Post = ({
	match: {
		params: { postId }
	},
	getPost,
	toggleEditPost,
	deletePost,
	postEdit,
	addComment,
	post,
	textEditor,
	history
}) => {
	useEffect(() => {
		getPost(postId); // eslint-disable-next-line
	}, []);

	const handleSubmit = () => {
		addComment(textEditor.contentState, postId);
	};

	const handleToggle = () => {
		resetAlert();
		toggleEditPost(postEdit);
	};

	const handleDelete = () => {
		deletePost(postId, history);
	};

	return post === null ? (
		<Spinner />
	) : postEdit ? (
		<PostEditor
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
					<div className="Post__postBottom">
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
					</div>
				</div>
			</div>
			<div className="Post__comments">
				{post.comments.length > 0 &&
					post.comments.map(c => (
						<PostComment
							key={c._id}
							img={img}
							contentState={c.contentState}
							id={c._id}
							date={c.date}
							user={c.user}
						/>
					))}
			</div>
			<div className="Post__addComment">
				<h2 className="Post__addComment-title">Add Comment</h2>
				<TextEditor handleSubmit={handleSubmit} />
			</div>
		</>
	);
};

Post.propTypes = {
	getPost: PropTypes.func.isRequired,
	addComment: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	postEdit: state.post.postEdit,
	post: state.post.post,
	textEditor: state.textEditor
});

export default connect(
	mapStateToProps,
	{ getPost, addComment, toggleEditPost, deletePost }
)(Post);
