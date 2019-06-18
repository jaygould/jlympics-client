import * as React from 'react';
import Header from '../../components/Header';
const css = require('./index.scss');

function About() {
	return (
		<div>
			<Header />
			<h2 className={css.example}>About!</h2>
			<div />
		</div>
	);
}

export default About;
