import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Comments from "./Comments";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { ContentState, convertToRaw } from "draft-js";
import {
	getPost,
	addComment,
	deleteComment,
	toggleEditPost,
	deletePost,
	updatePost,
} from "../../../actions/post";
import img from "../../../img/anonymous.png";
import TextEditor from "../../utils/draft-js/TextEditor";
import Spinner from "../../utils/Spinner";
import PostHead from "./PostHead";
import PageButtons from "./PageButtons";
import ContentEditor from "../../utils/ContentEditor";
import { onChange } from "../../../actions/textEditor";

const Post = ({
	match: {
		params: { postId },
	},
	getPost,
	toggleEditPost,
	deletePost,
	postEdit,
	updatePost,
	addComment,
	deleteComment,
	post: { post, totalPages },
	textEditor,
	onChange,
	history,
	location,
	currentUser,
	postLoading,
	users: { Moderator },
}) => {
	useEffect(() => {
		// runs once and on updatePost
		// pageQuery only works once totalPages has been defined
		// totalPages defined after getPost
		getPost(postId, currentPage, history, setPage);

		// eslint-disable-next-line
	}, []);

	// Sets default pageQuery if theres not set
	const currentPage = parseInt(location.search.split("?page=")[1]) || 1;
	// Define page, title and content editor state
	const [page, setPage] = useState(currentPage);
	const [title, setTitle] = useState(post.title);
	const [content, setContent] = useState("");

	// Change content state and raw text to be sent through actions
	const handleChange = (e) => {
		setContent(e.target.value);
		const textToContentState = convertToRaw(
			ContentState.createFromText(e.target.value)
		);
		onChange(textToContentState);
	};

	// Submit comment
	const handleSubmit = () =>
		addComment(textEditor.contentState, postId, history, setPage);

	// Delete post handler
	const handleDeletePost = () => deletePost(postId, history);

	// Update post handler
	const handleUpdate = (plainText) => {
		// plain text from textEditor
		updatePost(postId, title, textEditor.contentState, plainText);
	};

	// Client side pagination
	// Set limit, start and end of a page
	const limit = 6;
	const start = (page - 1) * limit;
	const end = page * limit;
	const minTopPageButtonsAppear = 3;
	const breakpoint = window.screen.width < 1000;

	return post === null || postLoading ? (
		<Spinner />
	) : postEdit ? (
		<div className="Post__editor">
			<ContentEditor
				handleToggle={toggleEditPost}
				title={title}
				setTitle={setTitle}
				handleSubmit={handleUpdate}
				contentState={post.contentState}
				plainText={post.plainText}
				type={"edit"}
			/>
		</div>
	) : (
		<>
			<Link to="/discussion" className="Post__goBack">
				<button>Go Back</button>
			</Link>
			<div className="Post__title-container">
				<h1 className="Post__title">{post.title}</h1>
			</div>
			<PostHead
				Moderator={Moderator}
				post={post}
				currentUser={currentUser}
				toggleEditPost={toggleEditPost}
				handleDeletePost={handleDeletePost}
			/>
			{post && (
				<>
					{post.comments.slice(start, end).length > minTopPageButtonsAppear && (
						<PageButtons
							page={page}
							setPage={setPage}
							totalPages={totalPages}
							postId={postId}
						/>
					)}
					<div className="Post__comments">
						{post.comments.slice(start, end).map((c) => (
							<Comments
								key={c._id}
								img={img}
								contentState={c.contentState}
								id={c._id}
								postId={postId}
								date={c.date}
								user={c.user}
								deleteComment={deleteComment}
								page={page}
								history={history}
								setPage={setPage}
								currentUser={currentUser}
								Moderator={Moderator}
							/>
						))}
					</div>
					<PageButtons
						page={page}
						setPage={setPage}
						totalPages={totalPages}
						postId={postId}
					/>
					<div className="Post__addComment">
						<div className="Post__addComment-top">
							<img
								src={currentUser.photo}
								alt="current user"
								className="Post__commentUser-img"
							/>
							<h2 className="Post__addComment-title">Add Comment</h2>
						</div>
						{breakpoint ? (
							<>
								<textarea
									placeholder="Add comment...."
									className="CreatePost__editor"
									type="text"
									name="editor"
									id="editor"
									value={content}
									onChange={handleChange}
									required></textarea>
								<button
									className="btn btn__submit"
									onClick={() => {
										if (content.length === 0) return;
										setContent("");
										handleSubmit();
									}}>
									Submit
								</button>
							</>
						) : (
							<TextEditor handleSubmit={handleSubmit} />
						)}
					</div>
				</>
			)}
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
	onChange: PropTypes.func.isRequired,
	postEdit: PropTypes.bool.isRequired,
	post: PropTypes.object,
	currentUser: PropTypes.object,
	postLoading: PropTypes.bool.isRequired,
	users: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	postEdit: state.post.postEdit,
	post: state.post,
	textEditor: state.textEditor,
	currentUser: state.auth.currentUser,
	users: state.users,
	postLoading: state.post.postLoading,
});

export default connect(mapStateToProps, {
	getPost,
	addComment,
	toggleEditPost,
	deletePost,
	deleteComment,
	updatePost,
	onChange,
})(Post);
