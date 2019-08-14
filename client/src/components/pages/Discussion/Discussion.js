import React from 'react';
import img from '../../../img/anonymous.png';
import DiscussionHead from './DiscussionHead';
import DiscussionPost from './DiscussionPost';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Discussion = ({ post: { posts } }) => {
	return (
		<div className="Discussion">
			<DiscussionHead />
			{posts.map(post => (
				<DiscussionPost
					key={post.id}
					title={post.title}
					id={post.id}
					img={img}
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
	post: state.post
});

export default connect(mapStateToProps)(Discussion);
