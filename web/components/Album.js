import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import Displayer from './Display';
import FilePage from './File';
import SignPage from './Sign';
import VideoPage from './Video';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        OCR Tool
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
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

export default function Album() {
  const classes = useStyles();
  const [sendFlag, setSendFlag] = useState(false)
  const [videoFlag, setVideoFlag] = useState(false)
  const [sign, setSign] = useState(true)
  const [imgURL, setImgURL] = useState("")
  const [result, setResult] = useState([])

  const members = ["陈昱滔", "张宇轩", "谢凯", "李林", "侯润宁"]


  const handleClick = () => { setSendFlag(!sendFlag) }
  const handleVideo = () => { setVideoFlag(!videoFlag) }
  const redirected = () => {
    window.location.href = "https://github.com/noneback"
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <CameraIcon className={classes.icon} />
          <Typography variant="h6" color="inherit" noWrap>
            OCR
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              OCR
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              在线OCR工具
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button variant="contained" color="primary" onClick={handleVideo}>
                    视频
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" color="primary" onClick={handleClick}>
                    上传
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" color="primary" onClick={redirected}>
                    关于
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
        {/* NOTICE: */}
        {sign && <SignPage open={sign} toggler={setSign}></SignPage>}
        {sendFlag && <FilePage open={sendFlag} toggler={setSendFlag} URLSetter={setImgURL} resultSetter={setResult}></FilePage>}
        {videoFlag && <VideoPage open={videoFlag} toggler={setVideoFlag} URLSetter={setImgURL} resultSetter={setResult}></VideoPage>}
        <Displayer imgURL={imgURL} result={result}></Displayer>
        {/* NOTICE: */}
      </main>
      <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          OCR
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
          小组成员: {members.map(m => (<a key={m}> {` ${m} `} </a>))}
        </Typography>
        <Copyright />
      </footer>
      {/* End footer */}
    </React.Fragment>
  );
}