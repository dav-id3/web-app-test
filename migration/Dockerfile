FROM python:3.11.0-alpine
WORKDIR /workspace

ENV TZ 'Asia/Tokyo'
ENV PYTHONPATH /workspace:${PYTHONPATH}

RUN apk add --update-cache --no-cache \
    build-base \
    gcc \
    libc-dev \
    libevent-dev \
    libffi-dev \
    mariadb-dev \
    musl-dev \
    python3-dev

COPY Pipfile Pipfile.lock ./

RUN pip install --upgrade pip && \
    pip install pipenv --no-cache-dir && \
    export PIPENV_INSTALL_TIMEOUT=9999 && \
    pipenv install --system --deploy --dev && \
    pip uninstall -y pipenv virtualenv-clone virtualenv

COPY alembic.ini pyproject.toml ./

CMD ["bin/ash"]
