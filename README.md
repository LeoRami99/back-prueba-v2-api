<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Back-Prueba API

A NestJS-based backend API implementing Clean Architecture principles with Domain-Driven Design (DDD).

## Description

This project is a backend API built with NestJS that provides services for managing products, transactions, card tokenization, and webhooks. The application follows a Clean Architecture approach, organizing code into modules with distinct layers:

- **Interface Layer**: Controllers and DTOs for handling HTTP requests and responses
- **Application Layer**: Use cases implementing business logic
- **Domain Layer**: Core business entities and repository interfaces
- **Infrastructure Layer**: External implementations including database models and external API integrations

## Architecture

The application is structured using Domain-Driven Design principles with the following layers:

### Module Structure

Each module follows a consistent structure:

```
module/
├── module.module.ts
├── application/
│   └── use-cases/
├── domain/
│   ├── entities/
│   └── repositories/
├── infrastructure/
│   ├── database/
│   └── http/
└── interface/
    ├── controllers/
    └── dtos/
```

### Core Modules

1. **Products Module**: Manages product inventory and stock updates
2. **Transaction Module**: Handles payment transaction processing and tracking
3. **Card Module**: Provides card tokenization for secure payment handling
4. **Webhook Module**: Manages asynchronous notifications and callbacks

## Features

- **Product Management**: CRUD operations for products and inventory control
- **Transaction Processing**: Create and track payment transactions
- **Card Tokenization**: Securely handle payment card information
- **API Documentation**: Swagger/OpenAPI integration for easy API exploration
- **Validation**: Request validation with class-validator
- **Database Integration**: Sequelize ORM with PostgreSQL
- **HTTP Clients**: Axios for external API communication

## API Documentation

The API is documented using Swagger/OpenAPI. Once the application is running, you can access the interactive API documentation at:

```
http://localhost:3000/api/docs
```

This provides a comprehensive view of all available endpoints, request/response schemas, and allows you to test the API directly from the browser.

## Project Setup

```bash
# Install dependencies
$ npm install
```

## Database Configuration

The application uses PostgreSQL with Sequelize ORM. Configure your database connection in the environment variables or `.env` file:

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=back_prueba
```

## Running the Application

```bash
# Development mode
$ npm run start

# Watch mode (recommended for development)
$ npm run start:dev

# Production mode
$ npm run start:prod
```

## Testing

```bash
# Unit tests
$ npm run test

# End-to-end tests
$ npm run test:e2e

# Test coverage
$ npm run test:cov
```

## Docker Support

The application includes Docker support for easy containerization and deployment:

```bash
# Build and start containers
$ docker-compose up -d
```

## License

This project is [MIT licensed](LICENSE).
