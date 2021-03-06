import React, { Fragment } from "react";
import spinner from "../../img/spinner.gif";

const SpinnerSmall = () => (
	<Fragment>
		<img
			src={spinner}
			style={{ width: "75px", margin: "0 auto 0 auto", display: "block" }}
			alt="Loading..."
		/>
	</Fragment>
);

export default SpinnerSmall;
