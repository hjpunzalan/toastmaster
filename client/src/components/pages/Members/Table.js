import React, { useEffect } from 'react';
import Members from './Members';

const Table = ({
	users,
	Moderator,
	active,
	deActivateUser,
	activateUser,
	currentUser,
	setActive,
	setAlert,
	resetAlert,
	changeRole
}) => {
	useEffect(() => {
		if (users.length === 0) {
			resetAlert();
			setActive(true);
			setAlert('Currently there are no unactive users', 'fail');
		}
		// eslint-disable-next-line
	}, [users]);
	return (
		<table className="MemberList__list">
			<thead>
				<tr>
					<th>Photo</th>
					<th>First Name</th>
					<th>Last Name</th>
					{(Moderator || active) && <th>Email</th>}
					{Moderator && currentUser.role === 'admin' && active && (
						<th>Committee</th>
					)}
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
						deActivateUser={deActivateUser}
						activateUser={activateUser}
						currentUser={currentUser}
						changeRole={changeRole}
					/>
				))}
			</tbody>
		</table>
	);
};

export default Table;
