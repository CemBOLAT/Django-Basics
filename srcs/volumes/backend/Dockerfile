
FROM python:3.8-slim

# Set environment variables
# This is to prevent Python from writing pyc files
# This is to prevent Python from buffering stdout and stderr
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

EXPOSE 8000

# Set working directory
WORKDIR /app

# Install dependencies
COPY ./requirements.txt /app/requirements.txt

RUN apt-get update && \
    apt-get install -y postgresql-client && \
    pip install --upgrade pip && \
    pip install -no-cache-dir -r /app/requirements.txt

# Copy project
COPY . /app

# Run start.sh
RUN chmod +x /app/start.sh 

ENTRYPOINT ["/app/start.sh"]