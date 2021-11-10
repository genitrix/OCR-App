import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles({
    root: {
        width: '80%',
        textAlign: "center",
        margin: "0 auto"
    },
});

function LinearProgressWithLabel(props) {
    return (
        <Box display="flex" alignItems="center">
            <Box width="100%" mr={1}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box minWidth={35}>
                <Typography variant="body2" color="textSecondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

LinearProgressWithLabel.propTypes = {
    value: PropTypes.number.isRequired,
};

export default function ProgressBar({ UploadToggler, OpenToggler, progress }) {
    const classes = useStyles();
    const handleChange = (e) => {
        console.log("progress onChange");
        UploadToggler(progress === 100)
        OpenToggler(progress === 100)
    }
    // React.useEffect(() => {
    //     const timer = setInterval(() => {
    //         setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
    //     }, 800);
    //     return () => {
    //         clearInterval(timer);
    //     };
    // }, []);

    // setTimeout(() => {
    //     UploadToggler(false)
    //     OpenToggler(false)
    // }, 1000)

    return (
        <div className={classes.root}>
            <LinearProgressWithLabel value={progress} onChange={handleChange} />
        </div>
    );
}