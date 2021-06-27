import * as React from 'react';
import {
    Chart,
    LineSeries,
    ArgumentAxis,
    ValueAxis,
    Tooltip
} from '@devexpress/dx-react-chart-material-ui';
import { ValueScale, Animation } from '@devexpress/dx-react-chart';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import instance from '../../../AxiosConfig';
import CircularProgress from '@material-ui/core/CircularProgress';
import { EventTracker } from '@devexpress/dx-react-chart';
import Typography from '@material-ui/core/Typography';
import { FormControl, InputLabel, NativeSelect } from '@material-ui/core';


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
const Label = symbol => (props) => {
    const { text } = props;
    return (
        <ValueAxis.Label
            {...props}
            text={text + symbol}
        />
    );
};

class RevenueByMonth extends React.PureComponent {
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
        instance.get('/chart/line', {
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
        const { data, loading, year, targetItem } = this.state;
        const PriceLabel = Label(' triệu vnđ');
        const { classes, yearArr } = this.props;
        var max = 0;
        data.forEach(e => {
            if (e.all > max) {
                max = e.all
            }
        })
        return (
            <Grid container item xs={8}
                justify={'space-between'}
                alignItems='center'
                style={{
                    padding: 10,
                }}>
                <Grid container item xs={12}
                    justify={'cneter'}
                    alignItems='center'
                    direction='column'
                    style={{
                        borderRadius: 10,
                        minHeight: 200,
                        paddingBlock: 10
                    }}
                    className={classes.well}>
                    <Typography variant="h5">
                        {`Doanh thu theo tháng của cửa hàng trong năm ${year}`}
                    </Typography>
                    {loading
                        ? <CircularProgress />
                        : <Grid container item xs={12}
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
                            <Chart
                                style={{ width: '100%' }}
                                data={data} >
                                <ValueScale name="all" modifyDomain={() => [0, max]} />

                                <ArgumentAxis />
                                <ValueAxis
                                    scaleName="all"
                                    position="left"
                                    labelComponent={PriceLabel}
                                />
                                <LineSeries
                                    name="Doanh thu"
                                    valueField="all"
                                    argumentField="state"
                                    scaleName="all"
                                />
                                <EventTracker />
                                <Animation />
                                <Tooltip targetItem={targetItem} onTargetItemChange={this.changeTargetItem} />
                            </Chart>
                        </Grid>
                    }
                </Grid>
            </Grid>
        );
    }
}
RevenueByMonth.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(RevenueByMonth);

