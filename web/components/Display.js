import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import DataTable from './DataTable';

const ContainerStyles = {
    textAlign: "center",
}

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },
    cardContent: {
        flexGrow: 1,
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    },
}));

const cards = [1];


const Displayer = ({ imgURL, result }) => {
    const classes = useStyles();
    return (
        <div style={ContainerStyles}>
            <Grid container spacing={10} >
                {cards.map((card) => (
                    <Grid item key={card} xs >
                        {imgURL !== "" && (<Card className={classes.card}>
                            <CardMedia
                                className={classes.cardMedia}
                                image={imgURL}
                                title="Image title"
                            />
                            <CardContent className={classes.cardContent}>
                                <Typography gutterBottom variant="h5" component="h2">
                                    图片信息
                                </Typography>
                                <Typography>
                                    <DataTable data={result}></DataTable>
                                    {/* {result.map(r => (<label>{` ${r} `}</label>))} */}
                                </Typography>
                            </CardContent>
                        </Card>
                        )}
                    </Grid>
                ))}
            </Grid>

        </div>
    )
}

export default Displayer