import React, { Component } from 'react';
import { StatusConsumer } from '../services/status.context';

const GlobalStatus = (AppComponent: any) =>
	class AppWrapComponent extends Component {
		static getInitialProps(ctx: any) {
			// required to pass down the initial props to the child component
			if (AppComponent.getInitialProps) {
				return AppComponent.getInitialProps(ctx);
			}
		}
		constructor(props: any) {
			super(props);
			this.state = {};
		}
		componentDidMount() {}

		render() {
			return (
				<StatusConsumer>
					{context => <AppComponent {...this.props} globalStatus={context} />}
				</StatusConsumer>
			);
		}
	};

export default GlobalStatus;
