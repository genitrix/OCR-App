# OCR

## Install

After successfully cloning this repo, run:
```shell
git submodule update --init
```

You may also need to download models for [PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR/blob/release/2.1/doc/doc_en/quickstart_en.md):
```shell
cd api/PaddleOCR && mkdir inference && cd inference
wget https://paddleocr.bj.bcebos.com/dygraph_v2.0/ch/ch_ppocr_mobile_v2.0_det_infer.tar && tar xf ch_ppocr_mobile_v2.0_det_infer.tar
wget https://paddleocr.bj.bcebos.com/dygraph_v2.0/ch/ch_ppocr_mobile_v2.0_rec_infer.tar && tar xf ch_ppocr_mobile_v2.0_rec_infer.tar
wget https://paddleocr.bj.bcebos.com/dygraph_v2.0/ch/ch_ppocr_mobile_v2.0_cls_infer.tar && tar xf ch_ppocr_mobile_v2.0_cls_infer.tar
```

## Deploy

Deploy on Docker:
```
make deploy
```
