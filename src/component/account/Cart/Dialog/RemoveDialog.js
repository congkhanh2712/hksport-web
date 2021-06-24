import React, { Component } from 'react';
import { createMuiTheme, withStyles, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const GREY = "#D4D4D4";
const styles = ({
    well: {
        boxShadow: `0px 0px 5px 1px ${GREY}`,
    },
});

class RemoveDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
        }
    }
    componentDidMount = () => {
        window.addEventListener('resize', () => {
            this.setState({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        })
    }
    onChange = async (event) => {
        var name = event.target.name;
        var value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        this.setState({
            [name]: value
        });
    }
    render() {
        return (
            <Dialog
                open={true}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => this.props.closeRemoveDialog()}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">Bạn muốn xóa sản phẩm khỏi giỏ hàng?</DialogTitle>
                <DialogActions>
                    <Button onClick={() => this.props.closeRemoveDialog()} variant="contained" color="default">
                        Không
                    </Button>
                    <Button onClick={() => {
                        this.props.remove();
                        this.props.closeRemoveDialog();
                    }} variant="contained" color="primary">
                        Có
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

RemoveDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(RemoveDialog);