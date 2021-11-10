import { Dialog, Slide } from "@material-ui/core";
import React from 'react'
// import "../App.css"
import SignIU from "./SignIU";


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function SignPage({ open, toggler }) {
    const handleClose = () => { toggler(!open) }

    return (
        <Dialog open={open} onClose={handleClose} TransitionComponent={Transition} fullWidth={true}>
            <SignIU toggler={toggler}></SignIU>
        </Dialog>
    )
}

export default SignPage;