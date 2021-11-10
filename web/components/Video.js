import { Button, Input, Dialog, Grid, Slide, DialogActions, DialogTitle, Radio } from "@material-ui/core";
import React, { useState } from 'react'
// import "../App.css"
import Ocr from "../services/ocr"
import ProgressBar from "./Progress"
import { VideoPreview, VideoWrapper, PlayIconWrapper, Preview, FileInput, PreviewWrapper } from "./Styled";
import VideoSnapshot from "video-snapshot";
import { AccessAlarm, Home } from "@material-ui/icons";
import { useEffect } from "react";
import ocr from "../services/ocr";

const ContainerStyle = {
    margin: "0 auto",
    textAlign: "center"
}

const RadioGStyle = {
    textAlign: "center",
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function VideoPage({ open, toggler, URLSetter, resultSetter }) {
    const [upload, setUpload] = useState(false)
    const [disable, setDisable] = useState(false)
    const [videoUrl, setVideoUrl] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [inputRef, setInputRef] = useState(null)
    const [videoRef, setVideoRef] = useState(null)
    const [snapshoter, setSnapshoter] = useState(null)
    const [progress, setProgress] = useState(0)
    // const [file, setFile] = useState(null) // store file blob
    const [files, setFiles] = useState([])
    const [selectedValue, setSelectedValue] = useState('easyocr');
    let data = []

    useEffect(() => {
        const inputR = document.getElementById("file_input")
        if (inputR) setInputRef(inputR)
        const videoR = document.getElementById("video")
        if (videoR) setVideoRef(videoR)
        console.log("Init", videoR)
    }, [previewUrl])

    useEffect(() => {
        console.log("effect", files);
    }, [files])

    const fileLimitation = ["*.jpg", "*.png", "*.jepg", "*.bmp", "*.gif"]

    const saveInputRef = (e) => {
        const iRef = document.getElementById("file_input")
        setInputRef(iRef)
    }

    const saveVideoRef = (e) => {
        const vRef = document.getElementById("video")
        setVideoRef(vRef)
    }

    const pickFile = () => {
        console.log("pickFile", inputRef);
        const inputRef = document.getElementById("file_input")
        inputRef && inputRef.click()
    }

    const onSnapshot = async (e) => {
        e.preventDefault()
        saveVideoRef()
        console.log("snapshot", videoRef, e);
        if (!videoRef) return
        const currentTime = videoRef.currentTime
        const videoPreview = await snapshoter?.takeSnapshot(currentTime)
        if (!videoPreview) return
        setPreviewUrl(videoPreview)
        const fb = files.concat(Ocr.convertBase64UrlToFile(videoPreview))
        console.log('fb', fb);
        setFiles(fb)
    }


    const handleSend = (e) => {
        e.preventDefault()
        setUpload(true)
        console.log("files:", files);
        files.map(file => {
            Ocr.sendFile(file, setProgress, selectedValue === 'all' ? 'chineseocr_lite' : selectedValue).then(res => {
                console.log("s:", res);
                URLSetter(res.path)
                data = data.concat(res.data)
                console.log("handleSend:", data, res.data)
                resultSetter(data)
            }).then(res => {
                console.log(res);
                toggler(!open)
                setUpload(false)
            }).catch(res => {
                console.log("error ");
            })
        })
        
    }

    const onChange = (e) => {
        // e.preventDefault()
        console.log(e);
        const file = e.target.files[0]
        if (!file) return
        setSnapshoter(new VideoSnapshot(file))
        const url = URL.createObjectURL(file)
        console.log(url);
        setVideoUrl(url)
    }

    const handleClick = (e) => {
        e.preventDefault();

        const file = e.target.files[0]
        if (!file) return
        const url = URL.createObjectURL(file)
        console.log(url);
        setVideoUrl(url)
    }
    const open1 = true
    const handleFileExisted = (e) => {
        console.log(e.target.files.length);
        setDisable(!e.target.files && e.target.files.length !== 0)
    }

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    }
    const handleClose = () => { toggler(!open) }

    return (
        <>
            <Dialog open={open1} onClose={handleClose} TransitionComponent={Transition} fullWidth={true}>
                <DialogTitle>视频截图：<br></br></DialogTitle>
                {!upload ? (<>
                    <div>
                        <VideoWrapper>
                            {videoUrl ? <VideoPreview id="video" innerRef={saveVideoRef} controls src={videoUrl} autoPlay={true} /> :
                                <PlayIconWrapper onClick={pickFile}><AccessAlarm label="video"></AccessAlarm>
                                </PlayIconWrapper >
                            }
                        </VideoWrapper >
                    </div >
                    <dic>
                        <PreviewWrapper>
                            <Preview src={previewUrl}></Preview>
                        </PreviewWrapper>
                    </dic>
                    <div className="card_container" style={ContainerStyle}>
                        <div className="input_wrapper" style={{
                            textAlign: "center",
                            margin: "0",
                            // backgroundColor: "red"
                        }}>
                            <DialogActions >
                                {/* <form encType={"multipart/form-data"} acceptCharset={fileLimitation} onSubmit={handleClick} onDrop={(e) => { console.log(e); }}> */}
                                <FileInput type="file" name="file" id="file_input" label="图片" variant="standard" onChange={onChange} innerRef={saveInputRef} />
                                <Grid container spacing={2} justify="center">
                                    <Grid item>
                                        <Button disabled={disable} type="submit" onClick={pickFile} color="primary" variant="contained" >挑选</Button>
                                    </Grid>
                                    <Grid item>
                                        <Button color="primary" variant="contained" onClick={onSnapshot} >截图</Button>
                                    </Grid>
                                    <Grid item>
                                        <Button color="primary" variant="contained" onClick={handleSend} >上传</Button>
                                    </Grid>
                                </Grid>
                                {/* </form> */}
                            </DialogActions>
                            <div style={RadioGStyle}>
                                <label><strong>模型选择:</strong></label>
                                <Radio
                                    checked={selectedValue === 'easyocr'}
                                    onChange={handleChange}
                                    value="easyocr"
                                    name="radio-button-demo"
                                />
                                <Radio
                                    checked={selectedValue === 'chineseocr_lite'}
                                    onChange={handleChange}
                                    value="chineseocr_lite"
                                    color="primary"
                                    name="radio-button-demo"
                                />
                                <Radio
                                    checked={selectedValue === 'paddleocr'}
                                    onChange={handleChange}
                                    value="paddleocr"
                                    color="default"
                                    name="radio-button-demo"
                                />
                                <Radio
                                    checked={selectedValue === 'all'}
                                    onChange={handleChange}
                                    value="all"
                                    color="primary"
                                    name="radio-button-demo"
                                />
                                <br></br>
                                <label style={{ textAlign: "right" }}><strong>{selectedValue}</strong></label>
                            </div>
                            <br></br>
                        </div>
                    </div></>) : (<ProgressBar UploadToggler={setUpload} OpenToggler={toggler} progress={progress}> </ProgressBar>)}
            </Dialog >


        </>)
}


export default VideoPage;
