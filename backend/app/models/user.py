from __future__ import annotations
from sqlalchemy import Integer, Boolean, String, Enum as SqlEnum
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base
from .enums import UserRole

class User(Base):
    __tablename__ = "users"

    id:Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(String(25))
    hashed_password: Mapped[str] = mapped_column(String(255))
    role:Mapped[UserRole] = mapped_column(
        SqlEnum(
            UserRole,
            name = "user_role",
            values_callable = lambda enum_cls : [m.value for m in enum_cls],
        )
    ) 
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)