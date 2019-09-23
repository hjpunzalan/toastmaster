import React, { useEffect } from 'react';
import { MdEmail } from 'react-icons/md';
import img from '../../../img/anonymous.png';

const SmallList = ({
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
		<div className="SmallList">
			{users.map(user => (
				<div className="SmallList__user" key={user._id}>
					<img
						className="SmallList__photo"
						src={user.photo || img}
						alt="avatar"
					/>
					<div className="SmallList__body">
						<div className="SmallList__details">
							<span className="SmallList__name">
								{user.firstName}&nbsp;{user.lastName}
							</span>
							{(active || Moderator) && (
								<a
									className="SmallList__email"
									href={`mailto:${user.email}`}
									target="_top">
									<MdEmail />
									<span>{user.email}</span>
								</a>
							)}
						</div>
						{Moderator && (
							<div className="SmallList__moderator">
								{Moderator && currentUser.role === 'admin' && active && (
									<div className="SmallList__committee">
										<strong>Committee</strong>
										<select
											defaultValue={
												user.role === 'committee' || user.role === 'admin'
											}
											onChange={e => changeRole(user._id, e.target.value)}>
											<option value={true}>Yes</option>
											<option value={false}>No</option>
										</select>
									</div>
								)}
								{active ? (
									<div
										className="SmallList__deactivate"
										onClick={() => deActivateUser(user._id)}>
										Deactivate
									</div>
								) : (
									<div
										className="SmallList__activate"
										onClick={() => activateUser(user._id)}>
										Activate
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			))}
		</div>
	);
};

export default SmallList;
