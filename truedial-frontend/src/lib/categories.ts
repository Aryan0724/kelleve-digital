import { Utensils, Stethoscope, Scissors, Dumbbell, GraduationCap, Store, Hotel, Scale, Camera, Car, Plane, Laptop, HardHat } from "lucide-react";

export const CATEGORIES = [
  { id: 'food', name: 'Food & Beverage', icon: Utensils, subTypes: [
    { value: 'restaurant', label: 'Restaurant' }, { value: 'cafe', label: 'Cafe' }, { value: 'dhaba', label: 'Dhaba' }, { value: 'fast_food', label: 'Fast Food' }, { value: 'bakery', label: 'Bakery' }, { value: 'sweet_shop', label: 'Sweet Shop' }, { value: 'catering', label: 'Catering Service' }, { value: 'cloud_kitchen', label: 'Cloud Kitchen' }
  ]},
  { id: 'healthcare', name: 'Healthcare & Clinics', icon: Stethoscope, subTypes: [
    { value: 'doctor', label: 'Doctor / Physician' }, { value: 'hospital', label: 'Hospital' }, { value: 'clinic', label: 'Clinic' }, { value: 'dentist', label: 'Dentist' }, { value: 'diagnostic_lab', label: 'Diagnostic Lab' }, { value: 'pharmacy', label: 'Pharmacy' }, { value: 'physiotherapist', label: 'Physiotherapist' }
  ]},
  { id: 'beauty', name: 'Beauty & Salons', icon: Scissors, subTypes: [
    { value: 'salon', label: 'Unisex Salon' }, { value: 'hair_salon', label: 'Hair Salon' }, { value: 'spa', label: 'Spa & Massage' }, { value: 'makeup_artist', label: 'Makeup Artist' }, { value: 'nail_studio', label: 'Nail Studio' }, { value: 'tattoo_studio', label: 'Tattoo Studio' }, { value: 'bridal_studio', label: 'Bridal Studio' }
  ]},
  { id: 'fitness', name: 'Fitness & Sports', icon: Dumbbell, subTypes: [
    { value: 'gym', label: 'Gym / Fitness Center' }, { value: 'yoga_studio', label: 'Yoga Studio' }, { value: 'dance_academy', label: 'Dance Studio' }, { value: 'sports_academy', label: 'Sports Academy' }, { value: 'swimming_pool', label: 'Swimming Pool' }, { value: 'personal_trainer', label: 'Personal Trainer' }
  ]},
  { id: 'education', name: 'Edu & Training', icon: GraduationCap, subTypes: [
    { value: 'school', label: 'School' }, { value: 'college', label: 'College' }, { value: 'coaching_center', label: 'Coaching Center' }, { value: 'music_academy', label: 'Music Academy' }, { value: 'language_class', label: 'Language Class' }, { value: 'computer_training', label: 'Computer Training' }
  ]},
  { id: 'retail', name: 'Retail & Shops', icon: Store, subTypes: [
    { value: 'electronics_shop', label: 'Electronics & Mobile' }, { value: 'clothing_store', label: 'Clothing & Apparel' }, { value: 'jewellery_shop', label: 'Jewellery Shop' }, { value: 'grocery_store', label: 'Grocery / Supermarket' }, { value: 'hardware_store', label: 'Hardware Store' }, { value: 'pharmacy_retail', label: 'Pharmacy / Medical' }
  ]},
  { id: 'hospitality', name: 'Hotels & Stays', icon: Hotel, subTypes: [
    { value: 'hotel', label: 'Hotel' }, { value: 'resort', label: 'Resort' }, { value: 'guest_house', label: 'Guest House' }, { value: 'pg_hostel', label: 'PG / Hostel' }, { value: 'homestay', label: 'Homestay' }, { value: 'service_apartment', label: 'Service Apartment' }
  ]},
  { id: 'professional', name: 'Legal & Finance', icon: Scale, subTypes: [
    { value: 'chartered_accountant', label: 'Chartered Accountant' }, { value: 'lawyer', label: 'Lawyer / Advocate' }, { value: 'insurance_agent', label: 'Insurance Agent' }, { value: 'financial_advisor', label: 'Financial Advisor' }, { value: 'tax_consultant', label: 'Tax Consultant' }, { value: 'company_secretary', label: 'Company Secretary' }
  ]},
  { id: 'events', name: 'Events & Media', icon: Camera, subTypes: [
    { value: 'wedding_planner', label: 'Wedding Planner' }, { value: 'photographer', label: 'Photographer' }, { value: 'videographer', label: 'Videographer' }, { value: 'dj', label: 'DJ / Sound' }, { value: 'decorator', label: 'Decorator' }, { value: 'banquet_hall', label: 'Banquet Hall' }, { value: 'event_manager', label: 'Event Manager' }
  ]},
  { id: 'automotive', name: 'Auto Services', icon: Car, subTypes: [
    { value: 'car_garage', label: 'Car Garage / Service' }, { value: 'car_wash', label: 'Car Wash & Detailing' }, { value: 'tyre_shop', label: 'Tyre Shop' }, { value: 'driving_school', label: 'Driving School' }, { value: 'auto_spare_parts', label: 'Auto Spare Parts' }, { value: 'bike_mechanic', label: 'Bike Mechanic' }
  ]},
  { id: 'travel', name: 'Travel & Tourism', icon: Plane, subTypes: [
    { value: 'travel_agency', label: 'Travel Agency' }, { value: 'tour_operator', label: 'Tour Operator' }, { value: 'car_rental', label: 'Car & Bike Rental' }, { value: 'taxi_service', label: 'Taxi Service' }, { value: 'visa_consultant', label: 'Visa Consultant' }
  ]},
  { id: 'it_digital', name: 'IT & Digital', icon: Laptop, subTypes: [
    { value: 'web_designer', label: 'Web Designer' }, { value: 'app_developer', label: 'App Developer' }, { value: 'digital_marketing_agency', label: 'Digital Marketing' }, { value: 'computer_repair', label: 'Computer Repair' }, { value: 'graphic_designer', label: 'Graphic Designer' }
  ]},
  { id: 'interior', name: 'Interior & Construct', icon: HardHat, subTypes: [
    { value: 'interior_designer', label: 'Interior Designer' }, { value: 'architect', label: 'Architect' }, { value: 'contractor', label: 'Contractor' }, { value: 'builder', label: 'Builder' }, { value: 'worker', label: 'Skilled Worker' }, { value: 'supplier', label: 'Material Supplier' }
  ]}
];
