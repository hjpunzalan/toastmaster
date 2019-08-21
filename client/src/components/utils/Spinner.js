import React, { Fragment } from 'react';
import spinner from '../../img/spinner.gif';

export default () => (
	<Fragment>
		<img
			src={spinner}
			style={{ width: '150px', margin: '20% auto 0 auto', display: 'block' }}
			alt="Loading..."
		/>
	</Fragment>
);
