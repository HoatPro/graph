import React from 'react';
import {connect} from 'react-redux'
import {sideMenuA} from '../../redux/_actions/sideMenuA';
import {Icon, Image, Input, Menu, Button} from 'semantic-ui-react';
import _config from '../../utils/config';
import logo from '../../static/images/icons8-r.png'
import avatar from '../../static/images/user.png'
import Cookies from 'js-cookie';
import ReactDOM from "react-dom";

const config = _config[_config.environment];

class TopMenu extends React.Component {

    componentDidMount() {
        const mini = this.isMiniMenu();
        if (mini) this.props.dispatch(sideMenuA.toggleMenu(true));
    }

    doSearch(event) {
        console.log("search");
        // this.props.actions.search(event.target.value);
    }

    toggleMenu = () => {
        this.props.dispatch(sideMenuA.toggleMenu())
    };

    handleLogout() {
        Cookies.remove("authtoken");
        Cookies.remove("user");
        Cookies.remove("redirect");
        // axios.get('https://auth.csoc.fpt.net/accounts/logout');
        const url = `${config.originRoot}/openid/logout`;
        // localStorage.removeItem('user');
        // localStorage.removeItem('authtoken');
        window.open(url, '_self')
        // Router.push(url);
    }

    isMiniMenu() {
        const side = ReactDOM.findDOMNode(this.refs.menu);
        let mini = false;

        if (side) {
            const parent = side.parentElement;
            if (parent) mini = parent.clientWidth < 1024;
        }
        return mini;
    }

    render() {
        const {smallMenu} = this.props.sideMenuR;
        let user = Cookies.get('user');
        let username = 'username';
        const data=localStorage.getItem('user');
        const dataUser=JSON.parse(data);
        if(dataUser){
            username=dataUser.username;
        }
        // if (user) {
        //     user = JSON.parse(user);
        //     username = user.username;
        // }
        return (
            <Menu ref='menu' fixed="top" className="top-menu">

                {smallMenu ?
                    (<Menu.Item className="logo-space-menu-item small-side">
                        <div className="display-inline logo-space">
                            <Image src={logo}/>
                        </div>
                    </Menu.Item>) :
                    (<Menu.Item className="logo-space-menu-item large-side">
                        <div className="display-inline logo-space">
                            <Image src={logo}/>
                            <p className="project-name">RACA</p>
                        </div>
                    </Menu.Item>)
                }


                <Menu.Item
                    className="no-border"
                    onClick={this.toggleMenu}
                >
                    <Icon name="bars"/>
                </Menu.Item>

                <Menu.Item className="no-border drop-left-padding">
                    <Input
                        className="icon"
                        icon="search"
                        placeholder="Search..."
                        onChange={this.doSearch.bind(this)}
                    />
                </Menu.Item>

                <Menu.Menu position="right">
                    {/* <Menu.Item className="no-border" position="right"> */}
                    {/* <Notification /> */}
                    {/* <Label
                className="label-on-corner"
                color="teal"
                size={"mini"}
                floating
                circular
              >
                22
              </Label> */}
                    {/* </Menu.Item> */}

                    <Menu.Item className="no-border" position="right">
                        <div className="display-inline">
                            <Button animated size='tiny' onClick={this.handleLogout}>
                                <Button.Content visible>
                                    <Image avatar spaced='right' src={avatar}/>
                                    <span>{username}</span>
                                </Button.Content>
                                <Button.Content hidden>Log Out</Button.Content>
                            </Button>
                        </div>
                    </Menu.Item>
                </Menu.Menu>
            </Menu>
        )
    }
}

const mapStateToProps = ({sideMenuR}) => ({sideMenuR});

export default connect(mapStateToProps, null)(TopMenu);
