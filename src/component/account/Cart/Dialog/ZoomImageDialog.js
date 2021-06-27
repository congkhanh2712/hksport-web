import React, { Component } from 'react';
import { createMuiTheme, withStyles, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';



const GREY = "#D4D4D4";
const styles = ({
    well: {
        boxShadow: `0px 0px 5px 1px ${GREY}`,
    },
});

class ZoomImageDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        const { src } = this.props;
        return (
            <Dialog onClose={()=>this.props.close()}
                aria-labelledby="customized-dialog-title"
                open={true} maxWidth={false}>
                <img src={src} alt="Hình ảnh" />
            </Dialog>
        )
    }
}

ZoomImageDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(ZoomImageDialog);