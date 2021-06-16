import React, { Component } from 'react';
import { withStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import { green } from '@material-ui/core/colors';
import toast, { Toaster } from 'react-hot-toast';


const GREY = "#9E9E9E";

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    media: {
        //height: 300,
        height: 200,
    },
    rootcard: {
        maxWidth: 210,
    }
});


class SearchCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            star: 4,
        }
    }

    handleClick = () => {

    }

    componentDidMount = async () => {
        var key = this.props.data.key;
    }

    render() {
        var { classes, data, rating } = this.props;
        var height = (data.Rating !== 0) ? 30 : 60;
        var d = 0; //đếm số lượng đã đánh giá sản phẩm
        rating.forEach(x => {
            if (x.ProductID === data.key) {
                d = d + 1;
            }
        })
        return (
            <Card className={classes.rootcard} onClick={this.handleClick} style={{ marginTop: 20, marginBottom: 20 }}>
                <CardActionArea style={{ marginBottom: -25 }}>
                    <CardMedia
                        className={classes.media}
                        image={data.Image}
                        title={data.Name}
                    />
                    <Divider />
                    <CardContent >
                        <Typography align="center" gutterBottom variant="caption" component="h3" noWrap style={{ marginTop: -5, marginBottom: -30 }}>
                            {data.Name}
                        </Typography>
                    </CardContent>
                    <CardContent>
                        <Typography align="center" gutterBottom variant="caption" component="h3" noWrap style={{ marginTop: -15, marginBottom: height }}>
                            Giá: {data.Price}(VNĐ)
                        </Typography>
                    </CardContent>
                    {data.Rating !== 0 ? <CardContent >
                        {/* <Box component="fieldset" mb={0} borderColor="transparent" style={{ marginTop: -55, marginBottom: 0, marginLeft: "20%" }}>
                            <Rating name="read-only" value={data.rating} readOnly size="small" precision={0.5}/> 
                            <div>ád</div>
                        </Box> */}
                        <Grid container spacing={0} style={{ marginTop: -55, marginBottom: 0, marginLeft: "18%" }}>
                            <Grid item xs={10} style={{ fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`, }}>
                                <Rating name="read-only" value={data.Rating} readOnly size="small" precision={0.5} />
                            </Grid>
                            <Grid item xs={2} style={{ marginLeft: "-30%", marginTop:-3 }}>
                                ({d})
                            </Grid>
                        </Grid>
                        
                    </CardContent> : ""}

                </CardActionArea>
            </Card>
        )
    }
}

SearchCard.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(SearchCard);