# Payment Simulation Backend

I built this project using NestJS and MongoDB to simulate payment transactions for an e-commerce website without requiring users to provide sensitive personal information like PAN card details. This system allows for testing the complete payment flow while maintaining privacy. In the future, I plan to extend this system to integrate with actual payment gateways like Razorpay or Stripe.

## Test Accounts

### Seller Accounts
Use these credentials for seller transactions:

```json
{
  "username": "seller12345",
  "password": "password12345"
}

{
  "username": "seller123456",
  "password": "password123456"
}

{
  "username": "seller1234",
  "password": "password1234"
}

{
  "username": "seller123",
  "password": "password123"
}

{
  "username": "seller12",
  "password": "password12"
}
```

### Buyer Accounts
Use these credentials for buyer transactions:

```json
{
  "username": "buyer12",
  "password": "password12"
}

{
  "username": "buyer123",
  "password": "password123"
}

{
  "username": "buyer1234",
  "password": "password1234"
}

{
  "username": "buyer12345",
  "password": "password12345"
}

{
  "username": "buyer123456",
  "password": "password123456"
}
```

These accounts can be used to test the payment simulation functionality in the system.