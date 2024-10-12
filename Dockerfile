# Use an official Python runtime as the base image
FROM python:3.9-slim-buster

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory in the container
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy the project files into the container
COPY . .

# Install Node.js and npm
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - \
    && apt-get install -y nodejs


# Expose the port the app runs on
EXPOSE 5000

# Run the application
CMD ["python", "run.py"]