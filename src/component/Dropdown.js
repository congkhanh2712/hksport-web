import { Component } from "react";
import React from 'react';
import { Link } from 'react-router-dom';
import './Dropdown.css';
import MenuItems from './MenuItems'

export default class Dropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            click: false
        }
    }

    handleClick = () => {
        this.setState({
            click: !this.state.click
        })
    }

    render() {
        var { click } = this.state;
        return (
            <>
                <ul
                    onClick={this.handleClick}
                    className={click ? "dropdown-menuh clicked" : "dropdown-menuh"}
                >
                    {MenuItems.map((item, index) => {
                        return (
                            <li key={index}>
                                <Link
                                    to={item.path}
                                    style={{ textDecoration: 'none' }}
                                    className={item.cName}
                                    onclick={() => {
                                        this.setState({
                                            click: false
                                        })
                                }}>
                                    {item.title}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </>
        )
    }
}