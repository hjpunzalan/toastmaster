import React from 'react';
import PostComment from './PostComment';
import { Link } from 'react-router-dom';
import img from '../../../img/anonymous.png';

const Post = () => {
	const text = `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maiores
					pariatur consectetur fuga repellat porro amet assumenda quidem fugit
					obcaecati, sapiente quibusdam, voluptates, at magnam! Quos dicta
                    facilis incidunt soluta fuga.`;
	return (
		<div>
			<div className="Post__post">
				<div className="Post__postUser">
					<img src={img} alt="user-logo" className="Post__postUser-img" />
					<span className="Post__postUser-name">Random User</span>
				</div>
				<div className="Post__postBody">
					<h3 className="Post__postBody-title">Title</h3>
					<p className="Post__postBody-text">{text}</p>
					<span className="Post__postBody-date">Date posted: 8/08/2019</span>
					<div className="Post__postButtons">
						<Link className="Post__postButtons-edit" to="/discussion/post/edit">
							Edit
						</Link>
						<button className="Post__postButtons-delete">Delete</button>
					</div>
				</div>
			</div>
			<PostComment img={img} text={text} />
			<PostComment img={img} text={text} />
			<PostComment img={img} text={text} />
		</div>
	);
};

export default Post;
