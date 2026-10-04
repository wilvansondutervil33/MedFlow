from __future__ import annotations
from typing import TYPE_CHECKING
from decimal import Decimal
from sqlalchemy import Integer, String, Numeric, CheckConstraint, ForeignKey, Enum as SqlEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base
from .enums import EquipmentStatus

if TYPE_CHECKING:
    from .hospital import Hospital
    from .order import WorkOrder


class Equipment(Base):
    __tablename__ = "equipments"

    __table_args__ = (
        CheckConstraint("charge_level BETWEEN 0 AND 100",
                        name= "charge_level_range"),
    )
    id: Mapped[int] = mapped_column(Integer, primary_key= True)
    serial_number: Mapped[str] = mapped_column(String)
    model: Mapped[str] = mapped_column(String(50))
    status: Mapped[EquipmentStatus] = mapped_column(
        SqlEnum(
            EquipmentStatus, 
            name= "equipment_status",
            values_callable = lambda enum_cls: [member.value for member in enum_cls],
        )
    )
    charge_level: Mapped[Decimal] = mapped_column(Numeric(5, 2))
    hospital_id: Mapped[int] = mapped_column(Integer, ForeignKey("hospitals.id"))

    hospital: Mapped["Hospital"] = relationship(back_populates="equipments")
    workorders: Mapped[list["WorkOrder"]] = relationship(back_populates="equipment")

