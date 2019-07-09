import React, { Component } from 'react';

// Handles error messages which come through the URL as a query string.
// These error messages may happen if there's a redirect from the server due to
// the passport auth.

const GlobalErrorHandler = (AppComponent: any) =>
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
		componentDidMount() {
			const { query, globalStatus } = this.props;
			if (query && query.success == 'false' && query.message) {
				globalStatus.addMessage(query.message);
			}
		}

		render() {
			return <AppComponent {...this.props} />;
		}
	};

export default GlobalErrorHandler;
