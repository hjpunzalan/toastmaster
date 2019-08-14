import React, { useEffect } from 'react';
import PostComment from './PostComment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
	getPost,
	addComment,
	toggleCreatePost
} from '../../../../actions/post';
import { resetAlert } from '../../../../actions/alerts';
import img from '../../../../img/anonymous.png';
import ReadOnly from '../../../utils/draft-js/ReadOnly';
import TextEditor from '../../../utils/draft-js/TextEditor';
import PostEditor from './PostEditor';

const Post = ({
	match: {
		params: { postId }
	},
	getPost,
	toggleCreatePost,
	edit,
	addComment,
	post: { contentState, comments, title },
	textEditor
}) => {
	useEffect(() => {
		getPost(postId);
	}, [getPost, postId]);

	const handleSubmit = () => {
		addComment(textEditor.contentState);
	};

	const handleToggle = () => {
		resetAlert();
		toggleCreatePost(edit);
	};

	return edit ? (
		<PostEditor
			contentState={contentState}
			title={title}
			postId={postId}
			handleToggle={handleToggle}
			textEditor={textEditor}
		/>
	) : (
		<>
			<h1 className="Post__title">{title}</h1>
			<div className="Post__post">
				<div className="Post__postUser">
					<img src={img} alt="user-logo" className="Post__postUser-img" />
					<span className="Post__postUser-name">Random User</span>
				</div>
				<div className="Post__postBody">
					<div className="Post__postBody-text">
						<ReadOnly contentState={contentState} />
					</div>
					<div className="Post__bottom">
						<span className="Post__postBody-date">Date posted: 8/08/2019</span>
						<div className="Post__postButtons">
							<button className="Post__postButtons-edit" onClick={handleToggle}>
								Edit
							</button>
							<button className="Post__postButtons-delete">Delete</button>
						</div>
					</div>
				</div>
			</div>
			<div className="Post__comments">
				{comments.length > 0 &&
					comments.map(c => (
						<PostComment key={c.id} img={img} contentState={c.contentState} />
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
	post: PropTypes.object.isRequired,
	addComment: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	edit: state.post.edit,
	post: state.post.post,
	textEditor: state.textEditor
});

export default connect(
	mapStateToProps,
	{ getPost, addComment, toggleCreatePost }
)(Post);
