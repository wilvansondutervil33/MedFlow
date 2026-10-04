from decimal import Decimal
from fastapi.responses import Response
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db, get_current_user, require_role
from app.models import WorkOrder, User, UserRole
from app.schemas.order import OrderCreate, OrderRead, OrderUpdate

router = APIRouter(prefix="/orders", tags=["orders"])

@router.get("", response_model=list[OrderRead], status_code= status.HTTP_200_OK)
async def get_list_orders(db:AsyncSession =  Depends(get_db), _:User = Depends(get_current_user)) -> list[WorkOrder]:
    statment = select(WorkOrder)
    res = await db.execute(statment)
    return list(res.scalars().all())

@router.get("/{oid}", response_model=OrderRead, status_code= status.HTTP_200_OK)
async def get_order(oid:int, db:AsyncSession =  Depends(get_db), _:User = Depends(get_current_user)) -> WorkOrder:
    ord = await db.get(WorkOrder, oid) 

    if ord == None:
        raise HTTPException(
                    status_code= status.HTTP_404_NOT_FOUND,
                    detail= f"Work Order {oid} is not found"
                )
    return ord

@router.post("", response_model=OrderCreate, status_code= status.HTTP_201_CREATED)
async def create_order(payload: OrderCreate ,db: AsyncSession = Depends(get_db), _:User = Depends(require_role(UserRole.CLINICAL_ADMIN))) -> WorkOrder:
    
    ord = WorkOrder(**payload.model_dump())
    db.add(ord)
    await db.commit()
    await db.refresh(ord)

    return ord

@router.put("/{oid}", response_model=OrderUpdate, status_code= status.HTTP_202_ACCEPTED)
async def update_order(oid:int, 
                       payload: OrderUpdate ,
                       db: AsyncSession = Depends(get_db), 
                       _:User = Depends(require_role(UserRole.CLINICAL_ADMIN))) -> WorkOrder:
    
    ord = await db.get(WorkOrder, oid)

    ord.title = payload.title
    ord.priorty = payload.priorty
    ord.technician_id = payload.technician_id
    ord.status = payload.status
    ord.equipment_id = payload.equipment_id

    db.add(ord)
    await db.commit()
    await db.refresh(ord)
    return ord

@router.delete("/{oid}", status_code= status.HTTP_204_NO_CONTENT)
async def delete_order(oid:int, db:AsyncSession = Depends(get_db), _:User = Depends(require_role(UserRole.CLINICAL_ADMIN))):

    ord = await db.get(WorkOrder, oid)
    await db.delete(ord)
    await db.commit()

    return Response(status_code=204)
