import React, { useState } from "react";
import { FaSearch, FaPlusCircle } from "react-icons/fa";
import ContentEditor from "../../utils/ContentEditor";

const DiscussionHead = ({
	createPost,
	contentState,
	edit,
	toggleCreatePost,
	history,
	searchPost,
	setPage,
	loading,
	setIsSearch,
	getAllPost,
}) => {
	const [title, setTitle] = useState("");
	const [search, setSearch] = useState("");

	const handleToggle = () => {
		setTitle(""); //when create post is canceled
		toggleCreatePost();
	};

	const handleSubmit = (plainText) => {
		createPost({ title, contentState, history, plainText });
	};

	const handleSearch = (e) => {
		e.preventDefault();
		// Configures next page api request
		setIsSearch(search);
		// Search post
		searchPost(search);
		// Reset page number
		setPage(1);
	};

	const handleReset = (e) => {
		// Clear search bar
		setSearch("");
		// Configures next page api request back to normal
		setIsSearch(false);
		// Get all post again
		getAllPost();
		// Reset page number
		setPage(1);
	};
	return (
		<div className="Discussion__head">
			{!edit ? (
				<>
					<button
						className="btn btn__submit Discussion__create"
						onClick={handleToggle}>
						Create post
					</button>
					<FaPlusCircle className="Discussion__create-small" onClick={handleToggle}/>
					<div className="Discussion__search">
						<form onSubmit={handleSearch}>
							<input
								type="text"
								placeholder="Search all posts"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
							<button className="Discussion__search-searchIcon">
								<FaSearch />
							</button>
						</form>
						<button
							className="Discussion__search-reset btn"
							onClick={handleReset}>
							Reset
						</button>
					</div>
				</>
			) : (
				!loading && (
					<div className="Discussion__editor">
						<ContentEditor
							handleSubmit={handleSubmit}
							handleToggle={handleToggle}
							title={title}
							setTitle={setTitle}
							type={"createPost"}
						/>
					</div>
				)
			)}
		</div>
	);
};

export default DiscussionHead;
