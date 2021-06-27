import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    Chart,
    BarSeries,
    ArgumentAxis,
    ValueAxis,
    Tooltip,
} from '@devexpress/dx-react-chart-material-ui';
import { Animation } from '@devexpress/dx-react-chart';
import Grid from '@material-ui/core/Grid';
import instance from '../../../AxiosConfig';
import CircularProgress from '@material-ui/core/CircularProgress';
import { EventTracker } from '@devexpress/dx-react-chart';
import { TextField } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';


const GREY = "#9E9E9E";
const styles = theme => ({
    well: {
        boxShadow: `0px 0px 5px 1px ${GREY}`,
    },
});

class TopUser extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: true,
            number: 5,
            targetItem: undefined,
        };
    }
    componentDidMount() {
        this.getData(6);
    }
    changeTargetItem = (targetItem) => {
        this.setState({ targetItem });
    }
    getData = () => {
        instance.get('/chart/rotatebar')
            .then(res => {
                if (res.status == 200) {
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
    render() {
        const { data, loading, number, targetItem } = this.state;
        const { classes } = this.props;
        return (
            <Grid container item xs={6}
                justify={'space-between'}
                alignItems='center'
                direction='column'
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
                        {`Top ${number} khách hàng thân thiết`}
                    </Typography>
                    {loading
                        ? <CircularProgress />
                        : <Chart
                            style={{ width: '100%' }}
                            data={data.reverse().slice(0, parseInt(number) + 1)}
                            rotated
                        >
                            <ArgumentAxis />
                            <ValueAxis />

                            <BarSeries
                                valueField="value"
                                argumentField="name"
                            />
                            <EventTracker />
                            <Animation />
                            <Tooltip targetItem={targetItem} onTargetItemChange={this.changeTargetItem} />
                            <Grid container item xs={12}
                                justify={'flex-end'}
                                alignItems='center'
                                style={{ marginBlock: 5,paddingInline: 20 }}>
                                <Grid item xs={2}>
                                    <TextField
                                        value={number}
                                        fullWidth
                                        label="Số lượng"
                                        type="number"
                                        name="number"
                                        onChange={this.onChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Chart>
                    }
                </Grid>
            </Grid>
        );
    }
}
TopUser.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(TopUser);
