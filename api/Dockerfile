FROM python:3.11-slim-buster
WORKDIR /workspace

ENV PYTHONPATH /workspace:${PYTHONPATH}
ENV LD_LIBRARY_PATH /workspace/instantclient:${LD_LIBRARY_PATH}

RUN apt-get update && \
    apt-get upgrade -y && \ 
    apt-get install -y --no-install-recommends \
        build-essential \
        python3-dev \
        default-libmysqlclient-dev \
        libaio1 \
        && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY ../Pipfile ../Pipfile.lock ./

RUN apk add gcc python3-dev libc-dev mariadb-dev && \
    pip install --upgrade pip && \
    pip install pipenv --no-cache-dir && \
    export PIPENV_INSTALL_TIMEOUT=9999 && \
    pipenv install --system --deploy --dev && \
    pip uninstall -y pipenv virtusalenv-clone virtualenv

COPY gunicorn.cfg.py pyproject.toml ./

COPY src/ src/

CMD ["guvicorn", "--config-gunicorn.cfg.py","src.main:app"]
