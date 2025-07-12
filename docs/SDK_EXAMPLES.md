# SDK Examples and Integration Guide

## JavaScript/Node.js SDK

### Installation
```bash
npm install @aguasreko/api-client
```

### Basic Usage
```javascript
import { AguasRekoAPI } from '@aguasreko/api-client';

// Initialize client
const client = new AguasRekoAPI({
  apiKey: 'your-api-key',
  environment: 'production', // 'staging', 'development'
  timeout: 30000,
  retries: 3
});

// Authentication
try {
  const auth = await client.auth.login({
    email: 'user@aguasreko.cl',
    password: 'securepassword123'
  });
  
  console.log('Access token:', auth.access_token);
  
  // Set token for subsequent requests
  client.setAccessToken(auth.access_token);
} catch (error) {
  console.error('Login failed:', error.message);
}

// Get products
try {
  const products = await client.products.list({
    category: 'bidon',
    limit: 10
  });
  
  console.log('Products:', products.products);
} catch (error) {
  console.error('Failed to fetch products:', error.message);
}

// Create order
try {
  const order = await client.orders.create({
    items: [
      { product_id: 'prod_123', quantity: 2 },
      { product_id: 'prod_456', quantity: 1 }
    ],
    delivery_address: {
      street: 'Los Onas 1091',
      city: 'Los Ángeles',
      region: 'Biobío'
    }
  });
  
  console.log('Order created:', order.order.id);
} catch (error) {
  console.error('Failed to create order:', error.message);
}

// Process payment
try {
  const payment = await client.payments.webpay.create({
    order_id: order.order.id,
    amount: order.order.total,
    currency: 'CLP',
    return_url: 'https://yourapp.com/payment-return',
    customer: {
      email: 'user@aguasreko.cl',
      name: 'Juan Pérez'
    }
  });
  
  // Redirect user to payment URL
  window.location.href = payment.transaction.url;
} catch (error) {
  console.error('Payment creation failed:', error.message);
}
```

### React Hook Example
```javascript
import { useState, useEffect } from 'react';
import { AguasRekoAPI } from '@aguasreko/api-client';

const useAguasReko = () => {
  const [client] = useState(() => new AguasRekoAPI({
    environment: process.env.NODE_ENV === 'production' ? 'production' : 'staging'
  }));
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const auth = await client.auth.login({ email, password });
      client.setAccessToken(auth.access_token);
      setUser(auth.user);
      return auth;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getProducts = async (filters = {}) => {
    try {
      return await client.products.list(filters);
    } catch (error) {
      throw error;
    }
  };

  const createOrder = async (orderData) => {
    try {
      return await client.orders.create(orderData);
    } catch (error) {
      throw error;
    }
  };

  return {
    client,
    user,
    loading,
    login,
    getProducts,
    createOrder
  };
};

// Usage in component
const ProductList = () => {
  const { getProducts } = useAguasReko();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts({ category: 'bidon' });
        setProducts(response.products);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, [getProducts]);

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  );
};
```

## Python SDK

### Installation
```bash
pip install aguasreko-api
```

### Basic Usage
```python
from aguasreko import AguasRekoAPI
from aguasreko.exceptions import AguasRekoError

# Initialize client
client = AguasRekoAPI(
    environment='production',  # 'staging', 'development'
    timeout=30,
    max_retries=3
)

# Authentication
try:
    auth = client.auth.login(
        email='user@aguasreko.cl',
        password='securepassword123'
    )
    
    print(f"Access token: {auth['access_token']}")
    
    # Set token for subsequent requests
    client.set_access_token(auth['access_token'])
    
except AguasRekoError as e:
    print(f"Login failed: {e.message}")

# Get products
try:
    products = client.products.list(
        category='bidon',
        limit=10
    )
    
    for product in products['products']:
        print(f"Product: {product['name']} - ${product['price']}")
        
except AguasRekoError as e:
    print(f"Failed to fetch products: {e.message}")

# Create order
try:
    order = client.orders.create({
        'items': [
            {'product_id': 'prod_123', 'quantity': 2},
            {'product_id': 'prod_456', 'quantity': 1}
        ],
        'delivery_address': {
            'street': 'Los Onas 1091',
            'city': 'Los Ángeles',
            'region': 'Biobío'
        }
    })
    
    print(f"Order created: {order['order']['id']}")
    
except AguasRekoError as e:
    print(f"Failed to create order: {e.message}")

# Process payment
try:
    payment = client.payments.webpay.create({
        'order_id': order['order']['id'],
        'amount': order['order']['total'],
        'currency': 'CLP',
        'return_url': 'https://yourapp.com/payment-return',
        'customer': {
            'email': 'user@aguasreko.cl',
            'name': 'Juan Pérez'
        }
    })
    
    print(f"Payment URL: {payment['transaction']['url']}")
    
except AguasRekoError as e:
    print(f"Payment creation failed: {e.message}")
```

### Django Integration
```python
# settings.py
AGUASREKO_API_CONFIG = {
    'environment': 'production',
    'timeout': 30,
    'max_retries': 3
}

# services.py
from django.conf import settings
from aguasreko import AguasRekoAPI

class AguasRekoService:
    def __init__(self):
        self.client = AguasRekoAPI(**settings.AGUASREKO_API_CONFIG)
    
    def authenticate_user(self, email, password):
        try:
            auth = self.client.auth.login(email=email, password=password)
            return auth
        except Exception as e:
            raise Exception(f"Authentication failed: {str(e)}")
    
    def get_products(self, category=None, limit=20):
        try:
            filters = {'limit': limit}
            if category:
                filters['category'] = category
            return self.client.products.list(**filters)
        except Exception as e:
            raise Exception(f"Failed to fetch products: {str(e)}")
    
    def create_order(self, user_token, order_data):
        try:
            self.client.set_access_token(user_token)
            return self.client.orders.create(order_data)
        except Exception as e:
            raise Exception(f"Failed to create order: {str(e)}")

# views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
import json

@method_decorator(csrf_exempt, name='dispatch')
class ProductListView(View):
    def __init__(self):
        super().__init__()
        self.aguasreko_service = AguasRekoService()
    
    def get(self, request):
        try:
            category = request.GET.get('category')
            limit = int(request.GET.get('limit', 20))
            
            products = self.aguasreko_service.get_products(
                category=category,
                limit=limit
            )
            
            return JsonResponse(products)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

@method_decorator(csrf_exempt, name='dispatch')
class OrderCreateView(View):
    def __init__(self):
        super().__init__()
        self.aguasreko_service = AguasRekoService()
    
    def post(self, request):
        try:
            data = json.loads(request.body)
            user_token = request.headers.get('Authorization', '').replace('Bearer ', '')
            
            order = self.aguasreko_service.create_order(user_token, data)
            
            return JsonResponse(order, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
```

## PHP SDK

### Installation
```bash
composer require aguasreko/api-client
```

### Basic Usage
```php
<?php
require_once 'vendor/autoload.php';

use AguasReko\ApiClient;
use AguasReko\Exceptions\AguasRekoException;

// Initialize client
$client = new ApiClient([
    'environment' => 'production', // 'staging', 'development'
    'timeout' => 30,
    'max_retries' => 3
]);

// Authentication
try {
    $auth = $client->auth()->login([
        'email' => 'user@aguasreko.cl',
        'password' => 'securepassword123'
    ]);
    
    echo "Access token: " . $auth['access_token'] . "\n";
    
    // Set token for subsequent requests
    $client->setAccessToken($auth['access_token']);
    
} catch (AguasRekoException $e) {
    echo "Login failed: " . $e->getMessage() . "\n";
}

// Get products
try {
    $products = $client->products()->list([
        'category' => 'bidon',
        'limit' => 10
    ]);
    
    foreach ($products['products'] as $product) {
        echo "Product: " . $product['name'] . " - $" . $product['price'] . "\n";
    }
    
} catch (AguasRekoException $e) {
    echo "Failed to fetch products: " . $e->getMessage() . "\n";
}

// Create order
try {
    $order = $client->orders()->create([
        'items' => [
            ['product_id' => 'prod_123', 'quantity' => 2],
            ['product_id' => 'prod_456', 'quantity' => 1]
        ],
        'delivery_address' => [
            'street' => 'Los Onas 1091',
            'city' => 'Los Ángeles',
            'region' => 'Biobío'
        ]
    ]);
    
    echo "Order created: " . $order['order']['id'] . "\n";
    
} catch (AguasRekoException $e) {
    echo "Failed to create order: " . $e->getMessage() . "\n";
}

// Process payment
try {
    $payment = $client->payments()->webpay()->create([
        'order_id' => $order['order']['id'],
        'amount' => $order['order']['total'],
        'currency' => 'CLP',
        'return_url' => 'https://yourapp.com/payment-return',
        'customer' => [
            'email' => 'user@aguasreko.cl',
            'name' => 'Juan Pérez'
        ]
    ]);
    
    echo "Payment URL: " . $payment['transaction']['url'] . "\n";
    
} catch (AguasRekoException $e) {
    echo "Payment creation failed: " . $e->getMessage() . "\n";
}
?>
```

### Laravel Integration
```php
// config/aguasreko.php
<?php
return [
    'environment' => env('AGUASREKO_ENV', 'staging'),
    'timeout' => env('AGUASREKO_TIMEOUT', 30),
    'max_retries' => env('AGUASREKO_MAX_RETRIES', 3),
];

// app/Services/AguasRekoService.php
<?php
namespace App\Services;

use AguasReko\ApiClient;
use AguasReko\Exceptions\AguasRekoException;

class AguasRekoService
{
    private $client;

    public function __construct()
    {
        $this->client = new ApiClient(config('aguasreko'));
    }

    public function authenticateUser($email, $password)
    {
        try {
            return $this->client->auth()->login([
                'email' => $email,
                'password' => $password
            ]);
        } catch (AguasRekoException $e) {
            throw new \Exception("Authentication failed: " . $e->getMessage());
        }
    }

    public function getProducts($category = null, $limit = 20)
    {
        try {
            $filters = ['limit' => $limit];
            if ($category) {
                $filters['category'] = $category;
            }
            return $this->client->products()->list($filters);
        } catch (AguasRekoException $e) {
            throw new \Exception("Failed to fetch products: " . $e->getMessage());
        }
    }

    public function createOrder($userToken, $orderData)
    {
        try {
            $this->client->setAccessToken($userToken);
            return $this->client->orders()->create($orderData);
        } catch (AguasRekoException $e) {
            throw new \Exception("Failed to create order: " . $e->getMessage());
        }
    }
}

// app/Http/Controllers/Api/ProductController.php
<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AguasRekoService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    private $aguasRekoService;

    public function __construct(AguasRekoService $aguasRekoService)
    {
        $this->aguasRekoService = $aguasRekoService;
    }

    public function index(Request $request)
    {
        try {
            $category = $request->query('category');
            $limit = $request->query('limit', 20);

            $products = $this->aguasRekoService->getProducts($category, $limit);

            return response()->json($products);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}

// app/Http/Controllers/Api/OrderController.php
<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AguasRekoService;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    private $aguasRekoService;

    public function __construct(AguasRekoService $aguasRekoService)
    {
        $this->aguasRekoService = $aguasRekoService;
    }

    public function store(Request $request)
    {
        try {
            $userToken = $request->bearerToken();
            $orderData = $request->all();

            $order = $this->aguasRekoService->createOrder($userToken, $orderData);

            return response()->json($order, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
```

## Error Handling Best Practices

### JavaScript
```javascript
import { AguasRekoAPI, AguasRekoError } from '@aguasreko/api-client';

const client = new AguasRekoAPI({ environment: 'production' });

// Comprehensive error handling
const handleApiCall = async (apiCall) => {
  try {
    return await apiCall();
  } catch (error) {
    if (error instanceof AguasRekoError) {
      switch (error.code) {
        case 'AUTHENTICATION_REQUIRED':
          // Redirect to login
          window.location.href = '/login';
          break;
        case 'RATE_LIMIT_EXCEEDED':
          // Show rate limit message
          console.warn('Rate limit exceeded. Please try again later.');
          break;
        case 'VALIDATION_ERROR':
          // Handle validation errors
          console.error('Validation errors:', error.details);
          break;
        default:
          console.error('API Error:', error.message);
      }
    } else {
      console.error('Unexpected error:', error.message);
    }
    throw error;
  }
};

// Usage
const fetchProducts = () => handleApiCall(() => client.products.list());
```

### Python
```python
from aguasreko import AguasRekoAPI
from aguasreko.exceptions import (
    AguasRekoError,
    AuthenticationError,
    ValidationError,
    RateLimitError
)

client = AguasRekoAPI(environment='production')

def handle_api_call(api_call):
    try:
        return api_call()
    except AuthenticationError as e:
        print("Authentication required. Please login.")
        # Handle authentication
    except RateLimitError as e:
        print(f"Rate limit exceeded. Retry after: {e.retry_after}")
        # Handle rate limiting
    except ValidationError as e:
        print(f"Validation errors: {e.details}")
        # Handle validation errors
    except AguasRekoError as e:
        print(f"API Error: {e.message}")
        # Handle general API errors
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        # Handle unexpected errors

# Usage
def fetch_products():
    return handle_api_call(lambda: client.products.list())
```

## Testing Examples

### JavaScript (Jest)
```javascript
import { AguasRekoAPI } from '@aguasreko/api-client';

// Mock the API client
jest.mock('@aguasreko/api-client');

describe('AguasReko API Integration', () => {
  let client;

  beforeEach(() => {
    client = new AguasRekoAPI({ environment: 'test' });
  });

  test('should authenticate user successfully', async () => {
    const mockAuth = {
      access_token: 'mock_token',
      user: { id: 'user_123', email: 'test@example.com' }
    };

    client.auth.login.mockResolvedValue(mockAuth);

    const result = await client.auth.login({
      email: 'test@example.com',
      password: 'password'
    });

    expect(result).toEqual(mockAuth);
    expect(client.auth.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password'
    });
  });

  test('should fetch products with filters', async () => {
    const mockProducts = {
      products: [
        { id: 'prod_1', name: 'Product 1', price: 1000 }
      ],
      pagination: { total: 1, limit: 20, offset: 0 }
    };

    client.products.list.mockResolvedValue(mockProducts);

    const result = await client.products.list({ category: 'bidon' });

    expect(result).toEqual(mockProducts);
    expect(client.products.list).toHaveBeenCalledWith({ category: 'bidon' });
  });

  test('should handle API errors gracefully', async () => {
    const mockError = new Error('API Error');
    mockError.code = 'VALIDATION_ERROR';
    mockError.details = [{ field: 'email', message: 'Invalid email' }];

    client.auth.login.mockRejectedValue(mockError);

    await expect(client.auth.login({
      email: 'invalid-email',
      password: 'password'
    })).rejects.toThrow('API Error');
  });
});
```

### Python (pytest)
```python
import pytest
from unittest.mock import Mock, patch
from aguasreko import AguasRekoAPI
from aguasreko.exceptions import ValidationError

@pytest.fixture
def client():
    return AguasRekoAPI(environment='test')

@patch('aguasreko.ApiClient')
def test_authenticate_user_success(mock_api_client, client):
    # Mock successful authentication
    mock_auth = {
        'access_token': 'mock_token',
        'user': {'id': 'user_123', 'email': 'test@example.com'}
    }
    
    client.auth.login = Mock(return_value=mock_auth)
    
    result = client.auth.login(
        email='test@example.com',
        password='password'
    )
    
    assert result == mock_auth
    client.auth.login.assert_called_once_with(
        email='test@example.com',
        password='password'
    )

@patch('aguasreko.ApiClient')
def test_fetch_products_with_filters(mock_api_client, client):
    # Mock products response
    mock_products = {
        'products': [
            {'id': 'prod_1', 'name': 'Product 1', 'price': 1000}
        ],
        'pagination': {'total': 1, 'limit': 20, 'offset': 0}
    }
    
    client.products.list = Mock(return_value=mock_products)
    
    result = client.products.list(category='bidon')
    
    assert result == mock_products
    client.products.list.assert_called_once_with(category='bidon')

@patch('aguasreko.ApiClient')
def test_handle_validation_error(mock_api_client, client):
    # Mock validation error
    client.auth.login = Mock(side_effect=ValidationError(
        'Validation failed',
        details=[{'field': 'email', 'message': 'Invalid email'}]
    ))
    
    with pytest.raises(ValidationError) as exc_info:
        client.auth.login(
            email='invalid-email',
            password='password'
        )
    
    assert 'Validation failed' in str(exc_info.value)
    assert exc_info.value.details[0]['field'] == 'email'
```

This comprehensive documentation provides developers with everything they need to integrate with the Aguas Reko API, including detailed examples, error handling, and testing strategies.