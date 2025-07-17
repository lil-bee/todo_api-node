# Todo List API

RESTful API untuk mengelola todo list dengan autentikasi user. Dibuat menggunakan Express.js, TypeScript, dan PostgreSQL.

## Tech Stack

- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Testing**: Jest + Supertest

## Features

- User registration & login
- CRUD operations untuk todo
- JWT authentication
- User authorization (user hanya bisa akses todo milik sendiri)
- Pagination untuk list todo
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
npm install
```

3. Setup environment variables:
```env
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/todolist
JWT_SECRET=your-jwt-secret
```

4. Setup database dan jalankan server:
```bash
npm run db:migrate
npm run dev
```

## API Endpoints

### Authentication
- `POST /register` - Register user baru
- `POST /login` - Login user

### Todo Operations (perlu token di header)
- `POST /todos` - Buat todo baru
- `GET /todos?page=1&limit=10` - Ambil semua todo (dengan pagination)
- `PUT /todos/:id` - Update todo
- `DELETE /todos/:id` - Hapus todo

## Example Usage

**Register:**
```
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"password"}'
```

**Create Todo:**
```
curl -X POST http://localhost:3000/todos \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy groceries","description":"Milk, eggs, bread"}'
```

## Testing

```bash
npm test
```

## Database Schema

**Users**: id, name, email, password, created_at, updated_at
**Todos**: id, title, description, completed, user_id, created_at, updated_at

---

Project dari [roadmap.sh](https://roadmap.sh) Backend Developer track.
