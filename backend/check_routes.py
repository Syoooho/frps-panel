from app.main import app

print("所有注册的路由:")
for route in app.routes:
    if hasattr(route, 'methods'):
        print(f"{list(route.methods)} {route.path}")
