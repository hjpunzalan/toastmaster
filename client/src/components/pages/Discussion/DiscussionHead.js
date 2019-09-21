import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import CreatePost from '../../utils/CreatePost';

const DiscussionHead = ({
	createPost,
	contentState,
	edit,
	toggleCreatePost,
	history,
	searchPost,
	setPage,
	loading
}) => {
	const [title, setTitle] = useState('');
	const [search, setSearch] = useState('');

	const handleToggle = () => {
		setTitle(''); //when create post is canceled
		toggleCreatePost();
	};

	const handleSubmit = plainText => {
		createPost(title, contentState, history, plainText);
	};

	const handleSearch = e => {
		e.preventDefault();
		searchPost(search);
		setPage(1);
	};

	const handleReset = e => {
		setSearch('');
		searchPost('');
		setPage(1);
	};
	return (
		<div className="Discussion__head">
			{!edit ? (
				<>
					<button
						className="btn btn__submit Discussion__create"
						onClick={handleToggle}>
						Create a new post
					</button>
					<div className="Discussion__search">
						<form onSubmit={handleSearch}>
							<input
								type="text"
								placeholder="Search all posts"
								value={search}
								onChange={e => setSearch(e.target.value)}
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
						<CreatePost
							handleSubmit={handleSubmit}
							handleToggle={handleToggle}
							title={title}
							setTitle={setTitle}
							type={'Post'}
						/>
					</div>
				)
			)}
		</div>
	);
};

export default DiscussionHead;
