# Use the official Python image from the Docker Hub
FROM python:3.10-slim

# Set environment variables
ENV PYTHONUNBUFFERED 1

# Set working directory
WORKDIR /code

# Copy the requirements file to the working directory
COPY requirements.txt /code/requirements.txt

# Install dependencies
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy the rest of the application code to the working directory
COPY . /code

# Expose the port the app runs on

ENTRYPOINT ["./entrypoint.sh"]