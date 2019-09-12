import React from 'react';
import { MdEmail } from 'react-icons/md';
import { FaUserTimes, FaUserPlus } from 'react-icons/fa';
import img from '../../../img/anonymous.png';

const List = ({ user, Moderator, active, deActivateUser, activateUser }) => {
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
			{(Moderator || active) && (
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
			)}
			{Moderator &&
				(active ? (
					<td>
						<button
							className="btn btn__delete-xs"
							onClick={() => deActivateUser(user._id)}>
							<FaUserTimes className="MemberList__deactivate" />
						</button>
					</td>
				) : (
					<td>
						<button className="btn btn__edit-xs">
							<FaUserPlus
								className="MemberList__activate"
								onClick={() => activateUser(user._id)}
							/>
						</button>
					</td>
				))}
		</tr>
	);
};

export default List;
