import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { connect } from "react-redux";
import {
  createPost,
  getAllPost,
  postNextPage,
  searchPost,
  toggleCreatePost,
} from "../../../actions/post";
import SpinnerSmall from "../../../components/utils/SpinnerSmall";
import DiscussionHead from "./DiscussionHead";
import DiscussionPost from "./DiscussionPost";

export const Discussion = ({
  post: { posts, edit, totalPages, loading },
  getAllPost,
  contentState,
  createPost,
  toggleCreatePost,
  history,
  searchPost,
  postNextPage,
  currentUser,
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

  const renderPosts = posts.map((post) => (
    <DiscussionPost
      key={post._id}
      title={post.title}
      id={post._id}
      user={post.user}
      date={post.date}
      count={post.comments.length}
      text={post.plainText}
      firstName={post.user.firstName}
      lastName={post.user.lastName}
      currentUser={currentUser}
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
        getAllPost={getAllPost}
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
            loader={<SpinnerSmall key="loader" />}
          >
            {renderPosts}
          </InfiniteScroll>
        </>
      )}
    </div>
  );
};

Discussion.propTypes = {
  post: PropTypes.object.isRequired,
  contentState: PropTypes.object,
  getAllPost: PropTypes.func.isRequired,
  createPost: PropTypes.func.isRequired,
  toggleCreatePost: PropTypes.func.isRequired,
  searchPost: PropTypes.func.isRequired,
  postNextPage: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
  contentState: state.textEditor.contentState,
  currentUser: state.auth.currentUser,
});

export default connect(mapStateToProps, {
  getAllPost,
  createPost,
  toggleCreatePost,
  searchPost,
  postNextPage,
})(Discussion);
