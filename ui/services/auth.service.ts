import jwt from 'jsonwebtoken';
import Router from 'next/router';
import Cookies from 'universal-cookie';
import fetchService from './fetch.service';

import { ILoginIn, IRegisterIn } from '../types/auth.types';
import { IRedirectOptions } from '../types/global.types';

class AuthService {
	public loginUser({ email, password }: ILoginIn): Promise<any> {
		return fetchService.isofetch(`/auth/login`, { email, password }, 'POST');
	}

	public registerUser({
		firstName,
		lastName,
		email,
		password
	}: IRegisterIn): Promise<any> {
		return fetchService.isofetch(
			`/auth/register`,
			{ firstName, lastName, email, password },
			'POST'
		);
	}

	public checkAuthToken(authToken: string): Promise<any> {
		return fetchService.isofetch(`/auth/validate`, { authToken }, 'POST');
	}

	public saveTokens(authToken: string): Promise<any> {
		const cookies = new Cookies();
		cookies.set('authToken', authToken, { path: '/' });
		return Promise.resolve();
	}

	public logout(): void {
		const cookies = new Cookies();
		cookies.remove('authToken');
		cookies.remove('fbJwt');
		Router.push('/home');
		return;
	}

	public parseJwt(token: string, isServer: any) {
		if (isServer) {
			return jwt.decode(token);
		} else {
			const base64Url = token.split('.')[1];
			const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
			return JSON.parse(window.atob(base64));
		}
	}

	public redirectUser(dest: string, options: IRedirectOptions) {
		const {
			ctx: { res },
			status
		} = options;
		if (res) {
			res.writeHead(status || 302, { Location: dest });
			res.end();
		} else {
			if (dest[0] === '/' && dest[1] !== '/') {
				Router.push(dest);
			} else {
				window.location.href = dest;
			}
		}
	}

	public isAuthPage(page: string) {
		if (
			page === '/home' ||
			page === '/register' ||
			page === '/about' ||
			page === '/authed-fb'
		) {
			return false;
		} else {
			return true;
		}
	}

	public removeCookie(ctx: any, cookie: any) {
		const isServer = ctx.req;
		const cookies = new Cookies(isServer ? ctx.req.headers.cookie : null);
		cookies.remove(ctx, cookie);
	}

	public fbJwtMiddleware(ctx: any) {
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
		return fbJwt;
	}
}
export default new AuthService();
