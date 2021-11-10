import json
import os
import re
import sqlite3
import sys
import uuid
from argparse import Namespace

import cv2
import easyocr
from flask import Flask, request, send_from_directory, session
from PIL import Image


DATABASE = 'main.db'
IMAGE_BASE_DIR = os.path.join(os.getcwd(), 'image')


app = Flask(__name__)
app.secret_key = '7s2qZzS8Nu'


@app.route('/image/<path:path>')
def image(path):
    return send_from_directory(IMAGE_BASE_DIR, path)

sys.path.append(os.path.join(os.path.dirname(__file__), 'chineseocr_lite'))
from model import OcrHandle # type: ignore
handle = OcrHandle()
@app.route('/api/chineseocr_lite', methods=['POST'])
def chineseocr_lite():
    image = request.files['image']
    _, extension = os.path.splitext(image.filename or '.jpg')
    filename = f'{uuid.uuid4()}{extension}'
    path = os.path.join(IMAGE_BASE_DIR, filename)
    image.save(path)

    image = Image.open(path)
    data = handle.text_predict(image, 960)
    data = list(map(lambda item: re.sub(r'^\d、\s', '', item[1]), data))

    path = os.path.join('/image', filename)
    if 'user_id' in session:
        connection = sqlite3.connect(DATABASE)
        cursor = connection.cursor()
        user_id = session['user_id']
        cursor.execute('INSERT INTO Record VALUES (?, ?, ?)', (path, user_id, json.dumps(data)))
        connection.commit()
        connection.close()

    return {
        'data': data,
        'path': path
    }

reader = easyocr.Reader(['ch_sim', 'en'], gpu=False)
@app.route('/api/easyocr', methods=['POST'])
def easyocr():
    image = request.files['image']
    _, extension = os.path.splitext(image.filename or '.jpg')
    filename = f'{uuid.uuid4()}{extension}'
    path = os.path.join(IMAGE_BASE_DIR, filename)
    image.save(path)
    data = reader.readtext(path, detail=0)

    path = os.path.join('/image', filename)
    if 'user_id' in session:
        connection = sqlite3.connect(DATABASE)
        cursor = connection.cursor()
        user_id = session['user_id']
        cursor.execute('INSERT INTO Record VALUES (?, ?, ?)', (path, user_id, json.dumps(data)))
        connection.commit()
        connection.close()

    return {
        'data': data,
        'path': path
    }

directory = os.path.join(os.path.dirname(__file__), 'PaddleOCR')
sys.path.append(directory)
from tools.infer.predict_system import TextSystem # type: ignore
args = Namespace(
    cls_batch_num=6,
    cls_image_shape='3, 48, 192',
    cls_model_dir=os.path.join(directory, 'inference/ch_ppocr_mobile_v2.0_cls_infer'),
    cls_thresh=0.9,
    det_algorithm='DB',
    det_db_box_thresh=0.5,
    det_db_score_mode='fast',
    det_db_thresh=0.3,
    det_db_unclip_ratio=1.6,
    det_east_cover_thresh=0.1,
    det_east_nms_thresh=0.2,
    det_east_score_thresh=0.8,
    det_limit_side_len=960,
    det_limit_type='max',
    det_model_dir=os.path.join(directory, 'inference/ch_ppocr_mobile_v2.0_det_infer'),
    det_sast_nms_thresh=0.2,
    det_sast_polygon=False,
    det_sast_score_thresh=0.5,
    drop_score=0.5,
    e2e_algorithm='PGNet',
    e2e_char_dict_path=os.path.join(directory, 'ppocr/utils/ic15_dict.txt'),
    e2e_limit_side_len=768,
    e2e_limit_type='max',
    e2e_model_dir=None,
    e2e_pgnet_mode='fast',
    e2e_pgnet_polygon=True,
    e2e_pgnet_score_thresh=0.5,
    e2e_pgnet_valid_set='totaltext',
    enable_mkldnn=False,
    gpu_mem=500,
    ir_optim=True,
    label_list=['0', '180'],
    max_batch_size=10,
    max_text_length=25,
    process_id=0,
    rec_algorithm='CRNN',
    rec_batch_num=6,
    rec_char_dict_path=os.path.join(directory, 'ppocr/utils/ppocr_keys_v1.txt'),
    rec_char_type='ch',
    rec_image_shape='3, 32, 320',
    rec_model_dir=os.path.join(directory, 'inference/ch_ppocr_mobile_v2.0_rec_infer'),
    total_process_num=1,
    use_angle_cls=True,
    use_dilation=False,
    use_fp16=False,
    use_gpu=False,
    use_mp=False,
    use_pdserving=False,
    use_space_char=True,
    use_tensorrt=False,
    vis_font_path=os.path.join(directory, 'doc/fonts/simfang.ttf')
)
@app.route('/api/paddleocr', methods=['POST'])
def paddleocr():
    image = request.files['image']
    _, extension = os.path.splitext(image.filename or '.jpg')
    filename = f'{uuid.uuid4()}{extension}'
    path = os.path.join(IMAGE_BASE_DIR, filename)
    image.save(path)

    image = cv2.imread(path) # type: ignore
    args.image_dir = path
    data = [str(text) for text, _ in TextSystem(args)(image)[1]]

    path = os.path.join('/image', filename)
    if 'user_id' in session:
        connection = sqlite3.connect(DATABASE)
        cursor = connection.cursor()
        user_id = session['user_id']
        cursor.execute('INSERT INTO Record VALUES (?, ?, ?)', (path, user_id, json.dumps(data)))
        connection.commit()
        connection.close()

    return {
        'data': data,
        'path': path
    }


@app.route('/api/user/login', methods=['POST'])
def user_login():
    username = request.form['username']
    password = request.form['password']

    connection = sqlite3.connect(DATABASE)
    cursor = connection.cursor()
    cursor.execute('SELECT id, password FROM User WHERE username = ?', (username, ))
    user_id, password_in_db = cursor.fetchone() or (None, None)
    connection.close()

    if password == password_in_db:
        session['user_id'] = user_id
        return { 'user_id': user_id, 'msg': 'success' }
    return { 'msg': 'failure' }

@app.route('/api/user/logout')
def user_logout():
    if 'user_id' in session:
        session.pop('user_id')
    return { 'msg': 'success' }

@app.route('/api/user/records')
def user_records():
    if 'user_id' not in session:
        return { 'msg': 'failure' }
    user_id = session['user_id']

    connection = sqlite3.connect(DATABASE)
    cursor = connection.cursor()
    cursor.execute('SELECT * FROM Record WHERE user_id = ?', (user_id,))
    records = cursor.fetchall()
    connection.close()

    return { 'records': records }

@app.route('/api/user/register', methods=['POST'])
def user_register():
    username = request.form['username']
    password = request.form['password']

    connection = sqlite3.connect(DATABASE)
    cursor = connection.cursor()
    cursor.execute("INSERT INTO User (username, password) VALUES (?, ?)", (username, password))
    connection.commit()
    connection.close()

    return { 'user_id': cursor.lastrowid }
