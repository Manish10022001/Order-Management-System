# Order Management System

A full-stack order management application built with Next.js, React, Node.js, Express, MongoDB, and Socket.IO. It supports creating orders, viewing and filtering them by store, updating order status in real time, archiving old orders, and exposing analytics endpoints.

## Features

- Create and manage orders across multiple stores
- Filter orders by store and paginate results
- Update order status with real-time UI updates
- Real-time notifications for new orders and status changes
- Archive orders older than 30 days
- View analytics for orders per day, revenue per store, and top-selling items

## Tech Stack

- Frontend: Next.js, React, TypeScript, React Query
- Backend: Node.js, Express, TypeScript, Socket.IO
- Database: MongoDB with Mongoose
- Validation: Zod

## Project Structure

- client/: Next.js frontend
- server/: Express backend and MongoDB integration
- docs/: API documentation

## Prerequisites

- Node.js 18+ and npm
- MongoDB running locally or a MongoDB Atlas connection string

## Setup Instructions

1. Clone the repository and open the project folder.
2. Install dependencies:
   - `cd client && npm install`
   - `cd ../server && npm install`
3. Create environment files:
   - Copy the example files:
     - `cp client/.env.example client/.env.local`
     - `cp server/.env.example server/.env`
   - Update the values if needed.
4. Start MongoDB.
5. Start the backend:
   - `cd server && npm run dev`
6. In a second terminal, start the frontend:
   - `cd client && npm run dev`
7. Open http://localhost:3000

## Environment Variables

### Server

- `PORT`: Backend port (default: 8000)
- `MONGODB_URI`: MongoDB connection string

### Client

- `NEXT_PUBLIC_API_URL`: Backend URL, e.g. http://localhost:8000

## API Documentation

The complete API documentation is available in [docs/API.md](docs/API.md).

## Available Routes

### Orders

- `POST /orders` – create a new order
- `GET /orders` – list orders with optional store filter and pagination
- `GET /orders/:id` – fetch one order by ID
- `PATCH /orders/:id/status` – update order status

### Archival

- `POST /archive-old-orders` – move orders older than 30 days into the archive collection

### Analytics

- `GET /analytics/orders-per-day`
- `GET /analytics/revenue-per-store`
- `GET /analytics/top-selling-items`

### Health

- `GET /health`

## Real-Time Events

The frontend subscribes to Socket.IO events for live updates:

- `order:created`
- `order:status-updated`

Clients join a store room with `store:join` and leave with `store:leave`.
