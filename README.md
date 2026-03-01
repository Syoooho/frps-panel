# FRP SaaS Platform

A modern SaaS platform for FRP (Fast Reverse Proxy) service, providing internal network penetration services for individual developers.

[中文文档](./README_zh.md)

## Features

- User registration and email login
- Subscription activation via redemption codes (Monthly: 10 ports, Yearly: 100 ports)
- Tunnel management (TCP/UDP/HTTP/HTTPS)
- Admin dashboard
- Unlimited traffic
- Multi-user authentication
- Port, domain, and subdomain restrictions

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Zustand (State Management)
- React Router v6
- React Hook Form

### Backend
- FastAPI
- SQLAlchemy + SQLite
- JWT Authentication
- Bcrypt Password Hashing
- Pydantic Data Validation

### Plugin
- Go 1.21+
- FRP >= 0.52.0

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- uv (Python package manager)
- npm

### 1. Initialize Database

```bash
cd backend
uv run python -m app.init_db
```

### 2. Start Backend Service

```bash
cd backend
uv run uvicorn app.main:app --reload
```

Backend will run at http://localhost:8000
- API Documentation: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### 3. Start Frontend Application

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at http://localhost:3000

### 4. Test API

```bash
cd backend
uv run python test_api.py
```

## Test Accounts

- **Admin**: admin@example.com / admin123
- **User**: test@example.com / test1234 (with monthly subscription)

Test Redemption Codes:
- Monthly: MONTHLY-TEST-0000 ~ 0004
- Yearly: YEARLY-TEST-0000 ~ 0004

## Project Structure

```
frps-panel/
├── backend/          # FastAPI backend service
├── frontend/         # React frontend application
├── frp-plugin/       # Go FRP plugin
├── docs/            # Documentation
│   ├── api/         # API documentation
│   └── plans/       # Design documents
├── scripts/         # Utility scripts
└── test_integration.md  # Integration test report
```

## Development Status

### Completed ✅

- Project scaffolding (Frontend + Backend)
- User authentication system
- Complete frontend implementation
- Complete backend API implementation
- Frontend-backend integration
- API documentation
- Database initialization
- Integration testing

### In Progress 🚧

- Frontend feature testing
- Go plugin integration

### TODO 📋

- FRP plugin communication interface
- WebSocket real-time status push
- Email notification system
- Multi-node support
- System monitoring and logging

## Documentation

- [API Documentation](./docs/api/README.md)
- [Integration Test Report](./test_integration.md)
- [Architecture Design](./docs/plans/2026-03-01-frp-saas-architecture.md)
- [Database Design](./docs/plans/2026-03-01-frp-saas-database.md)
- [Frontend Design](./docs/plans/2026-03-01-frp-saas-frontend.md)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

Based on [frps-panel](https://github.com/yhl452493373/frps-panel) by yhl452493373
