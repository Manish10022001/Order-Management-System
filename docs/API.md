# API Documentation

## Base URL

- Backend: http://localhost:8000
- Frontend: http://localhost:3000

## Health Check

### GET /health

Returns the backend status.

Response:

```json
{
  "status": "ok"
}
```

## Orders

### POST /orders

Create a new order.

Request body:

```json
{
  "store_id": "store-001",
  "items": [
    {
      "item_id": "burger-001",
      "qty": 2
    }
  ],
  "total_amount": 320
}
```

Validation rules:

- `store_id` is required
- `items` must contain at least one item
- each item requires `item_id` and positive `qty`
- `total_amount` must be positive

Response `201`:

```json
{
  "_id": "64f9...",
  "store_id": "store-001",
  "items": [
    {
      "item_id": "burger-001",
      "qty": 2
    }
  ],
  "total_amount": 320,
  "status": "PLACED",
  "created_at": "2026-08-08T10:00:00.000Z"
}
```

### GET /orders

List orders with optional filtering and pagination.

Query parameters:

- `store_id` (optional): filter by store
- `page` (optional): page number, defaults to 1
- `limit` (optional): page size, defaults to 10

Example:

```http
GET /orders?store_id=store-001&page=1&limit=10
```

Response:

```json
{
  "data": [
    {
      "_id": "64f9...",
      "store_id": "store-001",
      "items": [],
      "total_amount": 320,
      "status": "PLACED",
      "created_at": "2026-08-08T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### GET /orders/:id

Fetch a single order by ID.

### PATCH /orders/:id/status

Update the status of an order.

Request body:

```json
{
  "status": "PREPARING"
}
```

Allowed values:

- `PLACED`
- `PREPARING`
- `COMPLETED`

## Archive

### POST /archive-old-orders

Move orders older than 30 days from the main collection to the archive collection.

Response:

```json
{
  "message": "Old orders archived successfully.",
  "archivedCount": 3,
  "archivedBefore": "2026-07-09T10:00:00.000Z"
}
```

## Analytics

### GET /analytics/orders-per-day

Returns daily order counts.

Response:

```json
{
  "data": [
    {
      "date": "2026-08-01",
      "orders": 12
    }
  ]
}
```

### GET /analytics/revenue-per-store

Returns total revenue grouped by store.

Response:

```json
[
  {
    "_id": "store-001",
    "totalRevenue": 12500
  }
]
```

### GET /analytics/top-selling-items

Returns the top five items by total quantity sold.

Response:

```json
[
  {
    "_id": "burger-001",
    "totalQuantity": 42
  }
]
```

## Socket.IO Events

### Client to server

- `store:join` – join a store-specific room
- `store:leave` – leave a store-specific room

### Server to client

- `order:created` – emitted when a new order is created
- `order:status-updated` – emitted when an order status changes
