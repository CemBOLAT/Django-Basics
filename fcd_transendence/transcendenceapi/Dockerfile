FROM python:3.10-slim

# Set the working directory
WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Remove unnecessary packages
RUN apt-get purge -y --auto-remove gcc

# Make port 8000 available to the world outside this container
EXPOSE 8000

COPY ./pythonsh.sh /app

# Ensure the script is executable
RUN chmod +x pythonsh.sh

# Run app.py when the container launches
ENTRYPOINT ["./pythonsh"]
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "transendenceapi.asgi:application"]
