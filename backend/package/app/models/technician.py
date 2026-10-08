from __future__ import annotations
from typing import TYPE_CHECKING
from decimal import Decimal
from sqlalchemy import Integer, String, Numeric, CheckConstraint, ForeignKey, Enum as SqlEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base

if TYPE_CHECKING:
    from .hospital import Hospital
    from .order import WorkOrder

class Technician(Base):
    __tablename__ = "technicians"

    id:Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(25))
    hospital_id: Mapped[int] = mapped_column(Integer, ForeignKey("hospitals.id"))

    hospital: Mapped["Hospital"] = relationship(back_populates="technicians")
    workorders: Mapped["WorkOrder"] = relationship(back_populates="technician")