import React from 'react';

const Announcements = () => {
	return (
		<div className="Dashboard__left">
			<h1 className="Dashboard__title">Member's Dashboard</h1>
			<p className="Dashboard__label">
				Here you will find club guidelines and resources available to its
				members.
			</p>
			<hr />
			<iframe
				src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2FSRTOASTMASTERSCLUB%2Fposts%2F1714806421985710&width=500&show_text=true&appId=2411264755855685&height=441"
				width={window.screen.width < 550 ? 350 : 500}
				height="441"
				style={{ border: 'none', overflow: 'hidden' }}
				scrolling="no"
				frameborder="0"
				allowTransparency="true"
				allow="encrypted-media"></iframe>
		</div>
	);
};

export default Announcements;
