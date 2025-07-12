# API Endpoint Documentation Template

Use this template for documenting new API endpoints.

## Endpoint Name

Brief description of what this endpoint does.

### HTTP Method and URL
```
METHOD /endpoint/path
```

### Authentication
- [ ] Required
- [ ] Optional
- [ ] Not required

**Authentication Type:** Bearer Token / API Key / None

### Request

#### Headers
```http
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN
X-Custom-Header: value
```

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Resource identifier |

#### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `limit` | integer | No | 20 | Number of results to return |
| `offset` | integer | No | 0 | Pagination offset |

#### Request Body
```json
{
  "field1": "string",
  "field2": 123,
  "field3": {
    "nested_field": "value"
  }
}
```

#### Request Body Schema
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `field1` | string | Yes | Description of field1 |
| `field2` | integer | No | Description of field2 |

### Response

#### Success Response (200)
```json
{
  "data": {
    "id": "resource_123",
    "field1": "value",
    "field2": 123,
    "created_at": "2025-01-03T10:30:00Z"
  },
  "meta": {
    "request_id": "req_123456789"
  }
}
```

#### Response Schema
| Field | Type | Description |
|-------|------|-------------|
| `data.id` | string | Resource identifier |
| `data.field1` | string | Description of field1 |

#### Error Responses

**400 Bad Request**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "field1",
        "message": "Field is required"
      }
    ]
  }
}
```

**404 Not Found**
```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Resource not found"
  }
}
```

### Rate Limiting
- **Limit:** X requests per hour
- **Headers:** X-RateLimit-Limit, X-RateLimit-Remaining

### Examples

#### cURL Example
```bash
curl -X POST \
  https://api.aguasreko.cl/v1/endpoint \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "field1": "value",
    "field2": 123
  }'
```

#### JavaScript Example
```javascript
const response = await fetch('https://api.aguasreko.cl/v1/endpoint', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    field1: 'value',
    field2: 123
  })
});

const data = await response.json();
```

#### Python Example
```python
import requests

response = requests.post(
    'https://api.aguasreko.cl/v1/endpoint',
    headers={
        'Authorization': 'Bearer YOUR_TOKEN',
        'Content-Type': 'application/json'
    },
    json={
        'field1': 'value',
        'field2': 123
    }
)

data = response.json()
```

### Notes
- Additional notes about the endpoint
- Special considerations
- Related endpoints

### Changelog
- **v1.1.0:** Added new field
- **v1.0.0:** Initial version