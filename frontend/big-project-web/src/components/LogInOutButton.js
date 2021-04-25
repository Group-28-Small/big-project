import { Button, ButtonGroup, ClickAwayListener, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grow, MenuItem, MenuList, Paper, Popper, Snackbar, TextField } from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import CloseIcon from '@material-ui/icons/Close';
import 'firebase/auth';
import firebase from 'firebase'
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth, useFirebaseApp, useFirestore, useUser } from "reactfire";


export default function LogInOutButton(props) {
    const auth = useAuth();
    const db = useFirestore();
    const firebaseApp = useFirebaseApp();
    const { data: user } = useUser();
    const anchorRef = React.useRef(null);
    const [dropdownOpen, setDropdownOpen] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [pass, setPass] = React.useState("")
    const [snackbarVisible, setSnackbarVisible] = React.useState(false)
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const logout = (event) => {
        console.log("logging out");
        auth.signOut();
        db.terminate();
    }
    const closeDropdown = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setDropdownOpen(false);
    };

    const showDeleteAccountDialog = (event, index) => {
        // delete account
        setOpen(true)
        setDropdownOpen(false);
    };

    const showDropDown = () => {
        setDropdownOpen((prevOpen) => !prevOpen);
    };

    const deleteAccount = () => {
        console.log(pass);
        var credential = firebase.auth.EmailAuthProvider.credential(
            auth.currentUser.email,
            pass
        );
        console.log(credential)
        user.reauthenticateWithCredential(credential).then(() => {
            setPass("")
            setSnackbarVisible(false)
            user.delete()
            setOpen(false)
        }).catch(() => {
            setSnackbarVisible(true)
        });
    }

    if (props.isSignedIn) {
        return (
            <>
                <ButtonGroup color="secondary" ref={anchorRef} aria-label="split button">
                    <Button color='inherit' onClick={logout}>Logout</Button>
                    <Button
                        color="inherit"
                        size="small"
                        aria-controls={dropdownOpen ? 'split-button-menu' : undefined}
                        aria-expanded={dropdownOpen ? 'true' : undefined}
                        aria-haspopup="menu"
                        onClick={showDropDown}
                        variant="outlined"
                    >
                        <ArrowDropDownIcon />
                    </Button>
                </ButtonGroup>
                <Popper open={dropdownOpen} anchorEl={anchorRef.current} role={undefined} transition >
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            style={{
                                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                            }}
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={closeDropdown}>
                                    <MenuList id="split-button-menu">
                                        <MenuItem
                                            onClick={showDeleteAccountDialog}
                                            disabled={false}
                                        >
                                            Delete Account
                                            </MenuItem>
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
                <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete your account? If so, enter your password and click Agree. This can't be undone!
          </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Password"
                            type="password"
                            fullWidth
                            value={pass}
                            onChange={(e) => { setPass(e.target.value) }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
          </Button>
                        <Button onClick={deleteAccount} color="Red">
                            Delete
          </Button>
                    </DialogActions>
                </Dialog>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={snackbarVisible}
                    autoHideDuration={6000}
                    onClose={() => setSnackbarVisible(false)}
                    message="Wrong Password"
                    action={
                        <>
                            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </>
                    }
                />
            </>
        )
    } else {
        return (
            <div>
                < Button component={Link} to={'/login'} color="inherit" >Login</Button>
                < Button component={Link} to={'/register'} color="inherit" >Register</Button>
            </div>
        );
    }

}