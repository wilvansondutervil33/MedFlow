INSERT INTO hospitals (id, name, location_region, capacity, supervisor_id) VALUES
    (1, 'Saint Mountion', 'US-East', 100, 1),
    (2, 'Jackson', 'US-East', 80, 2),
    (3, 'UM Hospital', 'US-West', 55, 3),
    (4, 'Med Hope', 'US-South', 36, 4);

INSERT INTO equipments (id, serial_number, model, status, charge_level, hospital_id) VALUES
    (1, 'EQ-1001', 'Ventilator X200', 'Available', 87.50, 1),
    (2, 'EQ-1002', 'Defibrillator Z10', 'In-Use', 45.00, 1),
    (3, 'EQ-1003', 'Infusion Pump V3', 'Maintenance', 0.00,2),
    (4, 'EQ-1004', 'Patient Monitor M5', 'Available', 100.00, 2),
    (5, 'EQ-1005', 'Portable X-Ray PX7', 'Offline', 12.30, 3),
    (6, 'EQ-1006', 'Ultrasound Scanner U8', 'Available', 17.50, 3),
    (7, 'EQ-1007', 'Anesthesia Machine A400', 'In-Use', 45.30, 4),
    (8, 'EQ-1008', 'Infusion Pump V3', 'Maintenance', 08.00,4),
    (9, 'EQ-1009', 'Patient Monitor M5', 'Available', 90.00, 2),
    (10, 'EQ-1010', 'Portable X-Ray PX7', 'Offline', 82.30, 3),
    (11, 'EQ-1011', 'Patient Monitor M5', 'Available', 50.60, 1),
    (12, 'EQ-1012', 'Portable X-Ray PX7', 'Offline', 68.30, 4);

INSERT INTO technicians (id, name, hospital_id) VALUES
    (1, 'Alice Morgan', 1),
    (2, 'David Chen', 2),
    (3, 'Priya Patel', 3),
    (4, 'Marcus Reed', 4),
    (5, 'Michael White', 1),
    (6, 'Will Dawn', 2),
    (7, 'Layya Jules', 3),
    (8, 'John Reed', 4);

        
INSERT INTO workorders (id, title, priorty, status, equipment_id, technician_id) VALUES
    (1, 'Ventilator battery replacement', 'Critical', 'Pending', 1, 1),
    (2, 'Defibrillator calibration', 'Medium', 'In-Progress', 2, 2),
    (3, 'Infusion pump software update', 'Low', 'Completed', 3, 3),
    (4, 'Patient monitor screen repair', 'Medium', 'Pending', 4, 1),
    (5, 'X-Ray unit inspection', 'Critical', 'In-Progress', 5, 4),
    (6, 'Ultrasound probe replacement', 'Critical', 'Failed', 6, 5),
    (7, 'Anesthesia machine leak test', 'Medium', 'Completed', 7, 6),
    (8, 'Ventilator firmware upgrade', 'Low', 'Pending', 1, 4),
    (9, 'Defibrillator pad replacement', 'Medium', 'In-Progress', 2, 7),
    (10, 'Patient monitor sensor cleaning', 'Low', 'Failed', 4, 8);
        

INSERT INTO servicereports (id, filr_url, note, order_id) VALUES
    (1, 'https://storage.example.com/reports/report-1001.pdf', 'Battery replaced and tested, unit fully operational.', 1),
    (2, 'https://storage.example.com/reports/report-1002.pdf', 'Calibration completed, readings within normal range.', 2),
    (3, 'https://storage.example.com/reports/report-1003.pdf', 'Software updated to latest firmware version.', 3),
    (4, 'https://storage.example.com/reports/report-1004.pdf', 'Screen replaced, touch calibration verified.', 4),
    (5, 'https://storage.example.com/reports/report-1005.pdf', 'Inspection passed, no defects found.', 5),
    (6, 'https://storage.example.com/reports/report-1006.pdf', 'Probe replaced, image quality confirmed.', 6);      

SELECT setval('hospitals_id_seq', (SELECT MAX(id) FROM hospitals));
SELECT setval('equipments_id_seq', (SELECT MAX(id) FROM equipments));
SELECT setval('technicians_id_seq', (SELECT MAX(id) FROM technicians));
SELECT setval('workorders_id_seq', (SELECT MAX(id) FROM workorders));
SELECT setval('servicereports_id_seq', (SELECT MAX(id) FROM servicereports));