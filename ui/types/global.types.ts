import { NextContext } from 'next';
import { IFitbitUser } from './fitbit.types';

export interface IGlobalStatus {
	message: string;
	addMessage: (message: string) => any;
}

export interface IGlobalAuth {
	isLoggedIn: boolean;
	user: IFitbitUser | null;
	addUserDetails: ({
		displayName,
		email
	}: {
		displayName?: string;
		email?: string;
	}) => void;
	logout: () => void;
}

export interface IAppContext {
	Component: any;
	ctx: NextContext;
}

export interface IRedirectOptions {
	ctx: NextContext;
	status: number;
}
