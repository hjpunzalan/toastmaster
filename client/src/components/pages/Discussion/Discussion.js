import React from 'react';
import img from '../../../img/anonymous.png';
import DiscussionHead from './DiscussionHead';
import DiscussionPost from './DiscussionPost';

const Discussion = () => {
	const count = 4;
	const count2 = 0;
	const text = `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maiores
					pariatur consectetur fuga repellat porro amet assumenda quidem fugit
					obcaecati, sapiente quibusdam, voluptates, at magnam! Quos dicta
                    facilis incidunt soluta fuga.`;
	const text2 = `Test`;

	return (
		<div className="Discussion">
			<h2 className="Discussion__title">Welcome Jonathan!</h2>
			<DiscussionHead />
			<DiscussionPost img={img} count={count} text={text} />
			<DiscussionPost img={img} count={count} text={text} />
			<DiscussionPost img={img} count={count} text={text} />
			<DiscussionPost img={img} count={count} text={text} />
			<DiscussionPost img={img} count={count2} text={text2} />
			<DiscussionPost img={img} count={count} text={text2} />
		</div>
	);
};

export default Discussion;
