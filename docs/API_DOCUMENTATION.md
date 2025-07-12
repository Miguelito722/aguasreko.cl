# Aguas Reko API Documentation

## Table of Contents
- [Overview](#overview)
- [Authentication](#authentication)
- [Base URLs](#base-urls)
- [Common Headers](#common-headers)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [API Endpoints](#api-endpoints)
  - [Authentication Endpoints](#authentication-endpoints)
  - [User Management](#user-management)
  - [Product Management](#product-management)
  - [Order Management](#order-management)
  - [Payment Processing](#payment-processing)
  - [Enterprise Quotes](#enterprise-quotes)
  - [Webhook Endpoints](#webhook-endpoints)
- [SDK and Tools](#sdk-and-tools)
- [Changelog](#changelog)

## Overview

The Aguas Reko API provides programmatic access to our water delivery platform. This RESTful API allows you to manage users, products, orders, payments, and enterprise quotes.

**API Version:** v1  
**Last Updated:** 2025-01-03  
**Base URL:** `https://api.aguasreko.cl/v1`

## Authentication

### Bearer Token Authentication
All API requests require authentication using Bearer tokens.

```http
Authorization: Bearer YOUR_API_TOKEN
```

### API Key Authentication (Webhooks)
Webhook endpoints use API key authentication.

```http
X-API-Key: YOUR_API_KEY
```

### Getting an Access Token

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

## Base URLs

| Environment | Base URL |
|-------------|----------|
| Production  | `https://api.aguasreko.cl/v1` |
| Staging     | `https://staging-api.aguasreko.cl/v1` |
| Development | `https://dev-api.aguasreko.cl/v1` |

## Common Headers

```http
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN
X-API-Version: v1
X-Request-ID: unique-request-id
User-Agent: YourApp/1.0
```

## Error Handling

### Standard Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid parameters",
    "details": [
      {
        "field": "email",
        "message": "Email format is invalid"
      }
    ],
    "request_id": "req_123456789",
    "timestamp": "2025-01-03T10:30:00Z"
  }
}
```

### HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request parameters |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation errors |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |
| 502 | Bad Gateway - Upstream service error |
| 503 | Service Unavailable - Service temporarily unavailable |

### Common Error Codes

| Error Code | Description |
|------------|-------------|
| `AUTHENTICATION_REQUIRED` | Valid authentication token required |
| `INVALID_TOKEN` | Authentication token is invalid or expired |
| `VALIDATION_ERROR` | Request validation failed |
| `RESOURCE_NOT_FOUND` | Requested resource does not exist |
| `RATE_LIMIT_EXCEEDED` | API rate limit exceeded |
| `PAYMENT_FAILED` | Payment processing failed |
| `INSUFFICIENT_PERMISSIONS` | User lacks required permissions |

## Rate Limiting

API requests are rate limited to ensure fair usage:

- **Authenticated requests:** 1000 requests per hour
- **Unauthenticated requests:** 100 requests per hour
- **Payment endpoints:** 50 requests per hour

Rate limit headers are included in all responses:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1641024000
```

## API Endpoints

### Authentication Endpoints

#### POST /auth/login
Authenticate user and obtain access token.

**Request:**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@aguasreko.cl",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "user": {
    "id": "usr_123456",
    "email": "user@aguasreko.cl",
    "name": "Juan Pérez",
    "phone": "+56912345678",
    "verified": true
  }
}
```

#### POST /auth/register
Register a new user account.

**Request:**
```http
POST /auth/register
Content-Type: application/json

{
  "email": "newuser@aguasreko.cl",
  "password": "securepassword123",
  "name": "María González",
  "phone": "+56987654321",
  "address": "Los Onas 1091",
  "city": "Los Ángeles",
  "region": "Biobío"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "usr_789012",
    "email": "newuser@aguasreko.cl",
    "name": "María González",
    "phone": "+56987654321",
    "address": "Los Onas 1091",
    "city": "Los Ángeles",
    "region": "Biobío",
    "verified": false,
    "created_at": "2025-01-03T10:30:00Z"
  },
  "message": "User registered successfully. Please verify your email."
}
```

#### POST /auth/refresh
Refresh access token using refresh token.

**Request:**
```http
POST /auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### User Management

#### GET /users/profile
Get current user profile.

**Headers:**
```http
Authorization: Bearer YOUR_TOKEN
```

**Response (200):**
```json
{
  "user": {
    "id": "usr_123456",
    "email": "user@aguasreko.cl",
    "name": "Juan Pérez",
    "phone": "+56912345678",
    "address": "Los Onas 1091",
    "city": "Los Ángeles",
    "region": "Biobío",
    "verified": true,
    "created_at": "2024-01-15T08:30:00Z",
    "updated_at": "2025-01-03T10:30:00Z"
  }
}
```

#### PUT /users/profile
Update user profile.

**Request:**
```http
PUT /users/profile
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Juan Carlos Pérez",
  "phone": "+56912345679",
  "address": "Nueva Dirección 123"
}
```

### Product Management

#### GET /products
Get list of available products.

**Query Parameters:**
- `category` (optional): Filter by category (bidon, dispensador, botellas)
- `limit` (optional): Number of results (default: 20, max: 100)
- `offset` (optional): Pagination offset (default: 0)

**Request:**
```http
GET /products?category=bidon&limit=10
```

**Response (200):**
```json
{
  "products": [
    {
      "id": "prod_123",
      "name": "Bidón Retornable 20L",
      "description": "La opción ideal para tu dispensador...",
      "price": 3500,
      "currency": "CLP",
      "category": "bidon",
      "image_url": "https://images.aguasreko.cl/bidon-20l.jpg",
      "in_stock": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "total": 4,
    "limit": 10,
    "offset": 0,
    "has_more": false
  }
}
```

#### GET /products/{product_id}
Get specific product details.

**Response (200):**
```json
{
  "product": {
    "id": "prod_123",
    "name": "Bidón Retornable 20L",
    "description": "La opción ideal para tu dispensador. Perfecto para mantener a toda la familia hidratada. ¡Sustentable y conveniente!",
    "price": 3500,
    "currency": "CLP",
    "category": "bidon",
    "image_url": "https://images.aguasreko.cl/bidon-20l.jpg",
    "specifications": {
      "volume": "20L",
      "material": "PET reciclable",
      "returnable": true
    },
    "in_stock": true,
    "stock_quantity": 150,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2025-01-03T09:00:00Z"
  }
}
```

### Order Management

#### POST /orders
Create a new order.

**Request:**
```http
POST /orders
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "items": [
    {
      "product_id": "prod_123",
      "quantity": 2
    },
    {
      "product_id": "prod_456",
      "quantity": 1
    }
  ],
  "delivery_address": {
    "street": "Los Onas 1091",
    "city": "Los Ángeles",
    "region": "Biobío",
    "postal_code": "4440000"
  },
  "delivery_notes": "Entregar en horario de oficina",
  "preferred_delivery_date": "2025-01-05"
}
```

**Response (201):**
```json
{
  "order": {
    "id": "ord_789012",
    "status": "pending",
    "items": [
      {
        "product_id": "prod_123",
        "product_name": "Bidón Retornable 20L",
        "quantity": 2,
        "unit_price": 3500,
        "total_price": 7000
      }
    ],
    "subtotal": 7000,
    "delivery_fee": 0,
    "total": 7000,
    "currency": "CLP",
    "delivery_address": {
      "street": "Los Onas 1091",
      "city": "Los Ángeles",
      "region": "Biobío"
    },
    "estimated_delivery": "2025-01-05T14:00:00Z",
    "created_at": "2025-01-03T10:30:00Z"
  }
}
```

#### GET /orders
Get user's order history.

**Query Parameters:**
- `status` (optional): Filter by status (pending, confirmed, delivered, cancelled)
- `limit` (optional): Number of results (default: 20)
- `offset` (optional): Pagination offset

**Response (200):**
```json
{
  "orders": [
    {
      "id": "ord_789012",
      "status": "delivered",
      "total": 7000,
      "currency": "CLP",
      "items_count": 2,
      "delivery_date": "2025-01-02T14:30:00Z",
      "created_at": "2025-01-01T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 15,
    "limit": 20,
    "offset": 0,
    "has_more": false
  }
}
```

#### GET /orders/{order_id}
Get specific order details.

**Response (200):**
```json
{
  "order": {
    "id": "ord_789012",
    "status": "delivered",
    "items": [
      {
        "product_id": "prod_123",
        "product_name": "Bidón Retornable 20L",
        "quantity": 2,
        "unit_price": 3500,
        "total_price": 7000
      }
    ],
    "subtotal": 7000,
    "delivery_fee": 0,
    "total": 7000,
    "currency": "CLP",
    "payment_status": "paid",
    "delivery_address": {
      "street": "Los Onas 1091",
      "city": "Los Ángeles",
      "region": "Biobío"
    },
    "tracking": {
      "status": "delivered",
      "delivered_at": "2025-01-02T14:30:00Z",
      "driver_name": "Carlos Mendoza",
      "driver_phone": "+56912345678"
    },
    "created_at": "2025-01-01T10:30:00Z",
    "updated_at": "2025-01-02T14:30:00Z"
  }
}
```

### Payment Processing

#### POST /payments/webpay/create
Create Webpay Plus transaction.

**Request:**
```http
POST /payments/webpay/create
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "order_id": "ord_789012",
  "amount": 7000,
  "currency": "CLP",
  "return_url": "https://aguasreko.cl/payment-return",
  "customer": {
    "email": "user@aguasreko.cl",
    "name": "Juan Pérez"
  }
}
```

**Response (201):**
```json
{
  "transaction": {
    "token": "01ab23cd45ef67890123456789abcdef",
    "url": "https://webpay3gint.transbank.cl/webpayserver/initTransaction",
    "amount": 7000,
    "order_id": "ord_789012",
    "session_id": "session_123456789",
    "expires_at": "2025-01-03T11:30:00Z"
  }
}
```

#### POST /payments/webpay/confirm
Confirm Webpay Plus transaction.

**Request:**
```http
POST /payments/webpay/confirm
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "token": "01ab23cd45ef67890123456789abcdef"
}
```

**Response (200):**
```json
{
  "transaction": {
    "status": "AUTHORIZED",
    "transaction_id": "WP_123456789",
    "amount": 7000,
    "currency": "CLP",
    "authorization_code": "123456",
    "card_number": "****1234",
    "card_type": "Visa",
    "installments": 0,
    "order_id": "ord_789012",
    "processed_at": "2025-01-03T10:35:00Z"
  }
}
```

#### POST /payments/mach/create
Create Mach payment.

**Request:**
```http
POST /payments/mach/create
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "order_id": "ord_789012",
  "amount": 7000,
  "currency": "CLP",
  "description": "Aguas Reko - Pedido #789012",
  "customer": {
    "email": "user@aguasreko.cl",
    "phone": "+56912345678",
    "name": "Juan Pérez"
  }
}
```

**Response (201):**
```json
{
  "payment": {
    "payment_id": "mach_abc123def456",
    "qr_code": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "deep_link": "mach://pay?id=abc123def456",
    "amount": 7000,
    "currency": "CLP",
    "status": "pending",
    "expires_at": "2025-01-03T11:30:00Z"
  }
}
```

### Enterprise Quotes

#### POST /quotes/enterprise
Create enterprise quote request.

**Request:**
```http
POST /quotes/enterprise
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "company_name": "Empresa Ejemplo S.A.",
  "contact_name": "María González",
  "email": "maria@empresa.cl",
  "phone": "+56987654321",
  "address": "Av. Principal 123",
  "city": "Los Ángeles",
  "region": "Biobío",
  "employee_count": "51-100",
  "monthly_consumption": "alto",
  "service_types": ["bidones", "dispensadores"],
  "additional_services": ["delivery", "maintenance"],
  "comments": "Necesitamos servicio para 3 oficinas"
}
```

**Response (201):**
```json
{
  "quote": {
    "id": "quote_123456",
    "status": "pending",
    "company_name": "Empresa Ejemplo S.A.",
    "contact_name": "María González",
    "estimated_monthly_cost": 85000,
    "currency": "CLP",
    "valid_until": "2025-02-03T10:30:00Z",
    "created_at": "2025-01-03T10:30:00Z"
  },
  "message": "Quote request received. Our sales team will contact you within 24 hours."
}
```

#### GET /quotes/enterprise/{quote_id}
Get enterprise quote details.

**Response (200):**
```json
{
  "quote": {
    "id": "quote_123456",
    "status": "pending",
    "company_name": "Empresa Ejemplo S.A.",
    "contact_name": "María González",
    "email": "maria@empresa.cl",
    "phone": "+56987654321",
    "employee_count": "51-100",
    "service_types": ["bidones", "dispensadores"],
    "estimated_monthly_cost": 85000,
    "currency": "CLP",
    "valid_until": "2025-02-03T10:30:00Z",
    "sales_rep": {
      "name": "Carlos Ventas",
      "email": "carlos@aguasreko.cl",
      "phone": "+56911111111"
    },
    "created_at": "2025-01-03T10:30:00Z",
    "updated_at": "2025-01-03T10:30:00Z"
  }
}
```

### Webhook Endpoints

#### POST /webhooks/webpay
Webpay Plus webhook for payment notifications.

**Headers:**
```http
Content-Type: application/json
Tbk-Signature: sha256=abc123def456...
```

**Request Body:**
```json
{
  "transaction_id": "WP_123456789",
  "order_id": "ord_789012",
  "status": "AUTHORIZED",
  "amount": 7000,
  "authorization_code": "123456",
  "timestamp": "2025-01-03T10:35:00Z"
}
```

**Response (200):**
```json
{
  "status": "processed",
  "message": "Webhook processed successfully"
}
```

#### POST /webhooks/mach
Mach webhook for payment notifications.

**Headers:**
```http
Content-Type: application/json
Mach-Signature: base64encodedhmac...
```

**Request Body:**
```json
{
  "payment_id": "mach_abc123def456",
  "order_id": "ord_789012",
  "status": "approved",
  "amount": 7000,
  "timestamp": "2025-01-03T10:35:00Z"
}
```

## SDK and Tools

### Official SDKs

#### JavaScript/Node.js SDK
```bash
npm install @aguasreko/api-client
```

```javascript
import { AguasRekoAPI } from '@aguasreko/api-client';

const client = new AguasRekoAPI({
  apiKey: 'your-api-key',
  environment: 'production' // or 'staging', 'development'
});

// Get products
const products = await client.products.list();

// Create order
const order = await client.orders.create({
  items: [{ product_id: 'prod_123', quantity: 2 }]
});
```

#### Python SDK
```bash
pip install aguasreko-api
```

```python
from aguasreko import AguasRekoAPI

client = AguasRekoAPI(
    api_key='your-api-key',
    environment='production'
)

# Get products
products = client.products.list()

# Create order
order = client.orders.create({
    'items': [{'product_id': 'prod_123', 'quantity': 2}]
})
```

### Postman Collection

Import our Postman collection for easy API testing:

```bash
curl -o aguasreko-api.postman_collection.json \
  https://api.aguasreko.cl/docs/postman/collection.json
```

### OpenAPI Specification

Download the OpenAPI 3.0 specification:

```bash
curl -o aguasreko-openapi.yaml \
  https://api.aguasreko.cl/docs/openapi.yaml
```

## Testing

### Test Environment

Use our sandbox environment for testing:

**Base URL:** `https://staging-api.aguasreko.cl/v1`

### Test Credentials

```json
{
  "email": "test@aguasreko.cl",
  "password": "testpassword123"
}
```

### Test Payment Cards

#### Webpay Plus Test Cards
- **Approved:** 4051885600446623
- **Rejected:** 4051885600446631
- **Timeout:** 4051885600446649

#### Mach Test Environment
- Use sandbox credentials provided in developer portal

## Changelog

### v1.2.0 (2025-01-03)
- Added enterprise quote endpoints
- Enhanced error response format
- Added pagination to product listings

### v1.1.0 (2024-12-15)
- Added Mach payment integration
- Improved webhook security
- Added order tracking endpoints

### v1.0.0 (2024-11-01)
- Initial API release
- Basic CRUD operations for users, products, orders
- Webpay Plus integration
- Webhook support

---

## Support

For API support, contact:
- **Email:** api-support@aguasreko.cl
- **Documentation:** https://docs.aguasreko.cl
- **Status Page:** https://status.aguasreko.cl
- **Developer Portal:** https://developers.aguasreko.cl

## Legal

- [Terms of Service](https://aguasreko.cl/terms)
- [Privacy Policy](https://aguasreko.cl/privacy)
- [API Terms](https://aguasreko.cl/api-terms)