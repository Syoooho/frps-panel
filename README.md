# FRP SaaS Platform

A modern SaaS platform for FRP (Fast Reverse Proxy) service, providing internal network penetration services for individual developers.

[中文文档](./README_zh.md) | [部署指南](./docs/deployment.md)

## Features

- 🔐 User registration and email login
- 🎫 Subscription activation via redemption codes (Monthly: 10 ports, Yearly: 100 ports)
- 🚇 Tunnel management (TCP/UDP/HTTP/HTTPS)
- 📊 Admin dashboard with real-time monitoring
- ♾️ Unlimited traffic
- 👥 Multi-user authentication
- 🔒 Port, domain, and subdomain restrictions
- 📈 System resource monitoring (CPU, Memory, Disk, FRP status)
- 📝 Structured logging system
- 🔄 Automatic deployment with database protection

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
- Structured Logging

### Plugin
- Go 1.21+
- FRP 0.67.0+

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

### 4. Start FRP Server and Plugin

```bash
# Start FRP Server
cd frp_0.67.0_linux_amd64
./frps -c frps.toml

# Start Plugin (in another terminal)
cd frp-plugin
go build -o frps-panel ./cmd/frps-panel
./frps-panel -c config/frps-panel.toml
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
├── backend/              # FastAPI backend service
│   ├── app/             # Application code
│   │   ├── api/         # API routes
│   │   ├── models/      # Database models
│   │   ├── schemas/     # Pydantic schemas
│   │   ├── services/    # Business logic
│   │   └── core/        # Core utilities
│   ├── logs/            # Application logs
│   └── tests/           # Test files
├── frontend/            # React frontend application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── store/       # State management
│   │   └── utils/       # Utility functions
│   └── public/          # Static assets
├── frp-plugin/          # Go FRP plugin
│   ├── cmd/             # Command entry
│   ├── config/          # Configuration files
│   └── pkg/             # Plugin packages
├── docs/                # Documentation
│   ├── api/             # API documentation
│   └── plans/           # Design documents
├── scripts/             # Utility scripts
│   ├── rollback.sh      # Rollback script
│   └── ...
└── .github/             # GitHub Actions workflows
    └── workflows/
        └── deploy.yml   # Auto deployment
```

## Development Status

### Completed ✅

- ✅ Project scaffolding (Frontend + Backend + Plugin)
- ✅ User authentication system (Registration, Login, JWT)
- ✅ Complete frontend implementation (All pages and components)
- ✅ Complete backend API implementation (All endpoints)
- ✅ Frontend-backend integration (100% API tested)
- ✅ FRP plugin integration (Go plugin with HTTP server)
- ✅ System monitoring and logging (CPU, Memory, Disk, FRP status)
- ✅ Tunnel management (Create, Edit, Delete, Copy config)
- ✅ Admin dashboard (User management, Code management, System config)
- ✅ Database initialization and migration
- ✅ API documentation (Swagger UI)
- ✅ Automatic deployment (GitHub Actions)
- ✅ Database protection (Backup and restore on deployment)
- ✅ Rollback script (Easy rollback to previous version)

### TODO 📋

- WebSocket real-time status push
- Email notification system
- Multi-node support

## Documentation

- [部署指南](./docs/deployment.md) - Production deployment guide
- [API 文档](./docs/api/README.md) - API documentation
- [集成测试报告](./backend/tests/test_integration.md) - Integration test report

## Deployment

See [Deployment Guide](./docs/deployment.md) for production deployment instructions.

### Quick Deploy

The project includes automatic deployment via GitHub Actions. Simply push to the main branch:

```bash
git push origin main
```

### Rollback

If you need to rollback to a previous version:

```bash
ssh root@your-server
cd /opt/frps-panel
./scripts/rollback.sh
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

Based on [frps-panel](https://github.com/yhl452493373/frps-panel) by yhl452493373
