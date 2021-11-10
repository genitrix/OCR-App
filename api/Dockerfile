FROM python:3.8

RUN apt update -y && \
    apt install -y libglib2.0-0 libgl1-mesa-dev libsm6 libxext6 libxrender-dev && \
    apt autoremove -y && \
    apt clean -y

WORKDIR /app
ADD . /app

RUN mkdir image
RUN --mount=type=cache,target=/root/.cache \
    pip install -i https://pypi.tuna.tsinghua.edu.cn/simple -r requirements.txt
RUN python db.py

ENV FLASK_APP=main.py
CMD [ "flask", "run", "--host=0.0.0.0" ]
