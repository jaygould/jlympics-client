import { Field, Form, Formik, FormikActions } from 'formik';
import Link from 'next/link';
import Router from 'next/router';
import * as React from 'react';

import Header from '../../components/Header';
import GlobalAuth from '../../components/HocGlobalAuth';
import GlobalStatus from '../../components/HocGlobalStatus';

const css = require('./index.scss');

import authService from '../../services/auth.service';
import { ILoginIn } from '../../types/auth.types';
import { IGlobalAuth, IGlobalStatus } from '../../types/global.types';

interface IProps {
	globalStatus: IGlobalStatus;
	globalAuth: IGlobalAuth;
}

function AdminLogin(props: IProps) {
	const { globalStatus, globalAuth } = props;
	return (
		<div>
			<Header />
			<main>
				<Formik
					initialValues={{
						email: '',
						password: ''
					}}
					onSubmit={(
						values: ILoginIn,
						{ setSubmitting }: FormikActions<ILoginIn>
					) => {
						authService
							.loginUser({ email: values.email, password: values.password })
							.then(resp => {
								setSubmitting(false);
								if (resp.success) {
									authService.saveTokens(resp.authToken).then(() => {
										globalAuth.addUserDetails({ email: values.email });
										Router.push('/admin-dashboard');
									});
								} else {
									globalStatus.addMessage(resp.message);
								}
							})
							.catch();
					}}
					render={() => (
						<Form>
							<div>
								<label htmlFor="email">Email</label>
								<Field id="email" name="email" placeholder="" type="email" />
							</div>
							<div>
								<label htmlFor="password">Password</label>
								<Field id="password" name="password" placeholder="" type="password" />
							</div>
							<button type="submit" style={{ display: 'block' }}>
								Submit
							</button>
						</Form>
					)}
				/>
				{/* register is taken out of production */}
				{/* <div>
					Click{' '}
					<Link href="/register">
						<a>here</a>
					</Link>{' '}
					to register
				</div> */}
			</main>
		</div>
	);
}

export default GlobalAuth(GlobalStatus(AdminLogin));
