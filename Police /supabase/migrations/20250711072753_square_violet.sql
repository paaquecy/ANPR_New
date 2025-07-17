/*
  # Seed Sample Data for Police Dashboard

  1. Sample Data
    - Insert sample officers
    - Insert sample vehicles
    - Insert sample violations
    - Insert sample scans

  2. Notes
    - This data is for development and testing purposes
    - All data should be realistic but fictional
*/

-- Insert sample officers
INSERT INTO officers (id, email, full_name, badge_number, rank, department) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'john.doe@police.gov', 'John Doe', 'B001', 'Officer', 'Traffic Division'),
  ('550e8400-e29b-41d4-a716-446655440002', 'jane.smith@police.gov', 'Jane Smith', 'B002', 'Sergeant', 'Traffic Division'),
  ('550e8400-e29b-41d4-a716-446655440003', 'mike.johnson@police.gov', 'Mike Johnson', 'B003', 'Officer', 'Patrol Division'),
  ('550e8400-e29b-41d4-a716-446655440004', 'sarah.brown@police.gov', 'Sarah Brown', 'B004', 'Lieutenant', 'Traffic Division'),
  ('550e8400-e29b-41d4-a716-446655440005', 'david.wilson@police.gov', 'David Wilson', 'B005', 'Officer', 'Patrol Division')
ON CONFLICT (email) DO NOTHING;

-- Insert sample vehicles
INSERT INTO vehicles (id, plate_number, vin, make, model, year, color, owner_name, owner_address, registration_status, registration_expiry, insurance_status, insurance_expiry) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'ABC123', '1HGBH41JXMN109186', 'Honda', 'Civic', 2020, 'Blue', 'John Smith', '123 Main St, City, State 12345', 'Active', '2024-12-31', 'Valid', '2024-06-30'),
  ('660e8400-e29b-41d4-a716-446655440002', 'XYZ789', '2T1BURHE0JC123456', 'Toyota', 'Camry', 2019, 'White', 'Jane Doe', '456 Oak Ave, City, State 12345', 'Active', '2024-11-15', 'Valid', '2024-08-15'),
  ('660e8400-e29b-41d4-a716-446655440003', 'DEF456', '3VW2K7AJ9KM123789', 'Volkswagen', 'Jetta', 2021, 'Black', 'Mike Brown', '789 Pine St, City, State 12345', 'Active', '2025-01-20', 'Valid', '2024-09-10'),
  ('660e8400-e29b-41d4-a716-446655440004', 'GHI012', '1FTFW1ET5DFC12345', 'Ford', 'F-150', 2018, 'Red', 'Sarah Wilson', '321 Elm St, City, State 12345', 'Expired', '2023-10-01', 'Expired', '2023-12-01'),
  ('660e8400-e29b-41d4-a716-446655440005', 'JKL345', '5NPE34AF4KH123456', 'Hyundai', 'Elantra', 2022, 'Silver', 'David Johnson', '654 Maple Ave, City, State 12345', 'Active', '2025-03-15', 'Valid', '2024-12-20'),
  ('660e8400-e29b-41d4-a716-446655440006', 'MNO678', '1G1ZD5ST8KF123789', 'Chevrolet', 'Malibu', 2017, 'Gray', 'Lisa Davis', '987 Cedar St, City, State 12345', 'Active', '2024-07-30', 'Valid', '2024-05-25'),
  ('660e8400-e29b-41d4-a716-446655440007', 'PQR901', '3N1AB7AP9KL123456', 'Nissan', 'Sentra', 2020, 'Blue', 'Robert Taylor', '147 Birch Ln, City, State 12345', 'Active', '2024-09-12', 'Valid', '2024-11-08')
ON CONFLICT (plate_number) DO NOTHING;

-- Insert sample violations
INSERT INTO violations (id, plate_number, vehicle_id, officer_id, violation_type, violation_details, location, status, fine_amount) VALUES
  ('770e8400-e29b-41d4-a716-446655440001', 'ABC123', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Parking Violation', 'Parked in no-parking zone for 2 hours', 'Main St & 5th Ave', 'Pending', 75.00),
  ('770e8400-e29b-41d4-a716-446655440002', 'XYZ789', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Speeding', 'Driving 45 mph in 30 mph zone', 'Highway 101', 'Completed', 150.00),
  ('770e8400-e29b-41d4-a716-446655440003', 'DEF456', '660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Running Red Light', 'Failed to stop at red light intersection', 'Oak St & 2nd Ave', 'Dismissed', 200.00),
  ('770e8400-e29b-41d4-a716-446655440004', 'GHI012', '660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'Illegal Parking', 'Parked in handicap space without permit', 'City Hall Parking', 'Pending', 250.00),
  ('770e8400-e29b-41d4-a716-446655440005', 'JKL345', '660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440004', 'Expired License', 'Driving with expired registration', 'Downtown District', 'Completed', 100.00),
  ('770e8400-e29b-41d4-a716-446655440006', 'MNO678', '660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440005', 'No Insurance', 'Driving without valid insurance', 'Shopping Center', 'Pending', 300.00),
  ('770e8400-e29b-41d4-a716-446655440007', 'PQR901', '660e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440002', 'Reckless Driving', 'Excessive speed in school zone', 'School Zone', 'Completed', 400.00)
ON CONFLICT (id) DO NOTHING;

-- Insert sample scans
INSERT INTO scans (id, officer_id, plate_number, scan_type, scan_result, location) VALUES
  ('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'ABC123', 'Camera', '{"confidence": 0.95, "processing_time": 1.2}', 'Main St & 5th Ave'),
  ('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'XYZ789', 'Manual', '{"manual_entry": true}', 'Highway 101'),
  ('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'DEF456', 'Camera', '{"confidence": 0.88, "processing_time": 1.5}', 'Oak St & 2nd Ave'),
  ('880e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', 'GHI012', 'Manual', '{"manual_entry": true}', 'City Hall Parking'),
  ('880e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'JKL345', 'Camera', '{"confidence": 0.92, "processing_time": 1.1}', 'Downtown District')
ON CONFLICT (id) DO NOTHING;