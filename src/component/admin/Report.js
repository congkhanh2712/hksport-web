import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import TopUser from './Chart/TopUser';
import TopProduct from './Chart/TopProduct';
import RevenueByMonth from './Chart/RevenueByMonth';
import RevenueByQuarter from './Chart/RevenueByQuarter';
import OrderByMonth from './Chart/OrderByMonth';
import instance from '../../AxiosConfig';


const GREY = "#9E9E9E";
const styles = theme => ({
    well: {
        boxShadow: `0px 0px 5px 1px ${GREY}`,
    },
});

class Report extends Component {
    constructor(props) {
        super(props);
        this.state = {
            yearArr: [],
        }
    }
    componentDidMount = () => {
        this.getData()
    }
    getData = () => {
        instance.get('/chart/year')
            .then(res => {
                if (res.status == 200) {
                    this.setState({
                        yearArr: res.data.result
                    })
                }
            })
    }
    render() {
        const { yearArr } = this.state;
        return (
            <Grid container spacing={0}
                justify={'space-between'}>
                <TopUser />
                <TopProduct />
                <RevenueByMonth yearArr={yearArr} />
                <RevenueByQuarter yearArr={yearArr} />
                <OrderByMonth yearArr={yearArr} />
            </Grid>
        )
    }
}

Report.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Report);