from tests.conftest import auth_header

#if there is no authorization header at all, the request should be rejected before the route
#body ever runs
async def test_list_equipments_requires_authentication(client):
    response = await client.get("/equipments")
    assert response.status_code == 401


async def test_list_equipments_any_authenticated_role(client, seeded_users):
    response = await client.get("/equipments", headers=auth_header(seeded_users["auditor"]))
    assert response.status_code == 200


async def test_create_equipments_forbidden_for_field_operator(client, seeded_users, seeded_hospital):
    payload = {
        "serial_number": "TX-1001",
        "model": "Test-Eqi",
        "charge_level": 50,
        "hospital_id": seeded_hospital.id,
        "status": "Offline",
    }
    response = await client.post("/equipments", json=payload, headers=auth_header(seeded_users["operator"]))
    assert response.status_code == 403

async def test_create_equipments_succeeds_for_fleet_admin(client, seeded_users, seeded_hospital):
    payload = {
            "serial_number": "TX-1001",
            "model": "Test-equipments",
            "charge_level": 50,
            "hospital_id": seeded_hospital.id,
            "status": "Offline",
    }
    response = await client.post("/equipments", json=payload, headers=auth_header(seeded_users["admin"]))
    assert response.status_code == 201
    assert response.json()["serial_number"] == "TX-1001"


"""
Verify charge level is within constraints
"""
async def test_low_charge_filter(client, seeded_users, seeded_hospital):
    admin_headers = auth_header(seeded_users["admin"])
    low = {"serial_number": "LOW-01", "model":"Test-equipments", "charge_level": 10, "hospital_id": seeded_hospital.id, "status": "Offline"}
    high = {"serial_number": "HIGH-01", "model": "Test-equipments", "charge_level": 90, "hospital_id": seeded_hospital.id, "status": "Offline"}

    await client.post("/equipments", json=low, headers=admin_headers)
    await client.post("/equipments", json=high, headers=admin_headers)

    response = await client.get("/equipments?max_charge=20", headers=admin_headers)
    serials = [equipments["serial_number"] for equipments in response.json()]

    assert "LOW-01" in serials
    assert "HIGH-01" not in serials