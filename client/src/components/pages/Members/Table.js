import React from 'react';
import Members from './Members';

const Table = ({ users, Moderator, active }) => {
	return (
		<table className="MemberList__list">
			<thead>
				<tr>
					<th>Photo</th>
					<th>First Name</th>
					<th>Last Name</th>
					<th>Email</th>
					{Moderator && (active ? <th>Deactivate</th> : <th>Activate</th>)}
				</tr>
			</thead>
			<tbody>
				{users.map(user => (
					<Members
						key={user._id}
						user={user}
						Moderator={Moderator}
						active={active}
					/>
				))}
			</tbody>
		</table>
	);
};

export default Table;
