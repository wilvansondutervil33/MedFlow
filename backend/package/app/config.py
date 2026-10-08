from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://postgres:password@127.0.0.1:5432/medflow"
    secret_key:str
    frontend_origin:str = "dg55qn0jkixms.cloudfront.net"

    model_config = SettingsConfigDict(env_file= ".env")

settings = Settings()