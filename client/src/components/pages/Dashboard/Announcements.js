import React from 'react';

const Announcements = () => {
	let width = 750;
	let height = 588;
	if (window.screen.width < 1150) {
		width = 500;
		height = 441;
	}
	if (window.screen.width < 720) {
		width = 400;
		height = 398;
	}
	if (window.screen.width < 450) {
		width = 350;
		height = 366;
	}

	return (
		<div className="Dashboard__left">
			<div className="Dashboard__title">
				Announcements
				<button className="btn btn__submit">Post new announcement</button>
			</div>
			<div className="Dashboard__announcements">
				<iframe
					className="Dashboard__facebook"
					title="Southern River Toastmaster Facebook"
					src={`https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2FSRTOASTMASTERSCLUB%2Fposts%2F1714806421985710&width=500&show_text=true&appId=2411264755855685&height=${height}`}
					width={width}
					height={height}
					scrolling="no"
					frameBorder="0"
					allowtransparency="true"
					allow="encrypted-media"></iframe>

				<iframe
					className="Dashboard__facebook"
					title="Southern River Toastmaster Facebook"
					src={`https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2FSRTOASTMASTERSCLUB%2Fposts%2F1714806421985710&width=500&show_text=true&appId=2411264755855685&height=${height}`}
					width={width}
					height={height}
					scrolling="no"
					frameBorder="0"
					allowtransparency="true"
					allow="encrypted-media"></iframe>
			</div>
		</div>
	);
};

export default Announcements;
