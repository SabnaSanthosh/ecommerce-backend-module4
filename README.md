# E-Commerce Backend System — Module 4

## Setup (Windows)
1. Install Node.js 18+ and MongoDB (or use MongoDB Atlas).
2. Copy `.env.example` to `.env`; set a long random `JWT_SECRET` and your MongoDB URI.
3. In this folder run `npm install`, then `npm run dev`.
4. Check http://localhost:5000/api/health.

## First admin
Register normally; public registration always creates a `user`. In mongosh:
```js
use ecommerce_backend
db.users.updateOne({email:"your-email@example.com"},{$set:{role:"admin"}})
```
Log in again to get a token with the admin role. Never expose public admin registration.

## API endpoints (base http://localhost:5000)
- POST `/api/auth/register` body `{ "name":"Asha", "email":"asha@example.com", "password":"Password123" }`
- POST `/api/auth/login` body `{ "email":"asha@example.com", "password":"Password123" }`
- GET `/api/auth/me` authenticated
- GET `/api/products?search=phone&category=Electronics&minPrice=10&maxPrice=500&sort=price&order=asc&page=1&limit=20`
- GET `/api/products/:id`
- POST/PUT/DELETE `/api/products` (POST/PUT/DELETE require admin; PUT/DELETE include `/:id`)
- GET/PATCH `/api/users/me` authenticated
- GET `/api/users`, PATCH `/api/users/:id/role`, DELETE `/api/users/:id` admin only
- POST `/api/orders` body `{ "items":[{"productId":"PRODUCT_ID","quantity":2}], "shippingAddress":"10 Main Street" }`
- GET `/api/orders`, GET `/api/orders/:id`, DELETE `/api/orders/:id` authenticated
- PATCH `/api/orders/:id/status` admin
- GET `/api/analytics/recommendations?limit=5` authenticated

For protected Postman requests use Authorization > Bearer Token and paste the login token.

## RapidMiner
Set `RAPIDMINER_ENDPOINT` to your deployed RapidMiner process endpoint. The adapter POSTs JSON `{userId, limit}` and expects JSON response (ideally `{ "recommendations": [...] }`). Adjust authentication and payload to your RapidMiner deployment. If unset/failing, API uses newest products as a labelled fallback; that fallback is not predictive analytics.

## GitHub
Commit `.env.example`, never `.env`. `.gitignore` excludes environment secrets and node_modules.
