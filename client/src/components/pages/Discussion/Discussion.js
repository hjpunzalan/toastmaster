import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';
import {
	getAllPost,
	createPost,
	toggleCreatePost,
	searchPost,
	postNextPage
} from '../../../actions/post';
import img from '../../../img/anonymous.png';
import DiscussionHead from './DiscussionHead';
import DiscussionPost from './DiscussionPost';
import SpinnerSmall from '../../../components/utils/SpinnerSmall';

const Discussion = ({
	post: { posts, edit, totalPages },
	getAllPost,
	loading,
	contentState,
	createPost,
	toggleCreatePost,
	history,
	searchPost,
	postNextPage
}) => {
	useEffect(() => {
		if (edit) {
			toggleCreatePost();
		}
		getAllPost();
		// eslint-disable-next-line
	}, []);

	const [page, setPage] = useState(1);
	const [isSearch, setIsSearch] = useState(false); // boolean or string

	const renderPosts = posts.map(post => (
		<DiscussionPost
			key={post._id}
			title={post.title}
			id={post._id}
			img={post.user.photo || img}
			date={post.date}
			count={post.comments.length}
			text={post.plainText}
			firstName={post.user.firstName}
			lastName={post.user.lastName}
		/>
	));
	return (
		<div className="Discussion">
			<DiscussionHead
				edit={edit}
				contentState={contentState}
				createPost={createPost}
				toggleCreatePost={toggleCreatePost}
				history={history}
				searchPost={searchPost}
				setPage={setPage}
				loading={loading}
				setIsSearch={setIsSearch}
			/>
			{!edit && (
				<>
					<InfiniteScroll
						pageStart={page}
						loadMore={() => {
							if (page < totalPages) postNextPage(page, setPage, isSearch);
						}}
						hasMore={page < totalPages}
						threshold={50}
						loader={<SpinnerSmall key="loader" />}>
						{renderPosts}
					</InfiniteScroll>
				</>
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
	toggleCreatePost: PropTypes.func.isRequired,
	searchPost: PropTypes.func.isRequired,
	postNextPage: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	post: state.post,
	loading: state.post.loading,
	contentState: state.textEditor.contentState
});

export default connect(
	mapStateToProps,
	{ getAllPost, createPost, toggleCreatePost, searchPost, postNextPage }
)(Discussion);
