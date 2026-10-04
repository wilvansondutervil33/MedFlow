from __future__ import annotations
from typing import TYPE_CHECKING
from decimal import Decimal
from sqlalchemy import Integer, ForeignKey, String, Text, DateTime, func, Enum as SqlEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

from .base import Base

if TYPE_CHECKING:
    from .order import WorkOrder

class ServiceReport(Base):
    __tablename__ = "servicereports"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    filr_url: Mapped[str] = mapped_column(Text)
    note: Mapped[str] = mapped_column(String(100))
    order_id:Mapped[int] = mapped_column(Integer, ForeignKey("workorders.id"))
    timestamp: Mapped[datetime] = mapped_column(DateTime, server_default= func.now())

    workorder: Mapped["WorkOrder"] = relationship(back_populates="servicereports")