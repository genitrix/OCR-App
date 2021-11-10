import { Button, Input, Dialog, Grid, Slide, DialogActions, DialogTitle, Radio } from "@material-ui/core";
import React, { useState } from 'react'
// import "../App.css"
import Ocr from "../services/ocr"
import ProgressBar from "./Progress"

const ContainerStyle = {
    margin: "0 auto",
}

const RadioGStyle = {
    textAlign: "left"
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function FilePage({ open, toggler, URLSetter, resultSetter }) {
    const [selectedValue, setSelectedValue] = React.useState('easyocr');
    const [upload, setUpload] = useState(false)
    const [disable, setDisable] = useState(true)
    const [progress, setProgress] = useState(0);

    const fileLimitation = ["*.jpg", "*.png", "*.jepg", "*.bmp", "*.gif"]

    const handleClose = () => { toggler(!open) }
    const handleClick = (e) => {
        e.preventDefault();
        const file = e.target.file_input.files[0]
        console.log(file);
        setUpload(true)
        Ocr.sendFile(file, setProgress, selectedValue === 'all' ? 'chineseocr_lite' : selectedValue).then(res => {
            console.log("s:", res);
            URLSetter(res.path)
            resultSetter(res.data)
        }).then(res => {
            console.log(res);
            toggler(!open)
            setUpload(false)
        }).catch(res => {
            console.log("error ");
        })
    }

    const handleFileExisted = (e) => {
        console.log(e.target.files.length);
        setDisable(!e.target.files && e.target.files.length !== 0)

    }

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    }

    return (
        <Dialog open={open} onClose={handleClose} TransitionComponent={Transition} fullWidth={true}>
            <DialogTitle>图片上传：<br></br></DialogTitle>

            {!upload ? (<div className="card_container" style={ContainerStyle}>
                <div className="input_wrapper">
                    <DialogActions>
                        <form encType={"multipart/form-data"} acceptCharset={fileLimitation} onSubmit={handleClick} onDrop={(e) => { console.log(e); }}>
                            <Input type="file" name="file" id="file_input" label="图片" variant="standard" onClickCapture onChange={handleFileExisted} />
                            <br></br>
                            <br></br>
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
                                <label style={{ textAlign: "right" }}><strong>{selectedValue}</strong></label>
                            </div>
                            <br></br>
                            <Grid container spacing={2} justify="center">
                                <Grid item>
                                    <Button disabled={disable} type="submit" color="primary" variant="contained" >确定</Button>
                                </Grid>
                                <Grid item>
                                    <Button color="primary" variant="contained" onClick={handleClose} >关闭</Button>
                                </Grid>
                            </Grid>
                        </form>
                    </DialogActions>

                </div>
            </div>) : (<ProgressBar UploadToggler={setUpload} OpenToggler={toggler} progress={progress}> </ProgressBar>)
            }


        </Dialog>
    )
}

export default FilePage;
