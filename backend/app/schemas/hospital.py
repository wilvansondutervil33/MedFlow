from pydantic import BaseModel, ConfigDict, Field

class HospitalBase(BaseModel):
    name: str = Field(min_length= 3, max_length= 50)
    location_region: str = Field(min_length=1, max_length= 50)
    capacity: int = Field(ge= 0, le = 1000)
    supervisor_id:int

class HospitalCreate(HospitalBase):
    "Same Fields"

class HospitalRead(HospitalBase):
    id:int

    model_config = ConfigDict(from_attributes=True)

class HospitalUpdate(HospitalBase):
    "Same Fields"
