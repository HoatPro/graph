import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import '../assets/css/loginPage.css';
import {Button, Form, Grid, Header, Image, Message, Segment} from 'semantic-ui-react';
import axios from 'axios';
import api from '../redux/_actions/api';
import Cookies from 'js-cookie';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            loggingIn: false,
            errorMessage: ''
        }
    }

    handleChangeInput(e) {
        const {name, value} = e.target;
        this.setState({
            [name]: value
        })
    }

    handleLogin = async () => {
        if (!this.state.loggingIn) {

            this.setState({loggingIn: true, errorMessage: ''});
            let params = {
                email: this.state.email, password: this.state.password
            };
            let _this = this;

            await axios.post(api.login, params)
                .then(function (resp) {
                    if (resp.status === 200) {
                        let data = resp.data;
                        if (data.status === 200) {
                            data = data.data;
                            Cookies.set("authtoken", data.authtoken);
                            Cookies.set("user", data.user);
                            history.push('/');
                        } else {
                            _this.setState({loggingIn: false, errorMessage: 'Email or Password is invalid.'});
                        }

                    } else {
                        _this.setState({loggingIn: false, errorMessage: 'Email or Password is invalid.'});
                    }
                    // _this.setState({loggingIn: false});
                });


            //     fetch(API_URL+'/auth', {
            //     method: 'POST', headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ email: this.state.email, password: this.state.password })
            //   })
            //     .then( r => r.json() )
            //   .then( resp => {

            //       /* returns a JSON object {result: "success"} or {error:""} with 400 status */

            //       if(!resp.result) {
            //           this.setState({errorMessage: 'Email or Password is invalid.'})
            //       }
            //       else {
            //           document.cookie = 'authtoken=' + resp.token;
            //           window.location = "/dashboard";
            //       }

            //       this.setState({loggingIn: false });
            //   })
        }
    };

    render() {
        let {email, password, loggingIn} = this.state;
        return (
            <Grid textAlign='center'
                  style={{padding: 0, margin: 0, height: '100%', width: '100%', backgroundColor: '#c5c7ccc7'}}
                  verticalAlign='middle'>
                <Grid.Column style={{maxWidth: 450}}>
                    {/* <Image src='/static/images/logoRaca.png' />  */}
                    <Form size='large'>
                        <Segment>
                            <Header as='h1' color='blue' textAlign='center'>
                                Login to Raca
                            </Header>
                            {
                                this.state.errorMessage !== '' ?
                                    <Message negative>
                                        <Message.Header> {this.state.errorMessage} </Message.Header>
                                    </Message>
                                    : null
                            }

                            <Form.Input
                                fluid icon='user'
                                iconPosition='left'
                                placeholder='Email'
                                name='email'
                                value={email}
                                onChange={this.handleChangeInput.bind(this)}
                                required
                            />
                            <Form.Input
                                fluid
                                icon='lock'
                                iconPosition='left'
                                placeholder='Password'
                                type='password'
                                name='password'
                                value={password}
                                onChange={this.handleChangeInput.bind(this)}
                                required
                            />
                            {/* <Link prefetch to='/'> */}
                            <Button color='blue' fluid size='large' onClick={(e) => this.handleLogin(e)}>
                                {loggingIn ? 'Logging in...' : 'Log In'}
                            </Button>
                            {/* </Link> */}
                        </Segment>
                    </Form>
                    <Message icon>
                        {/*<Image size='tiny' src='/static/images/logoFtel.png'/>*/}
                        <Message.Content>
                            Copyright © 2019, NOC - FPT Telecom
                        </Message.Content>
                    </Message>
                </Grid.Column>
            </Grid>
        )
    }
}

export default Login;