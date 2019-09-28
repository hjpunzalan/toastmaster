import React from 'react';
import { Link } from 'react-router-dom';
import scrollToTop from '../../../utils/scrollToTop';

const PageButtons = ({ page, setPage, totalPages, postId }) => {
	// Rendering page buttons
	let nextPage, previousPage;
	if (totalPages > 1 && page !== totalPages)
		nextPage = (
			<Link
				to={`/discussion/post/${postId}?page=${page + 1}`}
				className="Post__page-buttons Post__page-next"
				onClick={() => {
					setPage(page + 1);
					scrollToTop();
				}}>
				Next
			</Link>
		);
	if (page > 1)
		previousPage = (
			<Link
				to={`/discussion/post/${postId}?page=${page - 1}`}
				className="Post__page-buttons Post__page-prev"
				onClick={() => {
					setPage(page - 1);
					scrollToTop();
				}}>
				Previous
			</Link>
		);

	return (
		<div className="Post__page">
			{previousPage}
			{page > 1 || totalPages > 1 ? <>Page {page}</> : ''}
			{nextPage}
		</div>
	);
};

export default PageButtons;
