import { Component } from "react";
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import './Dropdown.css';
import Typography from '@material-ui/core/Typography';

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
        const { cartItems } = this.props;
        return (
            <ul
                onClick={this.handleClick}
                className={"dropdown-menuh"}
            >
                {cartItems.slice(0, 3).map((item, index) => {
                    return (
                        <li key={index}>
                            <Grid container item xs={12}
                                direction='row' style={{ margin: 10 }}>
                                <Grid item xs={3}>
                                    <img width={85} src={item.Image} />
                                </Grid>
                                <Grid container item xs={7}
                                    direction='column'
                                    justify='flex-start'
                                    style={{ marginInline: 5 }}>
                                    <Typography variant="subtitle1"
                                        style={{ fontWeight: 'bold' }}>
                                        {item.Name}
                                    </Typography>
                                    <Typography variant="body2">
                                        Phân loại: {item.Size != '' ? item.Size : 'Không có'}
                                    </Typography>
                                    <Typography variant="body1">
                                        Giá sp: {item.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} vnđ
                                    </Typography>
                                </Grid>
                                <Grid item xs={1}>
                                    <Typography variant="subtitle1"
                                        style={{ fontWeight: 'bold' }}>
                                        x{item.Quantity}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Divider />
                        </li>
                    )
                })}
                {cartItems.length > 3
                    ? <Typography variant="subtitle1"
                        align='center'
                        style={{ fontWeight: 'bold', color: '#009FDD' }}>
                        {cartItems.length - 3} sản phẩm khác
                    </Typography>
                    : null
                }
            </ul>
        )
    }
}