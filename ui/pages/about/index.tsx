import * as React from 'react';
import Header from '../../components/Header';
const css = require('./index.scss');

function About() {
	return (
		<div>
			<Header />
			<main>
				<h2 className={css.example}>About!</h2>
			</main>
			<div />
		</div>
	);
}

export default About;
