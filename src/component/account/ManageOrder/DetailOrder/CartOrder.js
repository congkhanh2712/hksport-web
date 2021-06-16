import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Grid, Typography, Divider, Avatar } from '@material-ui/core';

const GREY = "#9E9E9E";

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    well: {
        boxShadow: `3px 3px 10px 3px ${GREY}`,
    },
    small: {
        width: theme.spacing(15),
        height: theme.spacing(20),
    }
});

class CartOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        const { classes, products } = this.props;
        return (
            <Grid item xs={12}>
                <div
                    className={classes.well}
                    style={{ margin: 10, backgroundColor: 'white', borderRadius: 10, shadow: 10, height: "auto" }}
                >
                    <Typography variant="h6" gutterBottom align="center">
                        Kiện hàng
                    </Typography>
                    <Divider />

                    {/* các sản phẩm */}
                    <Grid container spacing={0}>
                        {products.map((x, index) => {
                            return <Grid item xs={6} key={index}>
                                <Grid container spacing={0}>
                                    <Grid item xs={3}>
                                        <div style={{ padding: 5 }}>
                                            <Avatar variant="square" className={classes.small} src={x.Image} />
                                        </div>
                                    </Grid>
                                    <Grid item xs={9} style={{ paddingTop: 5 }}>
                                        <Typography variant="subtitle2" gutterBottom style={{ marginBottom: 25 }}>
                                            {x.Name}
                                    </Typography>
                                        <Typography variant="subtitle2" gutterBottom style={{ marginBottom: 25 }}>
                                            Kích cỡ: {x.Size}
                                    </Typography>
                                        <Typography variant="subtitle2" gutterBottom style={{ marginBottom: 25 }}>
                                            Số lượng: {x.Quantity}
                                    </Typography>
                                        <Typography variant="subtitle2" gutterBottom >
                                            Giá sản phẩm: {x.Price}(vnđ)
                                    </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        })}

                    </Grid>
                </div>
            </Grid>
        )
    }
}

CartOrder.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(CartOrder);