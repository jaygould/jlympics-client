import React, { Component } from 'react';
import { IGlobalAuth } from '../types/global.types';

import AuthService from './auth.service';

const AuthCtx = React.createContext<IGlobalAuth | null>(null);

class AuthProvider extends Component {
	state = {
		isLoggedIn: false,
		user: null
	};

	componentDidMount() {
		// localstorage only exists on client side, so only update here
		// this causes the user info to only be retrieved when the component is
		// mounted, so there's a slight delay with the info showing
		this.setState({
			isLoggedIn:
				localStorage.getItem('isLoggedIn') != undefined
					? JSON.parse(localStorage.getItem('isLoggedIn') || '')
					: false,
			user: localStorage.getItem('user')
				? JSON.parse(localStorage.getItem('user') || '')
				: false
		});
	}

	render() {
		return (
			<AuthCtx.Provider
				value={{
					isLoggedIn: this.state.isLoggedIn,
					user: this.state.user,
					addUserDetails: (user: any) => {
						this.setState(
							{
								isLoggedIn: true,
								user
							},
							() => {
								if (localStorage) {
									localStorage.setItem('isLoggedIn', JSON.stringify('true'));
									localStorage.setItem('user', JSON.stringify(user));
								}
							}
						);
					},
					logout: () => {
						this.setState(
							{
								isLoggedIn: false,
								email: null
							},
							() => {
								AuthService.logout();
								localStorage.removeItem('isLoggedIn');
								localStorage.removeItem('user');
							}
						);
					}
				}}
			>
				{this.props.children}
			</AuthCtx.Provider>
		);
	}
}
export default AuthProvider;
export const AuthConsumer = AuthCtx.Consumer;
