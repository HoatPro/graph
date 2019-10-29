import history from "./history";

/* eslint-disable import/first */
import _config from '../utils/config';

const config = _config[_config.environment];

export const Auth = async (props) => {
    const {cookies} = props;
    const location = props.location || history.location;
    const query = location.search || "";
    const params = new URLSearchParams(query);
    const authtoken = params.get('token') || cookies.get('authtoken');
    if (authtoken) {
        let url = config.originBackend;
        let response = await fetch(`${url}/raca-api/auth-user`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({access_token: authtoken})
        });
        let data = await response.json();
        if (data.status === 200) {
            cookies.set('authtoken', authtoken, {path: '/', maxAge: 24 * 60 * 60});
            cookies.set('user', JSON.stringify(data.data.user), {path: '/', maxAge: 24 * 60 * 60});
            localStorage.setItem('authtoken', authtoken);
            localStorage.setItem('user', JSON.stringify(data.data.user));
            return 200;
        } else if (data.status === 403) {
            cookies.remove('authtoken');
            cookies.remove('user');
            // redirectTo(config.originRoot + '/openid', {res: null, status: 301});
            return 403;
        } else if (data.status === 404) {
            cookies.remove('authtoken');
            cookies.remove('user');
            // redirectTo(config.originFrontend + '/access', {res: null, status: 301});
            return 404;
        }
    }

    return 403;
};