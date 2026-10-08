from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://postgres:password@medflow.cv8s0o2ayt2o.us-east-2.rds.amazonaws.com:5432/medflow?ssl=require"
    secret_key:str
    frontend_origin:str = "dg55qn0jkixms.cloudfront.net"

    model_config = SettingsConfigDict(env_file= ".env")

settings = Settings()