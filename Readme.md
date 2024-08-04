# Django-Basics

Welcome to the Django-Basics project! This is a Django-based application designed to provide a structured and scalable foundation for building web applications. This README will guide you through the structure of the project, how to set it up, and basic usage instructions.

## Table of Contents
- [Running the Project](#running-the-project)
  - [Using Django's Development Server](#using-djangos-development-server)
  - [Using Docker](#using-docker)
- [Project Structure Details](#project-structure-details)
  - [authenticator](#authenticator)
  - [dockerize](#dockerize)
  - [portfolio_start](#portfolio_start)
  - [portfolio_with_bootstrap](#portfolio_with_bootstrap)

## Project Structure

## Running the Project

### Using Django's Development Server

To start the development server, run the following command:

```bash
python manage.py runserver
```
### Using Docker

To start the project using Docker, navigate to the \`dockerize\` directory and run:

```bash
docker-compose up --build
```

## Project Structure Details

### portfolio_start
This module contains the initial project structure with no additional features.

- **base**: Contains the main Django application with models, views, templates, etc.
- **start**: Contains Django project settings, URLs, and WSGI/ASGI configurations.

### portfolio_with_bootstrap
This module contains the project structure with Bootstrap added for styling.
- **base**: Contains the main Django application with models, views, templates, etc.
- **start**: Contains Django project settings, URLs, and WSGI/ASGI configurations.

### authenticator

This module handles user authentication.

- **base**: Contains the main Django application with models, views, templates, etc.
- **start**: Contains Django project settings, URLs, and WSGI/ASGI configurations.

### dockerize

This module is for containerizing the project using Docker.

- **Makefile**: Contains commands for Docker.
- **docker-compose.yml**: Docker Compose configuration file.
- **project**: Contains Docker-specific Django settings and configuration files.
