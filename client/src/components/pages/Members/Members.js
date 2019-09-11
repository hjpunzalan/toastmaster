import React from 'react';
import { MdEmail } from 'react-icons/md';
import img from '../../../img/anonymous.png';

const List = ({ user }) => {
	return (
		<tr key={user._id} className="MemberList__member">
			<td>
				<img
					className="MemberList__member-photo"
					src={user.photo || img}
					alt="user avatar"
				/>
			</td>
			<td>
				<span className="MemberList__member-name">{user.firstName}</span>
			</td>
			<td>
				<span className="MemberList__member-name">{user.lastName}</span>
			</td>
			<td>
				<span
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center'
					}}>
					<a
						href={`mailto:${user.email}`}
						target="_top"
						className="MemberList__member-email">
						<MdEmail />
					</a>
					{user.email}
				</span>
			</td>
		</tr>
	);
};

export default List;
