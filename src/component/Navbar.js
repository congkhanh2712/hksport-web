import { Component } from "react";
import React from 'react';
import Button from './Button';
import './Navbar.css'
import Tooltip from '@material-ui/core/Tooltip';
import Dropdown from './Dropdown';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Badge from '@material-ui/core/Badge';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import { Redirect, Link } from 'react-router-dom';
import fbApp from '../Firebase';
import instance from "../AxiosConfig";

export default class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            click: false,
            dropdown: false,
            search: "",
            redirectSearch: false,
            cartLength: 0,
        }
    }
    componentDidMount = () => {
        var user = null;
        if (localStorage && localStorage.getItem('user')) {
            user = JSON.parse(localStorage.getItem("user"));
            this.props.login(user)
            this.addListener();
        };
    }
    componentDidUpdate = (prevProps, prevState) => {
        if (prevProps.isAdmin != this.props.isAdmin) {
            if (this.props.isAdmin == "") {
                fbApp.database().ref('TblCart').off();
                this.setState({
                    cartLength: 0
                })
            } else {
                this.addListener();
            }
        }
    }
    addListener = () => {
        var user = null;
        user = JSON.parse(localStorage.getItem("user"));
        if (user != null) {
            instance.get('/auth/').then(res => {
                console.log(res.data)
                if (res.status == 200) {
                    fbApp.database().ref('TblCart').child(res.data.uid)
                        .on('value', snap => {
                            if (snap.numChildren() <= 1) {
                                this.setState({
                                    cartLength: 0
                                })
                            } else {
                                this.setState({
                                    cartLength: snap.numChildren() - 1
                                })
                            }
                        })
                }
            }).catch(err => console.log(err))
        }

    }
    handleClick = () => {
        this.setState({
            click: !this.state.click
        })
    }
    closeMobileMenu = () => {
        this.setState({
            click: false
        })
    }
    onMouseEnter = () => {
        if (window.innerWidth < 960) {
            this.setState({
                dropdown: false,
            })
        } else {
            this.setState({
                dropdown: true,
            })
        }
    }
    onMouseLeave = () => {
        if (window.innerWidth < 960) {
            this.setState({
                dropdown: false,
            })
        } else {
            this.setState({
                dropdown: false,
            })
        }
    }
    onChange = (event) => {
        var target = event.target;
        var name = target.name;
        var value = target.value;
        this.setState({
            [name]: value
        });
    }

    onSubmit = (event) => {
        event.preventDefault();
        if (this.state.search !== "") {
            this.props.searchProduct(this.state.search)
            localStorage.setItem('search', JSON.stringify({
                keyword: this.state.search,
            }));
            localStorage.setItem('from', JSON.stringify({
                from: "search",
            }));
            this.setState({
                search: "",
            })
        }
    }
    render() {
        var elmNavbar = <div>
            <li className="nav-itemh"
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
            >
                <Link to="/services" className="nav-links" onClick={this.closeMobileMenu}>
                    Services <i class="fas fa-caret-down"></i>
                </Link>
                {dropdown && <Dropdown />}
            </li>
            <li className="nav-itemh">
                <Link to="/contact-us" className="nav-links" onClick={this.closeMobileMenu}>
                    Contact Us
                </Link>
            </li>
        </div>;
        var { click, dropdown } = this.state;
        return (
            <div>
                <nav className="navbarh">
                    <Link to={'/'} className="navbar-logo" style={{ textDecoration: 'none' }}><i class="fas fa-futbol"></i> HKSport</Link>
                    <form
                        noValidate
                        style={{ justifyContent: "start", width: "25%", marginLeft: 40, marginTop: 10 }}
                        onSubmit={this.onSubmit}
                    >
                        <Grid >
                            <TextField
                                color="primary"
                                label="Bạn muốn mua gì?"
                                size="small"
                                name="search"
                                variant="outlined"
                                style={{ width: "100%", backgroundColor: "white", borderRadius: "5px" }}
                                value={this.state.search}
                                onChange={this.onChange}
                            />
                            <IconButton
                                color="green"
                                style={{ marginLeft: -50, marginTop: -2 }}
                                type="submit"
                            >
                                <SearchIcon />
                            </IconButton>
                        </Grid>
                    </form>

                    <div className="menu-icon" onClick={this.handleClick}>
                        <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
                    </div>

                    <ul className={click ? "nav-menu active" : "nav-menu"}>

                        {this.props.isAdmin === "user" ? <li className="nav-itemh">
                            <Link to="/account" className="nav-links" onClick={this.closeMobileMenu} style={{ textDecoration: 'none' }}>
                                Tài khoản
                            </Link>
                        </li> : this.props.isAdmin === "admin"
                            ? <li className="nav-itemh">
                                <Link to="/admin" className="nav-links" onClick={this.closeMobileMenu} style={{ textDecoration: 'none' }}>
                                    Trang Quản lý
                                </Link>
                            </li>
                            : <li className="nav-itemh">
                                <Link to={'/'} className="nav-links" onClick={this.closeMobileMenu} style={{ textDecoration: 'none' }}>
                                    Home
                                </Link>
                            </li>
                        }

                        <li className="nav-itemh">
                            <Link to="/contact-us" className="nav-links" onClick={this.closeMobileMenu} style={{ textDecoration: 'none' }}>
                                Liên hệ
                            </Link>
                        </li>

                        <li className="nav-itemh">
                            <Link to="/sign-in" className="nav-links-mobile" onClick={this.closeMobileMenu} style={{ textDecoration: 'none' }}>
                                Sign In
                            </Link>
                        </li>
                    </ul>
                    <Button isLogin={this.props.isLogin}
                        isLogout={this.props.isLogout}
                    />
                    {this.props.isAdmin === "user"
                        ? <div style={{ marginInline: 30 }}>
                            <Tooltip title="Đi đến giỏ hàng của bạn" placement="bottom">
                                <Link to="/cart">
                                    <IconButton aria-label="add to shopping cart">
                                        <Badge badgeContent={this.state.cartLength} color="error">
                                            <ShoppingCartIcon htmlColor='white' />
                                        </Badge>
                                    </IconButton>
                                </Link>
                            </Tooltip>
                        </div>
                        : null
                    }
                </nav>
            </div>
        )
    };
};