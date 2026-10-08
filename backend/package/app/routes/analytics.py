
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, func, case, cast, Float
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db, get_current_user, require_role
from app.models import Hospital, User, UserRole, WorkOrder, Equipment, Technician
from app.schemas.hospital import HospitalRead
from app.schemas.equipment import EquipmentRead
from app.schemas.order import OrderRead
from app.schemas.technician import TechnicianRead
from app.schemas.analytics import MetricsBase

#our FastAPI router for the /robots endpoints. The prefix argument means that
#  all routes defined in this router will be prefixed with /robots, and the 
# tags argument is used for documentation purposes in the OpenAPI schema.
router = APIRouter(prefix="/analytics", tags=["analytics"])


#our GET /robots endpoint, which returns a list of robots, optionally filtered by battery level.
@router.get("/colocation", response_model=list[OrderRead])
async def find_colocation_discrepancies_orm(db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)) -> list[WorkOrder]:

    statement = (
        select(WorkOrder) 
        .join(Equipment, Equipment.id == WorkOrder.equipment_id)
        .join(Technician, Technician.id == WorkOrder.technician_id)
        .where(Equipment.hospital_id != Technician.hospital_id)
        .order_by(WorkOrder.id)
    )

    result = await db.execute(statement)
    return list(result.scalars().all())

@router.get("/lowcost", response_model=list[EquipmentRead])
async def find_low_cash_equipments(db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user), threshold: int = 20) -> list[Equipment]:

    statement = (
            select(Equipment)
            .where(Equipment.charge_level <= threshold)
            .order_by(Equipment.id)
        )
    
    result = await db.execute(statement)
    return list(result.scalars().all())

@router.get("/metrics", response_model=list[MetricsBase])
async def reliability_metrics(db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):

    statement = (
                select(Equipment.model.label("model"),
                       func.count(WorkOrder.id).filter(WorkOrder.status == 'Completed').label("Completed"),
                       func.count(WorkOrder.id).filter(WorkOrder.status == 'Failed').label("Failed")
                       )
                .join(Equipment, Equipment.id == WorkOrder.equipment_id)
                .group_by(Equipment.model)
            )
        
    result = await db.execute(statement)
    rows = result.all()
    return list(MetricsBase(model=row.model, completed=row.Completed, failed=row.Failed)
                for row in rows)

@router.get("/flags", response_model=list[HospitalRead])
async def maintenance_flags(db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)) -> list[Hospital]:

    statement = (
        select(Hospital)
        .join(Equipment, Equipment.hospital_id == Hospital.id)
        .group_by(Hospital.id)
        .having(
            (
                func.count(Equipment.id).filter(
                    Equipment.status == "Maintenance"
                )
                / cast(func.count(Equipment.id), Float)
            ) > 0.30
        )
    )

    result = await db.execute(statement)
    return list(result.scalars().all())

@router.get("/report/{supervisor_id}", response_model=list[TechnicianRead])
async def reporting_lines(supervisor_id: int, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)) -> list[Technician]:
    statement = (
                select(Technician)
                .join(WorkOrder, WorkOrder.technician_id == Technician.id)
                .join(Hospital, Hospital.id == Technician.hospital_id)
                .where( 
                        WorkOrder.status.not_in(["Completed", "Failed"]), 
                        Hospital.supervisor_id == supervisor_id,
                    )
                .distinct() 
    )
        
    result = await db.execute(statement)
    return list(result.scalars().all())
    