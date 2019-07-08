import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const { API_URL } = publicRuntimeConfig;
export default {
	siteName: 'Trackletics',
	siteTag: 'Fitness competition app',
	configHeaders: {
		Accept: 'application/json',
		'Content-Type': 'application/json'
	},
	apiUrl: `${API_URL}/v1`
};
