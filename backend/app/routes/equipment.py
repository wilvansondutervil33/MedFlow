from decimal import Decimal
from fastapi.responses import Response
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db, get_current_user, require_role
from app.models import Equipment, User, UserRole
from app.schemas.equipment import EquipmentCreate, EquipmentRead, EquipmentUpdate

router = APIRouter(prefix="/equipments", tags=["equipments"])

@router.get("", response_model=list[EquipmentRead], status_code= status.HTTP_200_OK)
async def get_list_equipments(max_charge: Decimal | None = Query(
        default=None,
        ge=0,
        le=100,
        description="Only return equipments strictly below this charge level.",),
        db:AsyncSession =  Depends(get_db), _:User = Depends(get_current_user)) -> list[Equipment]:
    statement = select(Equipment)
    if max_charge is not None:
        statement = statement.where(Equipment.charge_level < max_charge)
    statement = statement.order_by(Equipment.id)

    res = await db.execute(statement)
    return list(res.scalars().all())

@router.get("/{eid}", response_model=EquipmentRead, status_code= status.HTTP_200_OK)
async def get_equipment(eid:int, db:AsyncSession =  Depends(get_db), _:User = Depends(get_current_user)) -> Equipment:
    eqi = await db.get(Equipment, eid) 

    if eqi == None:
        raise HTTPException(
                    status_code= status.HTTP_404_NOT_FOUND,
                    detail= f"Equipment {eid} is not found"
                )
    return eqi

@router.post("", response_model=EquipmentCreate, status_code= status.HTTP_201_CREATED)
async def create_equipment(payload: EquipmentCreate ,db: AsyncSession = Depends(get_db), _:User = Depends(require_role(UserRole.CLINICAL_ADMIN))) -> Equipment:
    
    eqi = Equipment(**payload.model_dump())
    db.add(eqi)
    await db.commit()
    await db.refresh(eqi)

    return eqi

@router.put("/{eid}", response_model=EquipmentUpdate, status_code= status.HTTP_202_ACCEPTED)
async def update_equipment(eid:int, payload: EquipmentUpdate ,db: AsyncSession = Depends(get_db), _:User = Depends(require_role(UserRole.CLINICAL_ADMIN))) -> Equipment:
    
    eqi = await db.get(Equipment, eid)

    eqi.serial_number = payload.serial_number
    eqi.model = payload.model
    eqi.charge_level = payload.charge_level
    eqi.status = payload.status
    eqi.hospital_id = payload.hospital_id

    db.add(eqi)
    await db.commit()
    await db.refresh(eqi)
    return eqi

@router.delete("/{eid}", status_code= status.HTTP_204_NO_CONTENT)
async def delete_equipment(eid:int, db:AsyncSession = Depends(get_db), _:User = Depends(require_role(UserRole.CLINICAL_ADMIN))):

    eqi = await db.get(Equipment, eid)
    await db.delete(eqi)
    await db.commit()

    return Response(status_code=204)
