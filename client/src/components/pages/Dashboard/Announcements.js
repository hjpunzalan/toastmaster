import React from 'react';

const Announcements = () => {
	let width = 750;
	if (window.screen.width < 800) width = 500;
	if (window.screen.width < 550) width = 400;
	if (window.screen.width < 450) width = 350;

	return (
		<div className="Dashboard__left">
			<h1 className="Dashboard__title">Announcements</h1>

			<iframe
				title="Southern River Toastmaster Post"
				src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2FSRTOASTMASTERSCLUB%2Fposts%2F1714806421985710&width=500&show_text=true&appId=2411264755855685&height=441"
				width={width}
				height="441"
				className="Dashboard__facebook"
				scrolling="no"
				frameBorder="0"
				allowtransparency="true"
				allow="encrypted-media"></iframe>
		</div>
	);
};

export default Announcements;
