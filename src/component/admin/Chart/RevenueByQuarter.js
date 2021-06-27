import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import {
    Chart,
    PieSeries,
    Tooltip,
    Legend,
} from '@devexpress/dx-react-chart-material-ui';
import instance from '../../../AxiosConfig';
import { Animation } from '@devexpress/dx-react-chart';
import { FormControl, InputLabel, NativeSelect } from '@material-ui/core';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { EventTracker } from '@devexpress/dx-react-chart';
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
class RevenueByQuarter extends React.PureComponent {
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
        instance.get('/chart/pie', {
            params: {
                year: this.state.year
            }
        }).then(res => {
            if (res.status == 200) {
                console.log(res.data.result)
                this.setState({
                    data: res.data.result,
                    loading: false,
                })
            } else {
                this.setState({
                    loading: false,
                })
            }
        })
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
    componentDidUpdate = (prevProps, prevState) => {
        if (this.state.year != prevState.year) {
            this.getData();
        }
    }
    render() {
        const { data, year, loading, targetItem } = this.state;
        const { classes, yearArr } = this.props;
        console.log(yearArr)
        return (
            <Grid container item xs={4}
                justify={'space-between'}
                alignItems='center'
                style={{
                    padding: 10,
                }}>
                <Grid container item xs={12}
                    justify={'center'}
                    alignItems='center'
                    direction='column'
                    style={{
                        borderRadius: 10,
                        minHeight: 200,
                        paddingBlock: 10
                    }}
                    className={classes.well}>
                    <Typography variant="h5">
                        {`Doanh thu theo qúy trong năm ${year}`}
                    </Typography>
                    {loading
                        ? <CircularProgress />
                        : <Chart
                            style={{ width: '100%' }}
                            data={data} >
                            <PieSeries
                                valueField="value"
                                argumentField="state"
                            />
                            <EventTracker />
                            <Legend />
                            <Animation />
                            <Grid container item xs={12}
                                justify={'flex-end'}
                                alignItems='center'
                                style={{ marginBlock: 5, paddingInline: 20 }}>
                                <Grid container item xs={4}>
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

                    <Typography variant="subtitle1">
                        (đơn vị: triệu vnđ)
                    </Typography>
                </Grid>
            </Grid>
        );
    }
}
RevenueByQuarter.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(RevenueByQuarter);
