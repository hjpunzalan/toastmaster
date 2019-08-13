import React, { useEffect } from 'react';
import PostComment from './PostComment';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPost } from '../../../actions/post';
import img from '../../../img/anonymous.png';
import ReadOnly from '../../utils/draft-js/ReadOnly';

const Post = ({
	match: {
		params: { postId }
	},
	getPost,
	post: {
		post: { title }
	}
}) => {
	useEffect(() => {
		getPost(postId);
	}, [getPost, postId]);

	console.log(title);

	return (
		<div>
			<h1 className="Post__title">{title}</h1>
			<div className="Post__post">
				<div className="Post__postUser">
					<img src={img} alt="user-logo" className="Post__postUser-img" />
					<span className="Post__postUser-name">Random User</span>
				</div>
				<div className="Post__postBody">
					<div className="Post__postBody-text">
						<ReadOnly />
					</div>
					<div className="Post__bottom">
						<span className="Post__postBody-date">Date posted: 8/08/2019</span>
						<div className="Post__postButtons">
							<Link
								className="Post__postButtons-edit"
								to="/discussion/post/edit">
								Edit
							</Link>
							<button className="Post__postButtons-delete">Delete</button>
						</div>
					</div>
				</div>
			</div>
			<PostComment img={img} text={'testing'} />
		</div>
	);
};

Post.propTypes = {
	getPost: PropTypes.func.isRequired,
	post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	post: state.post
});

export default connect(
	mapStateToProps,
	{ getPost }
)(Post);
