import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import CreateIcon from '@material-ui/icons/Create';
import IconButton from '@material-ui/core/IconButton';
import {
    BrowserRouter as Router,
    NavLink,
} from "react-router-dom";

const styles = ({
    root: {
        //maxWidth: 345,
        maxWidth: 210,
    },
    media: {
        //height: 300,
        height: 200,
    },
    name: {
    },
});

class CardUpdate extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    handleClick = () => {
    }

    updateProduct = () => {

    }

    render() {
        const { classes, data } = this.props;
        return (
            <Card className={classes.root} onClick={this.handleClick}>
                <CardActionArea>
                    <CardMedia
                        className={classes.media}
                        image={data.image}
                        title={data.name}
                    />
                    <Divider />
                    <CardContent>
                        <Typography gutterBottom variant="caption" component="h3" noWrap style={{marginTop:-5, marginBottom:-20}}>
                            {data.name}
                        </Typography>
                        {/* <Typography variant="body2" color="textSecondary" component="p"  display="inline">
                            {data.description}
                        </Typography> */}
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <NavLink to={`/admin/update/${data.key}`}>
                        <Button variant="contained" color="primary" style={{ marginLeft: 30 }} onClick={this.updateProduct}>
                            Sửa sản phẩm
                        </Button>
                    </NavLink>

                    {/* <Button size="small" color="primary">
                        Learn More
                    </Button> */}
                </CardActions>
            </Card>

        );
    }
}

CardUpdate.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(CardUpdate);
