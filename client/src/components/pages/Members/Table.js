import React from 'react';
import Members from './Members';

const Table = ({ users }) => {
	return (
		<table className="MemberList__list">
			<thead>
				<tr>
					<th>Photo</th>
					<th>First Name</th>
					<th>Last Name</th>
					<th>Email</th>
				</tr>
			</thead>
			<tbody>
				{users.map(user => (
					<Members user={user} />
				))}
			</tbody>
		</table>
	);
};

export default Table;
