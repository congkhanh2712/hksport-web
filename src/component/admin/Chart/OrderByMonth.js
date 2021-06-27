import * as React from 'react';
import {
    Chart,
    ArgumentAxis,
    ValueAxis,
    BarSeries,
    Legend,
    Tooltip
} from '@devexpress/dx-react-chart-material-ui';

import { scaleBand } from '@devexpress/dx-chart-core';
import { ArgumentScale, Stack } from '@devexpress/dx-react-chart';
import { Animation } from '@devexpress/dx-react-chart';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import instance from '../../../AxiosConfig';
import CircularProgress from '@material-ui/core/CircularProgress';
import { EventTracker } from '@devexpress/dx-react-chart';
import { FormControl, InputLabel, NativeSelect } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';


const GREY = "#9E9E9E";
const styles = theme => ({
    well: {
        boxShadow: `0px 0px 5px 1px ${GREY}`,
    },
    formControl: {
        margin: theme.spacing(0),
        minWidth: "120",
    },
});
class OrderByMonth extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            year: new Date().getFullYear(),
            loading: true,
            targetItem: undefined,
        };
    }
    componentDidMount() {
        this.getData();
    }
    changeTargetItem = (targetItem) => {
        this.setState({ targetItem });
    }
    getData = () => {
        this.setState({
            loading: true
        })
        instance.get('/chart/axes', {
            params: {
                year: this.state.year
            }
        }).then(res => {
            if (res.status == 200) {
                var items = res.data.result.slice(1, res.data.result.length)
                this.setState({
                    data: items,
                    loading: false,
                })
            } else {
                this.setState({
                    loading: false,
                })
            }
        })
    }
    componentDidUpdate = (prevProps, prevState) => {
        if (this.state.year != prevState.year) {
            this.getData();
        }
    }
    onChange = async (event) => {
        var name = event.target.name;
        var value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        await this.setState({
            [name]: value,
        });
        if (this.state.number < 0) {
            this.setState({
                number: 0
            })
        }
    }
    render() {
        const { data, year, loading, targetItem } = this.state;
        const { classes, yearArr } = this.props;
        return (
            <Grid container item xs={12}
                justify={'space-between'}
                alignItems='center'
                direction='column'
                style={{
                    margin: 10,
                    borderRadius: 10,
                    paddingBlock: 15
                }}
                className={classes.well}>
                <Typography variant="h5">
                    {`Số lượng đơn hàng theo tháng của cửa hàng trong năm ${year}`}
                </Typography>
                {loading
                    ? <CircularProgress />
                    : <Chart
                        style={{ width: '100%' }}
                        data={data}>
                        <ArgumentScale factory={scaleBand} />
                        <ArgumentAxis />
                        <ValueAxis />

                        <BarSeries
                            valueField="all"
                            argumentField="state"
                            name="Đơn hàng đã đặt"
                        />
                        <BarSeries
                            valueField="cancel"
                            argumentField="state"
                            name="Đơn hàng đã hủy"
                        />
                        <EventTracker />
                        <Legend />
                        <Stack />
                        <Animation />
                        <Grid container item xs={12}
                            justify={'flex-end'}
                            alignItems='center'
                            style={{ marginBlock: 5, paddingInline: 20 }}>
                            <Grid container item xs={2}>
                                <FormControl className={classes.formControl} style={{ width: '100%' }}>
                                    <InputLabel>Năm</InputLabel>
                                    <NativeSelect
                                        value={year}
                                        defaultValue={year}
                                        inputProps={{
                                            name: 'year',
                                        }}
                                        onChange={this.onChange}
                                    >
                                        <option aria-label="None" />
                                        {yearArr.map(x => {
                                            return <option key={x} value={x}>{x}</option>
                                        })}
                                    </NativeSelect>

                                </FormControl>
                            </Grid>
                        </Grid>
                        <Tooltip targetItem={targetItem} onTargetItemChange={this.changeTargetItem} />
                    </Chart>
                }
            </Grid >
        );
    }
}
OrderByMonth.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(OrderByMonth);