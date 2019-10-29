import React from 'react'
import {Menu, Accordion} from 'semantic-ui-react'
import {Link} from "react-router-dom";
import TextIcon from "../Extension/TextIcon";
import {connect} from "react-redux";
import {withRouter} from 'react-router-dom'
import {sideMenuA} from '../../redux/_actions/sideMenuA';
import PropTypes from "prop-types";
import Cookies from 'js-cookie';
import _config from "../../utils/config";
import _ from 'lodash';

const prevURL = _config[_config.environment].prevURL;

class SideMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {smallMenu: false};
    }

    static propTypes = {
        sideMenuR: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    handleClick = (e, titleProps) => {
        const {index} = titleProps;
        const {activeIndex} = this.props.sideMenuR;
        const newIndex = activeIndex === index ? -1 : index;
        this.props.dispatch(sideMenuA.sendIndex(newIndex));
        // this.setState({ activeIndex: newIndex })
    };

    handleItemClick = (e) => {
        // this.setState({activeItem: name});
        // history.push(name);
        // this.props.dispatch(sideMenuA.sendIndex(-1));
    };

    componentDidMount() {
        const path = this.props.location.pathname;
        const index = path.split('/');
        if (index.length === 2) {
            this.props.dispatch(sideMenuA.activeItem(path));
            this.props.dispatch(sideMenuA.sendIndex(-1));
        } else if (index.length === 3) {
            this.props.dispatch(sideMenuA.activeItem(`/${index[2]}`));
            this.props.dispatch(sideMenuA.sendIndex(index[1]));
        } else if (index.length === 4) {
            this.props.dispatch(sideMenuA.activeItem(`/${index[3]}`));
            this.props.dispatch(sideMenuA.sendIndex(index[2]));
        }
    }

    componentWillReceiveProps(nextProps) {
        const iconDropdown = document.querySelectorAll('.title>i.dropdown.icon');
        const itemSidebar = document.querySelectorAll('.item-side-bar');
        if (nextProps.sideMenuR.smallMenu !== this.state.smallMenu) {
            this.setState({smallMenu: nextProps.sideMenuR.smallMenu});

            if (nextProps.sideMenuR.smallMenu) {
                // a.style.cssText = 'display:none !important';
                iconDropdown.forEach(el => el.style.display = 'none');
                itemSidebar.forEach(item => {
                    const temp = item.innerHTML;
                    item.innerHTML = item.getAttribute("name");
                    item.setAttribute("name", temp);
                    item.style.cssText = 'padding-left: 0px';
                })

            } else {
                iconDropdown.forEach(el => el.style.display = 'inline');
                itemSidebar.forEach(item => {
                    const temp = item.innerHTML;
                    item.innerHTML = item.getAttribute("name");
                    item.setAttribute("name", temp);
                    item.style.cssText = 'padding-left: 20px';
                })
            }
        }
    }

    // changeSize = () => this.setState({smallSidebar: !this.props.smallMenu});

    getMenu = () => {
        // let rules = Cookies.get('user');
        // rules = rules ? JSON.parse(rules) : [];
        // console.log(rules);
        const userData = localStorage.getItem('user');
        // const authToken=localStorage.getItem('authtoken');
        //  console.log(authToken);
        let test = JSON.parse(userData);
        console.log(test);
        let arrayData = test.permissions;
        let children = []
        arrayData.map(data => {
            children = data.children;
        });
        const activeIndex = this.props.sideMenuR.activeIndex;
        const {smallMenu, activeItem} = this.props.sideMenuR;
        return (
            <Accordion as={Menu} fixed='left' borderless className={(smallMenu ? 'small-side' : '') + ' side'} vertical>
                <Link to="/">
                    <Menu.Item as='div' active={activeItem === '/'} onClick={this.handleItemClick}>
                        <TextIcon hideText={smallMenu} color='blue' name='home'>
                            Dashboard
                        </TextIcon>
                    </Menu.Item>
                </Link>
                {arrayData.map((r, i) => {
                    const children = r.children;
                    const routeKey = r.routeKey;
                    const routeName = r.routeName;
                    const icon = r.icon;
                    const actionIndex = routeKey.replace('/', '');

                    if (_.size(children) > 0) {
                        return <Menu.Item key={i}>
                            <Accordion.Title
                                active={activeIndex === actionIndex}
                                content={<TextIcon hideText={smallMenu} name={icon}>
                                    {routeName}
                                </TextIcon>}
                                index={actionIndex}
                                onClick={this.handleClick}
                            />
                            <Accordion.Content active={activeIndex === actionIndex}>
                                <Menu vertical secondary>
                                    {children.map((rc, j) => {
                                        const routeCKey = rc.routeKey;
                                        return <Link key={j} to={prevURL + routeKey + routeCKey}>
                                            <Menu.Item active={activeItem === routeCKey}>
                                                <div className={'item-side-bar'}
                                                     name={rc.shortName}>{rc.routeName}</div>
                                            </Menu.Item>
                                        </Link>;
                                    })}
                                </Menu>
                            </Accordion.Content>
                        </Menu.Item>
                    } else {
                        return <Link prefetch href={routeKey}>
                            <Menu.Item active={activeItem === routeKey} onClick={this.handleItemClick}>
                                <TextIcon hideText={smallMenu} name={icon}>
                                    {routeName}
                                </TextIcon>
                            </Menu.Item>
                        </Link>
                    }
                })}


            </Accordion>
        )
    };

    render() {
        const {smallMenu} = this.props.sideMenuR;
        let _class = '';
        if (smallMenu) {
            _class = 'small-side ';
        } else {
            _class = 'large-side ';
        }


        return (
            <div ref="sideMenu" className='parent'>
                {/* <Login></Login> */}
                <div className={_class + 'side'}>
                    {this.getMenu()}
                </div>
                <div className={(smallMenu ? 'small-content ' : '') + 'content-layout'}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({sideMenuR}) => ({sideMenuR});

export default withRouter(connect(mapStateToProps, null)(SideMenu));