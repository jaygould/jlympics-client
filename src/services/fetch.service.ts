import fetch from 'isomorphic-unfetch';
import Cookies from 'universal-cookie';
import config from '../config';

class FetchService {
	public isofetch(url: string, data: object, type: string): Promise<any> {
		return fetch(`${config.apiUrl}${url}`, {
			body: JSON.stringify({ ...data }),
			headers: config.configHeaders,
			method: type
		})
			.then((response: Response) => response.json())
			.then(this.handleErrors)
			.catch(error => {
				throw error;
			});
	}
	public isofetchAuthed(url: string, data: object, type: string): Promise<any> {
		const cookies = new Cookies();
		const token = cookies.get('authToken');
		return fetch(`${config.apiUrl}${url}`, {
			body: JSON.stringify({ ...data }),
			headers: {
				...config.configHeaders,
				Authorization: 'Bearer ' + token
			},
			method: type
		})
			.then((response: Response) => response.json())
			.then(this.handleErrors)
			.catch(error => {
				throw error;
			});
	}
	public handleErrors(response: string): string {
		if (response === 'TypeError: Failed to fetch') {
			throw Error('Server error.');
		}
		return response;
	}
}

export default new FetchService();
