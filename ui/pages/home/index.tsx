import { Field, Form, Formik, FormikActions } from 'formik';
import Link from 'next/link';
import Router from 'next/router';
import * as React from 'react';

import Header from '../../components/head';
import GlobalAuth from '../../components/HocGlobalAuth';
import GlobalStatus from '../../components/HocGlobalStatus';

const css = require('./index.scss');

import { IGlobalAuth, IGlobalStatus } from '../../types/global.types';

interface IProps {
	globalStatus: IGlobalStatus;
	globalAuth: IGlobalAuth;
}

function Home(props: IProps) {
	const { globalStatus, globalAuth } = props;
	return (
		<div>
			<Header />
			<h2 className={css.example}>Welcome to Jlympics!</h2>
		</div>
	);
}

export default GlobalAuth(GlobalStatus(Home));
