import React, { useEffect, useState } from 'react';
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
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const Discussion = ({
	post: { posts, edit, postEdit, totalPages },
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

	const [page, setPage] = useState(1);

	const handlePage = pageNumber => {
		setPage(pageNumber);
		getAllPost(pageNumber);
	};
	const nextPage = (
		<button
			className="Discussion__page-next"
			onClick={() => handlePage(page + 1)}>
			<FaArrowRight />
		</button>
	);
	const prevPage = (
		<button
			className="Discussion__page-prev"
			onClick={() => handlePage(page - 1)}>
			<FaArrowLeft />
		</button>
	);
	const renderPosts = posts.map(post => (
		<DiscussionPost
			key={post._id}
			title={post.title}
			id={post._id}
			img={img}
			date={post.date}
			count={post.comments.length}
		/>
	));

	const renderPagination = (
		<div className="Discussion__page">
			{page > 1 && prevPage}
			Page {page} of {totalPages}
			{totalPages > 1 && page !== totalPages && nextPage}
		</div>
	);
	return (
		<div className="Discussion">
			<DiscussionHead
				edit={edit}
				contentState={contentState}
				createPost={createPost}
				toggleCreatePost={toggleCreatePost}
				history={history}
			/>
			{loading || postEdit ? (
				<Spinner />
			) : (
				!edit && (
					<>
						{renderPagination}
						{renderPosts}
						{posts.length > 5 && renderPagination}
					</>
				)
			)}
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
