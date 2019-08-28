import React, { useEffect } from 'react';
import img from '../../../img/anonymous.png';
import DiscussionHead from './DiscussionHead';
import DiscussionPost from './DiscussionPost';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
	getAllPost,
	createPost,
	toggleCreatePost
} from '../../../actions/post';
import Spinner from '../../../components/utils/Spinner';

const Discussion = ({
	post: { posts, edit, postEdit },
	getAllPost,
	loading,
	contentState,
	createPost,
	toggleCreatePost,
	history
}) => {
	useEffect(() => {
		getAllPost();
	}, [getAllPost]);

	return loading || postEdit ? (
		<Spinner />
	) : (
		<div className="Discussion">
			<DiscussionHead
				edit={edit}
				contentState={contentState}
				createPost={createPost}
				toggleCreatePost={toggleCreatePost}
				history={history}
			/>
			{!edit &&
				posts.map(post => (
					<DiscussionPost
						key={post._id}
						title={post.title}
						id={post._id}
						img={img}
						date={post.date}
						count={post.comments.length}
					/>
				))}
		</div>
	);
};

Discussion.propTypes = {
	post: PropTypes.object.isRequired,
	loading: PropTypes.bool,
	contentState: PropTypes.object,
	getAllPost: PropTypes.func.isRequired,
	createPost: PropTypes.func.isRequired,
	toggleCreatePost: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	post: state.post,
	loading: state.post.loading,
	contentState: state.textEditor.contentState
});

export default connect(
	mapStateToProps,
	{ getAllPost, createPost, toggleCreatePost }
)(Discussion);
