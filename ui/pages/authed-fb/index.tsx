import * as React from 'react';
import Cookies from 'universal-cookie';

import GlobalStatus from '../../components/globalStatus';
import Header from '../../components/head';
import authService from '../../services/auth.service';
const css = require('./index.scss');

function AuthedFb(props: any) {
	const { thisUser } = props.pageProps;
	return (
		<div>
			<Header />
			<h2 className={css.example}>
				You have logged in successfully as{' '}
				{thisUser.displayName ? thisUser.displayName : 'a Facebook user'}!
			</h2>
		</div>
	);
}

AuthedFb.getInitialProps = async (ctx: any) => {
	let fbJwt: any;
	const isServer = ctx.req;
	// get the previously set cookie if we are coming from another request other than
	// the fbAuth callback, so the user doesn't have to log in with facebook each time
	const cookies = new Cookies(isServer ? ctx.req.headers.cookie : null);
	const cookiefbJwt = cookies.get('fbJwt');

	if (isServer && ctx.query.fbJwt) {
		// get fbJwt from URL and use it to create a cookie for access later
		fbJwt = ctx.query.fbJwt;
		ctx.res.cookie('fbJwt', fbJwt);
	}

	fbJwt = fbJwt || cookiefbJwt;
	if (fbJwt) {
		// user is either coming from fb callback with token in url, or has token in their cookie
		const resp = await authService.checkAuthToken(fbJwt).then(auth => {
			if (auth.success) {
				const thisUser = authService.parseJwt(fbJwt, true);
				return { query: ctx.query, thisUser };
			} else {
				cookies.remove('fbJwt');
				authService.redirectUser('/home', { ctx, status: 301 });
			}
		});
		return resp ? { pageProps: resp } : {};
	} else {
		authService.redirectUser('/home', { ctx, status: 301 });
	}
};

export default GlobalStatus(AuthedFb);
