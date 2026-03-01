from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./frps_panel.db"
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    ADMIN_EMAIL: str = "admin@example.com"
    ADMIN_PASSWORD: str = "admin123"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True
    FRP_PLUGIN_URL: str = "http://localhost:7200"
    
    class Config:
        env_file = ".env"

settings = Settings()
