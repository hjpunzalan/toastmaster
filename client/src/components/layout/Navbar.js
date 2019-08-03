import React, { Fragment } from 'react';
import { Menu } from 'semantic-ui-react';

const Navbar = () => {
	return (
		<Menu color="red" inverted>
			<Menu.Item name="editorials">Editorials</Menu.Item>

			<Menu.Item name="reviews">Reviews</Menu.Item>

			<Menu.Item name="upcomingEvents">Upcoming Events</Menu.Item>
			<Menu.Item name="logout" position="right" />
		</Menu>
	);
};

export default Navbar;
