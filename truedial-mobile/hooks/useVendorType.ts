import { useMemo } from 'react';
import { useAuth } from '../context/auth';
import { 
  Utensils, Stethoscope, Scissors, Dumbbell, GraduationCap, 
  Store, Hotel, Scale, Camera, Car, Plane, Laptop, HardHat,
  Users, CalendarCheck, ClipboardList, Briefcase, FileText
} from 'lucide-react-native';

export type Archetype = 
  | 'food'          // restaurants, cafes, bakeries
  | 'healthcare'    // doctors, hospitals, clinics
  | 'beauty'        // salons, spas, makeup artists
  | 'fitness'       // gyms, yoga, sports academies
  | 'education'     // schools, coaching, training
  | 'retail'        // shops, stores, dealers
  | 'hospitality'   // hotels, PG, homestays
  | 'professional'  // CAs, lawyers, consultants
  | 'events'        // photographers, planners, DJs
  | 'automotive'    // garages, dealers, car wash
  | 'travel'        // travel agents, tour operators
  | 'it_digital'    // web designers, digital agencies
  | 'designer'      // interior designers, architects
  | 'worker'        // skilled trades
  | 'supplier'      // material suppliers
  | 'brand'         // brands, manufacturers
  | 'builder';      // real estate, builders

export interface VendorConfig {
  archetype: Archetype;
  catalogLabel: string;
  catalogIcon: any;
  crmLabel: string;
  crmIcon: any;
  uniqueTabs: { label: string; href: string; icon: any }[];
  b2bFilters: string[]; 
  marketingTemplates: string[];
}

export function useVendorType(): VendorConfig {
  const { user } = useAuth();
  
  // Use professional_type or business_category as a fallback
  const professionalType = (user?.professional_type || user?.business_category || '').toLowerCase();
  
  const roleSlugs = (user?.roles || []).map(r => (typeof r === 'string' ? r.toLowerCase() : r.slug?.toLowerCase() || ''));
  const hasRole = (role: string) => roleSlugs.includes(role);

  return useMemo(() => {
    // 1. Food & Beverage
    if (['restaurant', 'cafe', 'dhaba', 'fast_food', 'bakery', 'sweet_shop', 'catering', 'tiffin_service', 'cloud_kitchen', 'bar', 'juice_bar'].includes(professionalType) || hasRole('food_vendor')) {
      return {
        archetype: 'food',
        catalogLabel: 'Menu Management',
        catalogIcon: Utensils,
        crmLabel: 'Reservations & Orders',
        crmIcon: CalendarCheck,
        uniqueTabs: [
          { label: 'Kitchen Display', href: '/dashboard/vendor/kitchen', icon: ClipboardList }
        ],
        b2bFilters: ['food_packaging', 'catering_equipment'],
        marketingTemplates: ['today_special', 'happy_hours', 'festive_menu']
      };
    }
    
    // 2. Healthcare
    if (['doctor', 'hospital', 'clinic', 'dentist', 'eye_specialist', 'diagnostic_lab', 'pharmacy', 'physiotherapist', 'ayurvedic_doctor', 'veterinary_doctor', 'optician'].includes(professionalType) || hasRole('healthcare')) {
      return {
        archetype: 'healthcare',
        catalogLabel: 'Services & Treatments',
        catalogIcon: Stethoscope,
        crmLabel: 'Appointments',
        crmIcon: CalendarCheck,
        uniqueTabs: [
          { label: 'Patient Records', href: '/dashboard/vendor/patients', icon: Users }
        ],
        b2bFilters: ['medical_equipment', 'pharmaceuticals'],
        marketingTemplates: ['free_health_camp', 'vaccination_drive', 'specialist_available']
      };
    }

    // 3. Beauty
    if (['salon', 'spa', 'nail_studio', 'tattoo_studio', 'makeup_artist', 'bridal_studio', 'beauty_parlour'].includes(professionalType) || hasRole('beauty')) {
      return {
        archetype: 'beauty',
        catalogLabel: 'Service Menu',
        catalogIcon: Scissors,
        crmLabel: 'Appointments & Walk-ins',
        crmIcon: CalendarCheck,
        uniqueTabs: [
          { label: 'Staff & Stylists', href: '/dashboard/vendor/staff', icon: Users }
        ],
        b2bFilters: ['beauty_products', 'salon_equipment'],
        marketingTemplates: ['pre_bridal', 'weekend_special', 'festive_offer']
      };
    }

    // 4. Fitness
    if (['gym', 'yoga_studio', 'martial_arts', 'swimming_pool', 'sports_academy', 'fitness_center', 'zumba_studio', 'personal_trainer'].includes(professionalType) || hasRole('fitness')) {
      return {
        archetype: 'fitness',
        catalogLabel: 'Membership Plans',
        catalogIcon: Dumbbell,
        crmLabel: 'Members',
        crmIcon: Users,
        uniqueTabs: [
          { label: 'Class Schedule', href: '/dashboard/vendor/classes', icon: CalendarCheck }
        ],
        b2bFilters: ['gym_equipment', 'supplements'],
        marketingTemplates: ['new_year_offer', 'refer_a_friend', 'challenge_launch']
      };
    }

    // 5. Education
    if (['school', 'college', 'coaching_center', 'music_academy', 'dance_academy', 'language_class', 'computer_training'].includes(professionalType) || hasRole('education')) {
      return {
        archetype: 'education',
        catalogLabel: 'Courses & Batches',
        catalogIcon: GraduationCap,
        crmLabel: 'Admissions',
        crmIcon: Users,
        uniqueTabs: [
          { label: 'Batch Schedule', href: '/dashboard/vendor/batches', icon: CalendarCheck }
        ],
        b2bFilters: ['stationery', 'educational_materials'],
        marketingTemplates: ['admission_open', 'free_demo', 'result_announcement']
      };
    }

    // 6. Retail
    if (['electronics_shop', 'clothing_store', 'jewellery_shop', 'grocery_store', 'hardware_store', 'pharmacy_retail', 'mobile_shop', 'supermarket'].includes(professionalType) || hasRole('retail')) {
      return {
        archetype: 'retail',
        catalogLabel: 'Product Inventory',
        catalogIcon: Store,
        crmLabel: 'Customer Inquiries',
        crmIcon: Users,
        uniqueTabs: [
          { label: 'Stock Alerts', href: '/dashboard/vendor/stock', icon: ClipboardList }
        ],
        b2bFilters: ['wholesale', 'distributors'],
        marketingTemplates: ['festival_sale', 'new_arrivals', 'clearance_sale']
      };
    }

    // 7. Hospitality
    if (['hotel', 'resort', 'guest_house', 'pg_hostel', 'homestay', 'service_apartment'].includes(professionalType) || hasRole('hospitality')) {
      return {
        archetype: 'hospitality',
        catalogLabel: 'Room Types',
        catalogIcon: Hotel,
        crmLabel: 'Bookings',
        crmIcon: CalendarCheck,
        uniqueTabs: [
          { label: 'Housekeeping', href: '/dashboard/vendor/housekeeping', icon: ClipboardList }
        ],
        b2bFilters: ['hotel_supplies', 'linen', 'food_suppliers'],
        marketingTemplates: ['weekend_getaway', 'early_bird', 'honeymoon_package']
      };
    }

    // 8. Professional
    if (['chartered_accountant', 'lawyer', 'insurance_agent', 'financial_advisor', 'tax_consultant', 'company_secretary'].includes(professionalType) || hasRole('professional_service')) {
      return {
        archetype: 'professional',
        catalogLabel: 'Services & Fees',
        catalogIcon: Scale,
        crmLabel: 'Client Cases',
        crmIcon: Briefcase,
        uniqueTabs: [
          { label: 'Deadlines Calendar', href: '/dashboard/vendor/deadlines', icon: CalendarCheck }
        ],
        b2bFilters: ['document_services', 'legal_subscriptions'],
        marketingTemplates: ['tax_season', 'free_consultation', 'compliance_update']
      };
    }

    // 9. Events
    if (['wedding_planner', 'photographer', 'videographer', 'dj', 'decorator', 'banquet_hall', 'event_manager', 'caterer_event'].includes(professionalType) || hasRole('events')) {
      return {
        archetype: 'events',
        catalogLabel: 'Portfolio & Packages',
        catalogIcon: Camera,
        crmLabel: 'Event Bookings',
        crmIcon: CalendarCheck,
        uniqueTabs: [
          { label: 'Event Calendar', href: '/dashboard/vendor/event-calendar', icon: CalendarCheck }
        ],
        b2bFilters: ['event_supplies', 'floral', 'sound_rental'],
        marketingTemplates: ['wedding_offer', 'early_booking', 'new_portfolio']
      };
    }

    // 10. Automotive
    if (['car_garage', 'car_wash', 'tyre_shop', 'driving_school', 'auto_spare_parts', 'bike_mechanic'].includes(professionalType) || hasRole('automotive')) {
      return {
        archetype: 'automotive',
        catalogLabel: 'Services & Charges',
        catalogIcon: Car,
        crmLabel: 'Job Cards',
        crmIcon: ClipboardList,
        uniqueTabs: [
          { label: 'Vehicles in Garage', href: '/dashboard/vendor/garage', icon: Car }
        ],
        b2bFilters: ['auto_parts', 'lubricants', 'tools'],
        marketingTemplates: ['free_checkup', 'monsoon_care', 'festival_service']
      };
    }

    // 11. Travel
    if (['travel_agency', 'tour_operator', 'car_rental', 'taxi_service', 'visa_consultant'].includes(professionalType) || hasRole('travel')) {
      return {
        archetype: 'travel',
        catalogLabel: 'Tour Packages',
        catalogIcon: Plane,
        crmLabel: 'Bookings & Inquiries',
        crmIcon: Users,
        uniqueTabs: [
          { label: 'Active Tours', href: '/dashboard/vendor/tours', icon: Plane }
        ],
        b2bFilters: ['hotel_partners', 'transport_vendors'],
        marketingTemplates: ['summer_holiday', 'weekend_package', 'last_minute']
      };
    }

    // 12. IT & Digital
    if (['web_designer', 'app_developer', 'digital_marketing_agency', 'computer_repair', 'graphic_designer'].includes(professionalType) || hasRole('it_digital')) {
      return {
        archetype: 'it_digital',
        catalogLabel: 'Service Packages',
        catalogIcon: Laptop,
        crmLabel: 'Project Pipeline',
        crmIcon: Briefcase,
        uniqueTabs: [
          { label: 'Active Projects', href: '/dashboard/vendor/projects', icon: Laptop }
        ],
        b2bFilters: ['hosting', 'software_licenses'],
        marketingTemplates: ['new_year_bundle', 'free_audit', 'social_offer']
      };
    }

    // 13a. Worker
    if (['carpenter', 'electrician', 'plumber', 'painter', 'pop_false_ceiling_worker', 'tile_marble_fitter', 'granite_installer'].includes(professionalType) || hasRole('worker')) {
      return {
        archetype: 'worker',
        catalogLabel: 'My Skills & Services',
        catalogIcon: HardHat,
        crmLabel: 'Service Requests',
        crmIcon: ClipboardList,
        uniqueTabs: [
          { label: 'Job Board', href: '/dashboard/vendor/jobs', icon: Briefcase }
        ],
        b2bFilters: ['subcontractor_jobs'],
        marketingTemplates: ['available_urgent', 'whatsapp_update']
      };
    }

    // 13b. Supplier
    if (['plywood_dealer', 'laminate_dealer', 'tile_dealer', 'paint_dealer', 'hardware_supplier', 'lighting_supplier'].includes(professionalType) || hasRole('supplier')) {
      return {
        archetype: 'supplier',
        catalogLabel: 'Product Catalog',
        catalogIcon: Store,
        crmLabel: 'Buyer Inquiries & Bulk',
        crmIcon: Users,
        uniqueTabs: [
          { label: 'RFQ Board', href: '/dashboard/vendor/rfq', icon: ClipboardList }
        ],
        b2bFilters: ['material_rfq'],
        marketingTemplates: ['new_stock', 'bulk_discount']
      };
    }

    // 13c. Builder
    if (['builder', 'real_estate_developer'].includes(professionalType) || hasRole('builder')) {
      return {
        archetype: 'builder',
        catalogLabel: 'Property Projects',
        catalogIcon: Briefcase,
        crmLabel: 'High-Value Leads',
        crmIcon: Users,
        uniqueTabs: [
          { label: 'Site Visits', href: '/dashboard/vendor/site-visits', icon: CalendarCheck }
        ],
        b2bFilters: ['contractors', 'material_suppliers'],
        marketingTemplates: ['new_launch', 'booking_open', 'emi_offer']
      };
    }

    // Default (13d. Designer / General)
    return {
      archetype: 'designer',
      catalogLabel: 'Products & Services',
      catalogIcon: FileText,
      crmLabel: 'Client Leads & Pipeline',
      crmIcon: Users,
      uniqueTabs: [
        { label: 'Site Visits', href: '/dashboard/vendor/site-visits', icon: CalendarCheck }
      ],
      b2bFilters: ['contractor', 'supplier'],
      marketingTemplates: ['portfolio_showcase', 'project_completed', 'festive_promo']
    };
  }, [professionalType, roleSlugs]);
}
