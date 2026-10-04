from pydantic import BaseModel, ConfigDict, Field

class ReportBase(BaseModel):
    filr_url: str
    note: str 
    order_id: int
    


class ReportCreate(ReportBase):
    "Same Fields"

class ReportRead(ReportBase):
    id:int

    model_config = ConfigDict(from_attributes=True)

class ReportUpdate(ReportBase):
    "Same Fields"
