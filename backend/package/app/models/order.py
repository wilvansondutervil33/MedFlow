from __future__ import annotations
from typing import TYPE_CHECKING
from decimal import Decimal
from sqlalchemy import Integer, String, Numeric, CheckConstraint, ForeignKey, Enum as SqlEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base
from .enums import OrderPriority, OrderStatus

if TYPE_CHECKING:
    from .equipment import Equipment
    from .report import ServiceReport
    from .technician import Technician
    

class WorkOrder(Base):
    __tablename__= "workorders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(50))
    priorty: Mapped[OrderPriority] = mapped_column(
        SqlEnum(
            OrderPriority,
            name= "order_priority",
            values_callable= lambda enum_cls: [m.value for m in enum_cls ],
        )
    )
    status: Mapped[OrderStatus] = mapped_column(
        SqlEnum(
            OrderStatus,
            name= "order_status",
            values_callable= lambda enum_cls: [m.value for m in enum_cls]
        )
    )
    equipment_id: Mapped[int] = mapped_column(Integer, ForeignKey("equipments.id"))
    technician_id: Mapped[int] = mapped_column(Integer, ForeignKey("technicians.id"))

    equipment: Mapped["Equipment"] = relationship(back_populates="workorders")
    servicereports: Mapped[list["ServiceReport"]] = relationship(back_populates="workorder")
    technician: Mapped["Technician"] = relationship(back_populates="workorders")
