# Todo List API

RESTful API for managing todo lists with user authentication. Built with Express.js, TypeScript, and PostgreSQL.

## Tech Stack

- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Testing**: Jest + Supertest
- **Package Manager**: pnpm

## Features

- User registration & login
- CRUD operations for todos
- JWT authentication
- User authorization (users can only access their own todos)
- Pagination for todo list
- Input validation
- Unit testing

## Installation

1. Clone repository:
```bash
git clone <repository-url>
cd todo-list-api
```

2. Install dependencies:
```bash
pnpm install
```

3. Setup environment variables:
```env
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/todolist
JWT_SECRET=your-jwt-secret
```

4. Setup database and run server:
```bash
pnpm run db:migrate
pnpm run dev
```

## API Endpoints

### Authentication
- `POST /register` - Register new user
- `POST /login` - Login user

### Todo Operations (requires token in header)
- `POST /todos` - Create new todo
- `GET /todos?page=1&limit=10` - Get all todos (with pagination)
- `PUT /todos/:id` - Update todo
- `DELETE /todos/:id` - Delete todo

## Testing Endpoints

Use the provided `.rest` files to test the API endpoints:

- `auth.rest` - Authentication endpoints
- `todos.rest` - Todo CRUD operations

**VS Code users**: Install REST Client extension to run these files directly.

## Testing

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage
```

## Database Schema

**Users**: id, name, email, password, created_at, updated_at  
**Todos**: id, title, description, completed, user_id, created_at, updated_at

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm test` - Run tests
- `pnpm db:migrate` - Run database migrations

---

Project from [roadmap.sh](https://roadmap.sh) Backend Developer track.
