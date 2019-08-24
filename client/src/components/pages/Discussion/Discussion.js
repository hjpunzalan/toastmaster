import React, { useEffect } from 'react';
import img from '../../../img/anonymous.png';
import DiscussionHead from './DiscussionHead';
import DiscussionPost from './DiscussionPost';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getAllPost } from '../../../actions/post';
import Spinner from '../../../components/utils/Spinner';

const Discussion = ({ post: { posts, postEdit }, getAllPost, loading }) => {
	useEffect(() => {
		getAllPost();
	}, [getAllPost]);

	return loading || postEdit ? (
		<Spinner />
	) : (
		<div className="Discussion">
			<DiscussionHead />
			{posts.map(post => (
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
	post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	post: state.post,
	loading: state.post.loading
});

export default connect(
	mapStateToProps,
	{ getAllPost }
)(Discussion);
