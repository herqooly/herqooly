FROM ubuntu:xenial

RUN apt-get update && \
    apt-get install -y software-properties-common && \
    add-apt-repository ppa:deadsnakes/ppa && \
    apt-get update && \
    apt-get install -y python3.6 python3.6-dev python3-pip

RUN rm -f /usr/bin/python && ln -s /usr/bin/python3.6 /usr/bin/python
RUN rm -f /usr/bin/python3 && ln -s /usr/bin/python3.6 /usr/bin/python3

RUN pip3 install jupyter numpy pandas sklearn plotly requests Send2Trash

RUN useradd -ms /bin/bash admin

WORKDIR /app

ADD ./docker/jupyter /app/docker/jupyter
RUN mkdir -p /app/sandbox
RUN chown -R admin:admin /app/sandbox
USER admin

