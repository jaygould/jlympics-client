const css = require('./UserProfile.scss');

import * as React from 'react';

import { IGlobalAuth } from '../types/global.types';

interface IProps {
	globalAuth: IGlobalAuth;
}

function UserProfile(props: IProps) {
	const { globalAuth } = props;
	if (globalAuth.user) {
		const { email, displayName, displayPhoto } = globalAuth.user;
		return (
			<React.Fragment>
				{globalAuth.isLoggedIn ? (
					<div className={css.userProfile}>
						<div className={css.userName}>
							<span>{email || displayName}</span>
						</div>
						{displayPhoto ? (
							<div className={css.userPhoto}>
								<img src={displayPhoto} />
							</div>
						) : null}
					</div>
				) : null}
			</React.Fragment>
		);
	} else {
		return null;
	}
}
export default UserProfile;
