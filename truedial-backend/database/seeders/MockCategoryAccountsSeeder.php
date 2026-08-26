<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Role;
use App\Models\Category;
use App\Models\Listing;
use App\Models\ListingProduct;
use App\Models\ListingService;
use App\Models\Offer;
use App\Models\Review;
use App\Models\Inquiry;
use App\Models\Patient;
use App\Models\MarketingCampaign;
use App\Models\TruedialInvoice;
use App\Models\PrivilegeCard;

class MockCategoryAccountsSeeder extends Seeder
{
    public function run(): void
    {
        $businessRole = Role::firstOrCreate(['slug' => 'business'], ['name' => 'Business (Truedial)']);
        $customerRole = Role::firstOrCreate(['slug' => 'customer'], ['name' => 'Customer (Truedial)']);

        // Default test password for all mock accounts
        $password = Hash::make('password123');

        $categoriesConfig = [
            [
                'slug' => 'restaurants',
                'name' => 'Restaurants & Cafes',
                'email' => 'restaurant@truedial.in',
                'owner' => 'Vikram Malhotra',
                'business_name' => 'The Royal Heritage Dine & Cafe',
                'professional_type' => 'restaurant',
                'tagline' => 'Authentic Flavors, Fine Dining & Rooftop Ambience',
                'description' => 'Experience world-class North Indian, Continental and Pan-Asian delicacies with exquisite live music and panoramic rooftop views.',
                'city' => 'Patna',
                'address' => 'Boring Road, Near Alankar Jewellers, Patna, Bihar',
                'cover_image' => 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop',
                'products' => [
                    ['name' => 'Royal Butter Chicken Handi', 'description' => 'Clay-pot slow cooked tender chicken with cashew cream', 'price' => 450],
                    ['name' => 'Hyderabadi Dum Biryani', 'description' => 'Fragrant basmati rice layered with spiced marinated meat', 'price' => 380],
                    ['name' => 'Artisanal Woodfired Pizza', 'description' => 'Fresh mozzarella, basil, and San Marzano tomato sauce', 'price' => 499],
                ],
                'services' => [
                    ['name' => 'Table Reservation & VIP Lounge', 'description' => 'Instant table booking with zero waiting time', 'price_from' => 0, 'price_to' => 500],
                    ['name' => 'Private Banquet & Birthday Parties', 'description' => 'Dedicated hall for 50-200 guests with custom catering', 'price_from' => 15000, 'price_to' => 50000],
                ],
                'offers' => [
                    ['title' => 'Flat 20% Off on Food Bill', 'promo_code' => 'ROYAL20', 'discount_type' => 'percentage', 'discount_value' => 20],
                ]
            ],
            [
                'slug' => 'hotels-lodging',
                'name' => 'Hotels & Lodging',
                'email' => 'hotel@truedial.in',
                'owner' => 'Rajeshwar Singh',
                'business_name' => 'Grand Central Hotel & Luxury Suites',
                'professional_type' => 'hotel',
                'tagline' => 'Luxury Stay, 24/7 Room Service & Executive Banquet',
                'description' => 'Premium 4-star boutique hotel with spacious suites, high-speed Wi-Fi, multi-cuisine restaurant, and airport shuttle service.',
                'city' => 'Patna',
                'address' => 'Exhibition Road, South Gandhi Maidan, Patna, Bihar',
                'cover_image' => 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop',
                'products' => [
                    ['name' => 'Executive Deluxe Suite', 'description' => 'King size bed, city view, breakfast included', 'price' => 3499],
                    ['name' => 'Presidential Family Suite', 'description' => 'Two interconnected bedrooms, jacuzzi & living lounge', 'price' => 6999],
                ],
                'services' => [
                    ['name' => '24/7 Room Service & Concierge', 'description' => 'Round the clock dining and local city tours', 'price_from' => 500, 'price_to' => 2000],
                    ['name' => 'Conference & Seminar Hall', 'description' => 'Projector, high-speed audio/video conference room', 'price_from' => 10000, 'price_to' => 30000],
                ],
                'offers' => [
                    ['title' => 'Weekend Gateway 25% Off', 'promo_code' => 'WEEKEND25', 'discount_type' => 'percentage', 'discount_value' => 25],
                ]
            ],
            [
                'slug' => 'hospitals-healthcare',
                'name' => 'Hospitals & Healthcare',
                'email' => 'healthcare@truedial.in',
                'owner' => 'Dr. Ananya Sen, MD',
                'business_name' => 'Apollo Care Multi-Speciality Clinic & Diagnostic',
                'professional_type' => 'doctor',
                'tagline' => 'Advanced Diagnostics, Cardiology & Family Care',
                'description' => 'Comprehensive healthcare centre equipped with modern diagnostic lab, ultrasound, ECG, cardiology, and general medicine OPD.',
                'city' => 'Patna',
                'address' => 'Kankarbagh Main Road, Near Tempo Stand, Patna, Bihar',
                'cover_image' => 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=1000&auto=format&fit=crop',
                'products' => [
                    ['name' => 'Full Body Health Checkup Package', 'description' => 'Complete blood count, lipid profile, liver & kidney tests', 'price' => 1499],
                    ['name' => 'Cardiac Care & ECG Screening', 'description' => 'Consultation with Senior Cardiologist + ECG', 'price' => 999],
                ],
                'services' => [
                    ['name' => 'OPD Doctor Consultation', 'description' => 'In-person general medicine and specialist consultation', 'price_from' => 500, 'price_to' => 1000],
                    ['name' => 'Home Sample Collection', 'description' => 'Phlebotomist doorstep blood collection with online reports', 'price_from' => 100, 'price_to' => 300],
                ],
                'offers' => [
                    ['title' => 'Free Blood Sugar & BP Checkup', 'promo_code' => 'HEALTHFREE', 'discount_type' => 'fixed', 'discount_value' => 200],
                ],
                'patients' => [
                    [
                        'name' => 'Ramesh Kumar Jha',
                        'age' => 45,
                        'gender' => 'Male',
                        'phone' => '+91 9835012345',
                        'blood_group' => 'B+',
                        'condition' => 'Type 2 Diabetes & Hypertension',
                        'status' => 'In Treatment',
                        'allergies' => 'Sulfa drugs',
                    ],
                    [
                        'name' => 'Sunita Devi',
                        'age' => 38,
                        'gender' => 'Female',
                        'phone' => '+91 9431098765',
                        'blood_group' => 'O+',
                        'condition' => 'Thyroid & Vitamin D Deficiency',
                        'status' => 'Follow Up',
                        'allergies' => 'None',
                    ],
                    [
                        'name' => 'Aarav Sharma',
                        'age' => 12,
                        'gender' => 'Male',
                        'phone' => '+91 9122045678',
                        'blood_group' => 'A+',
                        'condition' => 'Seasonal Allergy & Bronchitis',
                        'status' => 'Recovered',
                        'allergies' => 'Dust, Penicillin',
                    ]
                ]
            ],
            [
                'slug' => 'education-coaching',
                'name' => 'Education & Coaching',
                'email' => 'education@truedial.in',
                'owner' => 'Prof. Alok Pandey',
                'business_name' => 'Target IIT-JEE & NEET Premier Academy',
                'professional_type' => 'coaching',
                'tagline' => 'Top Rank Results, Expert Faculty & Digital Test Series',
                'description' => 'Premier coaching institute with top 100 AIR rankers in JEE Advanced and NEET. Smart classrooms and individual mentoring.',
                'city' => 'Patna',
                'address' => 'Boring Canal Road, Pantaloons Crossing, Patna, Bihar',
                'cover_image' => 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1000&auto=format&fit=crop',
                'products' => [
                    ['name' => 'JEE Advanced 2-Year Target Course', 'description' => 'Complete Physics, Chemistry, Maths coaching with study material', 'price' => 65000],
                    ['name' => 'NEET Medical Foundation Batch', 'description' => 'NCERT line-by-line preparation with weekly mock tests', 'price' => 55000],
                ],
                'services' => [
                    ['name' => 'Free Career Counseling & Demo Class', 'description' => '3-day trial classes with subject experts', 'price_from' => 0, 'price_to' => 0],
                    ['name' => 'All India Online Test Series', 'description' => '50+ full-length CBT tests with detailed analysis', 'price_from' => 2999, 'price_to' => 4999],
                ],
                'offers' => [
                    ['title' => 'Up to 50% Scholarship on Admission Test', 'promo_code' => 'SCHOLAR50', 'discount_type' => 'percentage', 'discount_value' => 50],
                ]
            ],
            [
                'slug' => 'interior-architecture',
                'name' => 'Interior & Architecture',
                'email' => 'interior@truedial.in',
                'owner' => 'Ar. Rohan Sengupta',
                'business_name' => 'Studio Elite Interiors & Architectural Design',
                'professional_type' => 'architect',
                'tagline' => 'Modern Luxury Interiors, 3D Elevation & Turnkey Contracting',
                'description' => 'Award-winning interior design studio specializing in luxury residences, modular kitchens, smart lighting, and turnkey execution.',
                'city' => 'Patna',
                'address' => 'Bailey Road, Saguna More, Patna, Bihar',
                'cover_image' => 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1000&auto=format&fit=crop',
                'products' => [
                    ['name' => 'German Acrylic Modular Kitchen', 'description' => 'Soft-close Hettich hardware, quartz countertop', 'price' => 125000],
                    ['name' => 'Designer Master Bedroom Wardrobe', 'description' => 'Floor-to-ceiling sliding wardrobe with tinted glass', 'price' => 85000],
                ],
                'services' => [
                    ['name' => 'Full 3D Elevation & Space Planning', 'description' => 'Photorealistic 3D renders with VR walkthrough', 'price_from' => 15000, 'price_to' => 45000],
                    ['name' => 'Complete Turnkey Home Interior', 'description' => 'From bare shell to fully furnished move-in ready home', 'price_from' => 450000, 'price_to' => 1500000],
                ],
                'offers' => [
                    ['title' => 'Free 3D Design with Full Home Interior Booking', 'promo_code' => 'FREE3D', 'discount_type' => 'fixed', 'discount_value' => 15000],
                ]
            ],
            [
                'slug' => 'repair-maintenance',
                'name' => 'Repair & Maintenance',
                'email' => 'repair@truedial.in',
                'owner' => 'Mohd. Imran',
                'business_name' => 'QuickFix Home Appliance & AC Solutions',
                'professional_type' => 'contractor',
                'tagline' => 'Same-Day AC, Refrigerator, RO & Washing Machine Repair',
                'description' => 'Certified technicians offering doorstep repair for all major appliance brands with 90-day service warranty.',
                'city' => 'Patna',
                'address' => 'Ashok Rajpath, Near Science College, Patna, Bihar',
                'cover_image' => 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1000&auto=format&fit=crop',
                'products' => [
                    ['name' => 'RO Water Purifier Membrane Kit', 'description' => '100 GPD high TDS filtration membrane', 'price' => 1200],
                ],
                'services' => [
                    ['name' => 'Split AC Deep Foam Jet Service', 'description' => 'High pressure indoor & outdoor coil cleaning', 'price_from' => 499, 'price_to' => 799],
                    ['name' => 'Washing Machine Drum & Motor Repair', 'description' => 'Diagnostic check and genuine part replacement', 'price_from' => 350, 'price_to' => 1500],
                ],
                'offers' => [
                    ['title' => '₹100 Off on First AC Service', 'promo_code' => 'AC100', 'discount_type' => 'fixed', 'discount_value' => 100],
                ]
            ],
            [
                'slug' => 'digital-marketing-it',
                'name' => 'Digital Marketing & IT',
                'email' => 'digital@truedial.in',
                'owner' => 'Abhishek Roy',
                'business_name' => 'PixelPulse Digital Growth & Web Agency',
                'professional_type' => 'agency',
                'tagline' => 'SEO, Meta & Google Ads, Custom Web & App Development',
                'description' => 'Performance marketing and tech agency generating high ROI through hyper-local Google Ads, SEO, and Next.js web applications.',
                'city' => 'Patna',
                'address' => 'Dak Bunglow Road, Beside Maurya Lok, Patna, Bihar',
                'cover_image' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
                'products' => [
                    ['name' => 'Custom Next.js Business Website', 'description' => 'Ultra-fast, mobile responsive, SEO optimized 5-page site', 'price' => 14999],
                    ['name' => 'Local SEO & Google Maps Ranking Pack', 'description' => 'Top 3 Map Pack optimization with citation building', 'price' => 7999],
                ],
                'services' => [
                    ['name' => 'Google & Meta Performance Ads', 'description' => 'End-to-end campaign creation, copy, and ROAS optimization', 'price_from' => 9999, 'price_to' => 25000],
                ],
                'offers' => [
                    ['title' => 'Free Website SEO Audit Worth ₹5000', 'promo_code' => 'SEOFREE', 'discount_type' => 'fixed', 'discount_value' => 5000],
                ]
            ],
            [
                'slug' => 'fitness-gyms',
                'name' => 'Fitness & Gyms',
                'email' => 'fitness@truedial.in',
                'owner' => 'Kunal Kashyap',
                'business_name' => 'IronPulse Fitness & Crossfit Hub',
                'professional_type' => 'gym',
                'tagline' => 'Imported Equipment, Certified Personal Trainers & Steam Bath',
                'description' => 'Patna’s premier 5000 sq.ft fitness centre featuring strength machines, cardio theatre, crossfit rig, and certified dieticians.',
                'city' => 'Patna',
                'address' => 'Rajendra Nagar, Road No. 12, Patna, Bihar',
                'cover_image' => 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop',
                'products' => [
                    ['name' => 'Annual Gold Gym Membership', 'description' => 'Full access to cardio, weights, sauna & locker', 'price' => 14999],
                    ['name' => 'Quarterly Transformation Pass', 'description' => '3-month access with body composition analysis', 'price' => 4999],
                ],
                'services' => [
                    ['name' => 'Personal Training & Nutrition Plan', 'description' => '1-on-1 certified trainer guidance with weekly diet chart', 'price_from' => 3000, 'price_to' => 7000],
                ],
                'offers' => [
                    ['title' => 'Get 2 Months Extra on Annual Membership', 'promo_code' => 'FITEXTRA', 'discount_type' => 'fixed', 'discount_value' => 2500],
                ]
            ],
            [
                'slug' => 'salons-beauty',
                'name' => 'Salons & Beauty',
                'email' => 'salon@truedial.in',
                'owner' => 'Meera Kapoor',
                'business_name' => 'Luxe Glow Premium Unisex Salon & Spa',
                'professional_type' => 'salon',
                'tagline' => 'Bridal Makeover, Keratin Treatment & Luxury Spa',
                'description' => 'International styling standards, organic hair therapies, expert nail art, and celebrity bridal makeup artists.',
                'city' => 'Patna',
                'address' => 'Pataliputra Colony, Main Road, Patna, Bihar',
                'cover_image' => 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1000&auto=format&fit=crop',
                'products' => [
                    ['name' => 'O3+ Bridal Glow Facial Kit', 'description' => 'Complete skin brightening and rejuvenation treatment', 'price' => 2500],
                    ['name' => 'Keratin Hair Spa & Treatment', 'description' => 'Formaldehyde-free smoothing therapy', 'price' => 3999],
                ],
                'services' => [
                    ['name' => 'HD Bridal Makeup & Draping', 'description' => 'Waterproof airbrush makeup with lashes and hair styling', 'price_from' => 12000, 'price_to' => 25000],
                    ['name' => 'Men Grooming & Beard Styling', 'description' => 'Precision haircut, beard shaping, and scalp detox', 'price_from' => 499, 'price_to' => 1200],
                ],
                'offers' => [
                    ['title' => 'Flat 30% Off on Beauty & Spa Services', 'promo_code' => 'GLOW30', 'discount_type' => 'percentage', 'discount_value' => 30],
                ]
            ],
            [
                'slug' => 'automobile-services',
                'name' => 'Automobile Services',
                'email' => 'automobile@truedial.in',
                'owner' => 'Deepak Verma',
                'business_name' => 'SpeedCraft Multi-Brand Car Care & Detailing',
                'professional_type' => 'mechanic',
                'tagline' => 'Ceramic Coating, Engine Diagnostics & Foam Wash',
                'description' => 'High-tech automobile workshop with computerized wheel alignment, paintless dent repair, 9H ceramic coating, and genuine spares.',
                'city' => 'Patna',
                'address' => 'NH-30, Anisabad Bypass, Patna, Bihar',
                'cover_image' => 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=1000&auto=format&fit=crop',
                'products' => [
                    ['name' => 'Synthetic Engine Oil 5W-30 (4L)', 'description' => 'Full synthetic high performance oil', 'price' => 2400],
                ],
                'services' => [
                    ['name' => 'Periodic Comprehensive Car Service', 'description' => '50-point inspection, oil filter change, brake clean, wash', 'price_from' => 2999, 'price_to' => 5999],
                    ['name' => '9H Nano Ceramic Coating (3 Years)', 'description' => 'Paint correction, high gloss scratch protection', 'price_from' => 12000, 'price_to' => 22000],
                ],
                'offers' => [
                    ['title' => 'Free Foam Wash with Full Service', 'promo_code' => 'CARWASH', 'discount_type' => 'fixed', 'discount_value' => 500],
                ]
            ],
            [
                'slug' => 'event-management',
                'name' => 'Event Management',
                'email' => 'event@truedial.in',
                'owner' => 'Manish Agarwal',
                'business_name' => 'Grandeur Weddings & Corporate Event Planners',
                'professional_type' => 'planner',
                'tagline' => 'Theme Weddings, Celebrity Concerts & Corporate Expos',
                'description' => 'Full-service event management agency orchestrating dreamy destination weddings, corporate galas, and light & sound setups.',
                'city' => 'Patna',
                'address' => 'Fraser Road, Near Patna Junction, Patna, Bihar',
                'cover_image' => 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop',
                'products' => [],
                'services' => [
                    ['name' => 'Destination Wedding Planning', 'description' => 'End-to-end venue selection, decor, hospitality, catering', 'price_from' => 100000, 'price_to' => 500000],
                ],
                'offers' => [
                    ['title' => '10% Discount on Wedding Decor Packages', 'promo_code' => 'WED10', 'discount_type' => 'percentage', 'discount_value' => 10],
                ]
            ],
            [
                'slug' => 'real-estate-property',
                'name' => 'Real Estate & Property',
                'email' => 'realestate@truedial.in',
                'owner' => 'Sanjay Singhania',
                'business_name' => 'PrimeLand Realty & Commercial Advisory',
                'professional_type' => 'broker',
                'tagline' => 'RERA Approved Plots, Luxury Flats & Commercial Shops',
                'description' => 'Trusted real estate consultancy connecting buyers with verified residential apartments, commercial plots, and farm houses.',
                'city' => 'Patna',
                'address' => 'Gola Road, Danapur, Patna, Bihar',
                'cover_image' => 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop',
                'products' => [],
                'services' => [
                    ['name' => 'Property Valuation & Legal Verification', 'description' => 'Title search, mutation checking, and market appraisal', 'price_from' => 2500, 'price_to' => 5000],
                ],
                'offers' => [
                    ['title' => 'Zero Brokerage on Select Luxury Apartments', 'promo_code' => 'ZEROBROKER', 'discount_type' => 'fixed', 'discount_value' => 0],
                ]
            ],
            [
                'slug' => 'legal-financial',
                'name' => 'Legal & Financial Services',
                'email' => 'legal@truedial.in',
                'owner' => 'Adv. Ritesh Tiwari',
                'business_name' => 'TaxPro Financial & Legal Associates',
                'professional_type' => 'consultant',
                'tagline' => 'GST Filing, Income Tax Returns & Corporate Compliance',
                'description' => 'Chartered Accountants and Corporate Lawyers providing GST registration, trademark filing, company incorporation, and legal advice.',
                'city' => 'Patna',
                'address' => 'Maurya Lok Complex, Block B, Patna, Bihar',
                'cover_image' => 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1000&auto=format&fit=crop',
                'products' => [],
                'services' => [
                    ['name' => 'Private Limited Company Registration', 'description' => 'Name approval, DIN, MOA, AOA, PAN, TAN & Bank setup', 'price_from' => 4999, 'price_to' => 8999],
                ],
                'offers' => [
                    ['title' => 'Free GST Consultation for MSMEs', 'promo_code' => 'GSTFREE', 'discount_type' => 'fixed', 'discount_value' => 1000],
                ]
            ],
            [
                'slug' => 'grocery-supermarket',
                'name' => 'Grocery & Supermarket',
                'email' => 'grocery@truedial.in',
                'owner' => 'Gopal Krishna',
                'business_name' => 'FreshCart Organic Supermarket',
                'professional_type' => 'retailer',
                'tagline' => 'Farm Fresh Vegetables, Organic Staples & Doorstep Delivery',
                'description' => 'One-stop department store with chemical-free grains, cold-pressed oils, imported gourmet food, and 60-minute express delivery.',
                'city' => 'Patna',
                'address' => 'Kankarbagh Colony More, Patna, Bihar',
                'cover_image' => 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop',
                'products' => [
                    ['name' => 'Organic Cold-Pressed Mustard Oil (5L)', 'description' => 'Kacchi Ghani 100% pure mustard oil', 'price' => 850],
                ],
                'services' => [
                    ['name' => 'Express 60-Minute Home Delivery', 'description' => 'Free delivery on orders above ₹499', 'price_from' => 0, 'price_to' => 40],
                ],
                'offers' => [
                    ['title' => '₹150 Off on First Grocery Order', 'promo_code' => 'FRESH150', 'discount_type' => 'fixed', 'discount_value' => 150],
                ]
            ],
            [
                'slug' => 'pharmacy-medical',
                'name' => 'Pharmacy & Medical Store',
                'email' => 'pharmacy@truedial.in',
                'owner' => 'Naveen Sinha',
                'business_name' => 'CarePlus 24x7 Pharmacy & Surgical Store',
                'professional_type' => 'retailer',
                'tagline' => 'Genuine Allopathic, Ayurvedic Medicines & Surgical Aids',
                'description' => '24-hour certified retail pharmacy offering genuine medicines, orthopaedic supports, baby care, and temperature-controlled insulin storage.',
                'city' => 'Patna',
                'address' => 'PMCH Gate No. 2, Ashok Rajpath, Patna, Bihar',
                'cover_image' => 'https://images.unsplash.com/photo-1576602976047-174e57a47881?q=80&w=1000&auto=format&fit=crop',
                'products' => [],
                'services' => [
                    ['name' => '24/7 Doorstep Medicine Delivery', 'description' => 'Fast delivery across Patna with prescription upload', 'price_from' => 0, 'price_to' => 50],
                ],
                'offers' => [
                    ['title' => 'Flat 15% Off on Prescribed Medicines', 'promo_code' => 'MED15', 'discount_type' => 'percentage', 'discount_value' => 15],
                ]
            ],
            [
                'slug' => 'electronics-gadgets',
                'name' => 'Electronics & Gadgets',
                'email' => 'electronics@truedial.in',
                'owner' => 'Sumit Khemka',
                'business_name' => 'NextGen Smart Electronics & Apple Zone',
                'professional_type' => 'retailer',
                'tagline' => 'Smartphones, Laptops, OLED TVs & Smart Home Gadgets',
                'description' => 'Authorized electronic retailer for Apple, Samsung, Sony, and Dell. Zero-cost EMI options and instant exchange discounts.',
                'city' => 'Patna',
                'address' => 'SP Verma Road, Patna, Bihar',
                'cover_image' => 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1000&auto=format&fit=crop',
                'products' => [
                    ['name' => 'True Wireless Noise Cancelling Earbuds', 'description' => '40hr battery, active noise cancellation', 'price' => 2999],
                ],
                'services' => [],
                'offers' => [
                    ['title' => '₹1000 Instant Cash Discount on Laptops', 'promo_code' => 'LAPTOP1000', 'discount_type' => 'fixed', 'discount_value' => 1000],
                ]
            ],
            [
                'slug' => 'clothing-fashion',
                'name' => 'Clothing & Fashion',
                'email' => 'fashion@truedial.in',
                'owner' => 'Pooja Jaiswal',
                'business_name' => 'Vogue Elegance Bridal & Ethnic Studio',
                'professional_type' => 'boutique',
                'tagline' => 'Designer Lehengas, Sherwanis & Custom Tailoring',
                'description' => 'High-end ethnic fashion studio showcasing handcrafted zari lehengas, royal sherwanis, banarasi silk sarees, and custom bespoke tailoring.',
                'city' => 'Patna',
                'address' => 'Hathwa Market, Bari Road, Patna, Bihar',
                'cover_image' => 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop',
                'products' => [],
                'services' => [
                    ['name' => 'Custom Bridal Blouse & Lehenga Tailoring', 'description' => 'Custom embroidery and fit within 7 days', 'price_from' => 1500, 'price_to' => 5000],
                ],
                'offers' => [
                    ['title' => 'Flat 20% Off on Festive Ethnic Wear', 'promo_code' => 'ETHNIC20', 'discount_type' => 'percentage', 'discount_value' => 20],
                ]
            ],
            [
                'slug' => 'furniture-home-decor',
                'name' => 'Furniture & Home Decor',
                'email' => 'furniture@truedial.in',
                'owner' => 'Harsh Vardhan',
                'business_name' => 'Royal Teakwood & Modern Living Decor',
                'professional_type' => 'furniture',
                'tagline' => 'Pure Sheesham Wood Sofas, Dining Sets & Recliners',
                'description' => 'Handcrafted solid wood furniture showroom. 10-year termite warranty on all teak and sheesham living, dining, and bedroom sets.',
                'city' => 'Patna',
                'address' => 'Danapur Khagaul Road, Patna, Bihar',
                'cover_image' => 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1000&auto=format&fit=crop',
                'products' => [
                    ['name' => '6-Seater Solid Sheesham Dining Table', 'description' => 'Hand-polished natural honey finish', 'price' => 32000],
                ],
                'services' => [],
                'offers' => [
                    ['title' => 'Free Delivery & Assembly on Orders Above ₹20k', 'promo_code' => 'FREEDEL', 'discount_type' => 'fixed', 'discount_value' => 1500],
                ]
            ],
            [
                'slug' => 'photography-videography',
                'name' => 'Photography & Videography',
                'email' => 'photography@truedial.in',
                'owner' => 'Arjun Shrivastava',
                'business_name' => 'PixelVisions Cinematic Wedding Stories',
                'professional_type' => 'photographer',
                'tagline' => '4K Cinematic Wedding Films, Drone & Candid Photography',
                'description' => 'Award-winning wedding photography collective creating emotional cinematic wedding films, pre-wedding destination shoots, and luxury coffee table albums.',
                'city' => 'Patna',
                'address' => 'Boring Road, Anandpuri, Patna, Bihar',
                'cover_image' => 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1000&auto=format&fit=crop',
                'products' => [],
                'services' => [
                    ['name' => 'Complete 3-Day Wedding Photography Package', 'description' => '2 Candid + 2 Traditional + 1 Drone operator + Cinematic Teaser + Hardcover Album', 'price_from' => 75000, 'price_to' => 150000],
                ],
                'offers' => [
                    ['title' => 'Free Pre-Wedding Shoot with Premium Wedding Package', 'promo_code' => 'PREWEDFREE', 'discount_type' => 'fixed', 'discount_value' => 20000],
                ]
            ],
            [
                'slug' => 'packers-movers',
                'name' => 'Packers & Movers',
                'email' => 'packers@truedial.in',
                'owner' => 'Pramod Yadav',
                'business_name' => 'SafeShift Express Packers & Relocations',
                'professional_type' => 'transporter',
                'tagline' => 'Zero-Damage Household Shifting, Car Carrier & Storage',
                'description' => 'IBA-approved packers and movers offering 5-layer bubble packing, closed container vehicles, transit insurance, and hassle-free relocation.',
                'city' => 'Patna',
                'address' => 'Transport Nagar, Kumhrar, Patna, Bihar',
                'cover_image' => 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1000&auto=format&fit=crop',
                'products' => [],
                'services' => [
                    ['name' => 'Local 2BHK/3BHK Home Shifting', 'description' => 'Complete packing, loading, unloading and unpacking', 'price_from' => 4500, 'price_to' => 12000],
                ],
                'offers' => [
                    ['title' => '15% Off on Intercity Household Moving', 'promo_code' => 'MOVE15', 'discount_type' => 'percentage', 'discount_value' => 15],
                ]
            ],
            [
                'slug' => 'catering-tiffin',
                'name' => 'Catering & Tiffin Service',
                'email' => 'catering@truedial.in',
                'owner' => 'Shweta Jha',
                'business_name' => 'Annapurna Gourmet Caterers & Healthy Tiffins',
                'professional_type' => 'caterer',
                'tagline' => 'Pure Desi Ghee Catering, Corporate Meals & Daily Tiffin',
                'description' => 'Hygienic home-style food delivery and luxury event catering serving authentic Bihari, Rajasthani, and South Indian cuisines.',
                'city' => 'Patna',
                'address' => 'SK Puri, Boring Road, Patna, Bihar',
                'cover_image' => 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1000&auto=format&fit=crop',
                'products' => [],
                'services' => [
                    ['name' => 'Monthly Executive Lunch Tiffin (26 Days)', 'description' => '4 Roti, Rice, Dal, Special Sabzi, Salad & Sweet', 'price_from' => 2400, 'price_to' => 3200],
                ],
                'offers' => [
                    ['title' => '3-Day Free Trial Tiffin for New Students/Office Goers', 'promo_code' => 'TIFFIN3', 'discount_type' => 'fixed', 'discount_value' => 300],
                ]
            ],
            [
                'slug' => 'pet-services',
                'name' => 'Pet Services & Veterinary',
                'email' => 'pets@truedial.in',
                'owner' => 'Dr. Rohit Mehra',
                'business_name' => 'Paws & Claws Multi-Speciality Pet Clinic & Grooming',
                'professional_type' => 'vet',
                'tagline' => 'Pet Vaccination, Surgery, Medicated Bath & Boarding',
                'description' => 'Dedicated small animal hospital with digital X-ray, dental scaling, pet spa grooming, premium food, and climate-controlled daycare boarding.',
                'city' => 'Patna',
                'address' => 'Patliputra Industrial Area, Patna, Bihar',
                'cover_image' => 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=1000&auto=format&fit=crop',
                'products' => [],
                'services' => [
                    ['name' => 'Complete Dog Grooming Spa Package', 'description' => 'Herbal bath, blow dry, nail clipping, ear cleaning, hair trim', 'price_from' => 799, 'price_to' => 1499],
                ],
                'offers' => [
                    ['title' => '20% Off on First Pet Spa Session', 'promo_code' => 'PETSPA20', 'discount_type' => 'percentage', 'discount_value' => 20],
                ]
            ],
            [
                'slug' => 'jewellery-accessories',
                'name' => 'Jewellery & Accessories',
                'email' => 'jewellery@truedial.in',
                'owner' => 'Rameshwar Lal Saraf',
                'business_name' => 'Heritage 916 Hallmark Gold & Diamond Jewellers',
                'professional_type' => 'jeweller',
                'tagline' => 'BIS Hallmarked 22K Gold, Certified Solitaires & Polki',
                'description' => '75-year legacy of unmatched trust offering antique bridal necklaces, IGI certified diamonds, lightweight daily gold, and 100% exchange value.',
                'city' => 'Patna',
                'address' => 'Bakerganj, Near Gandhi Maidan, Patna, Bihar',
                'cover_image' => 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000&auto=format&fit=crop',
                'products' => [],
                'services' => [],
                'offers' => [
                    ['title' => 'Flat 50% Off on Gold Making Charges', 'promo_code' => 'GOLD50', 'discount_type' => 'percentage', 'discount_value' => 50],
                ]
            ],
            [
                'slug' => 'bakery-sweets',
                'name' => 'Bakery & Sweets',
                'email' => 'bakery@truedial.in',
                'owner' => 'Kishore Kanodia',
                'business_name' => 'SweetCrust Artisan Bakery & Patisserie',
                'professional_type' => 'baker',
                'tagline' => 'Fresh Fondant Cakes, Eggless Pastries & Belgian Waffles',
                'description' => 'European patisserie and artisan bakery specializing in customized multi-tier wedding cakes, French macarons, sourdough breads, and pure ghee sweets.',
                'city' => 'Patna',
                'address' => 'Boring Road, Opposite Jamuna Apartment, Patna, Bihar',
                'cover_image' => 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop',
                'products' => [
                    ['name' => 'Belgian Dark Chocolate Truffle Cake (1kg)', 'description' => 'Rich 70% dark chocolate mousse cake', 'price' => 850],
                ],
                'services' => [],
                'offers' => [
                    ['title' => 'Free Cupcake Box on Orders Above ₹500', 'promo_code' => 'CAKEFREE', 'discount_type' => 'fixed', 'discount_value' => 150],
                ]
            ],
            [
                'slug' => 'opticals-eyewear',
                'name' => 'Opticals & Eyewear',
                'email' => 'opticals@truedial.in',
                'owner' => 'Dr. R. K. Goel',
                'business_name' => 'VisionCraft Advanced Eye Clinic & Eyewear',
                'professional_type' => 'optometrist',
                'tagline' => 'Computerized Eye Testing, Progressive Lenses & Ray-Ban',
                'description' => 'State-of-the-art optical clinic with automated refractor testing, anti-glare blue cut lenses, designer sunglasses, and contact lenses.',
                'city' => 'Patna',
                'address' => 'Kankarbagh Main Road, Patna, Bihar',
                'cover_image' => 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1000&auto=format&fit=crop',
                'products' => [],
                'services' => [
                    ['name' => 'Computerized 6-Step Vision Test', 'description' => 'Accurate power assessment with trial frame', 'price_from' => 0, 'price_to' => 200],
                ],
                'offers' => [
                    ['title' => 'Buy 1 Get 1 Free on Select Frame & Lens Pairs', 'promo_code' => 'BOGOEYE', 'discount_type' => 'percentage', 'discount_value' => 50],
                ]
            ],
            [
                'slug' => 'mobile-computer-repair',
                'name' => 'Mobile & Computer Repair',
                'email' => 'techrepair@truedial.in',
                'owner' => 'Tariq Anwar',
                'business_name' => 'ChipMaster iPhone, Laptop & Motherboard Clinic',
                'professional_type' => 'technician',
                'tagline' => 'Same-Day Screen Replacement, Data Recovery & Chip Repair',
                'description' => 'Certified micro-soldering and chip-level repair lab for Apple iPhones, MacBooks, gaming laptops, water-damaged motherboards, and broken OLED screens.',
                'city' => 'Patna',
                'address' => 'Hariniwas Complex, Dak Bunglow Road, Patna, Bihar',
                'cover_image' => 'https://images.unsplash.com/photo-1597740985671-2a8a3b80502e?q=80&w=1000&auto=format&fit=crop',
                'products' => [],
                'services' => [
                    ['name' => 'iPhone / iPad Display Replacement (30 Mins)', 'description' => 'Original quality screen with TrueTone restoration', 'price_from' => 1800, 'price_to' => 8500],
                ],
                'offers' => [
                    ['title' => 'Free Tempered Glass with Every Screen Repair', 'promo_code' => 'GLASSOFFER', 'discount_type' => 'fixed', 'discount_value' => 250],
                ]
            ],
        ];

        foreach ($categoriesConfig as $cfg) {
            // 1. Get or Create Category
            $category = Category::firstOrCreate(
                ['slug' => $cfg['slug']],
                ['name' => $cfg['name'], 'is_active' => true]
            );

            // 2. Create or Update Vendor User
            $user = User::updateOrCreate(
                ['email' => $cfg['email']],
                [
                    'name' => $cfg['owner'],
                    'phone' => '+91 9' . rand(100000000, 999999999),
                    'password' => $password,
                    'professional_type' => $cfg['professional_type'] ?? 'vendor',
                    'is_active' => true,
                    'is_verified' => true,
                    'is_verified_business' => true,
                    'verification_level' => 3,
                    'trust_score' => rand(85, 98),
                    'profile_completion_score' => 100,
                ]
            );

            if (!$user->roles()->where('role_id', $businessRole->id)->exists()) {
                $user->roles()->attach($businessRole->id);
            }

            // 3. Issue Active Digital Privilege Card for testing
            PrivilegeCard::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'card_number' => 'TD-' . strtoupper(substr(md5($cfg['slug']), 0, 4)) . '-' . rand(1000, 9999),
                    'status' => 'active',
                    'valid_until' => now()->addYear(),
                ]
            );

            // 4. Create or Update Business Listing
            $listing = Listing::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'title' => $cfg['business_name'],
                    'slug' => Str::slug($cfg['business_name']),
                    'category_id' => $category->id,
                    'tagline' => $cfg['tagline'],
                    'description' => $cfg['description'],
                    'city' => $cfg['city'],
                    'district' => $cfg['city'],
                    'state' => 'Bihar',
                    'address' => $cfg['address'],
                    'phone' => $user->phone,
                    'whatsapp' => preg_replace('/[^0-9]/', '', $user->phone),
                    'email' => $cfg['email'],
                    'website' => 'https://' . Str::slug($cfg['business_name']) . '.in',
                    'cover_image' => $cfg['cover_image'] ?? null,
                    'status' => 'active',
                    'is_verified' => true,
                    'is_featured' => true,
                    'avg_rating' => (float) (rand(44, 49) / 10),
                    'review_count' => rand(15, 68),
                    'views_count' => rand(120, 850),
                    'phone_clicks' => rand(25, 95),
                    'whatsapp_clicks' => rand(18, 70),
                ]
            );

            // 5. Seed Products
            ListingProduct::where('listing_id', $listing->id)->delete();
            if (!empty($cfg['products'])) {
                foreach ($cfg['products'] as $prod) {
                    ListingProduct::create([
                        'listing_id' => $listing->id,
                        'name' => $prod['name'],
                        'description' => $prod['description'] ?? null,
                        'price' => $prod['price'] ?? null,
                        'is_active' => true,
                    ]);
                }
            }

            // 6. Seed Services
            ListingService::where('listing_id', $listing->id)->delete();
            if (!empty($cfg['services'])) {
                foreach ($cfg['services'] as $srv) {
                    ListingService::create([
                        'listing_id' => $listing->id,
                        'name' => $srv['name'],
                        'description' => $srv['description'] ?? null,
                        'price_from' => $srv['price_from'] ?? null,
                        'price_to' => $srv['price_to'] ?? null,
                        'is_active' => true,
                    ]);
                }
            }

            // 7. Seed Offers
            Offer::where('listing_id', $listing->id)->delete();
            if (!empty($cfg['offers'])) {
                foreach ($cfg['offers'] as $off) {
                    Offer::create([
                        'listing_id' => $listing->id,
                        'title' => $off['title'],
                        'promo_code' => $off['promo_code'],
                        'discount_type' => $off['discount_type'],
                        'discount_value' => $off['discount_value'],
                        'status' => 'active',
                        'valid_until' => now()->addMonths(3),
                        'cta_label' => 'Claim Offer',
                    ]);
                }
            }

            // 8. Seed Healthcare Patients (if applicable)
            if (!empty($cfg['patients'])) {
                Patient::where('user_id', $user->id)->delete();
                foreach ($cfg['patients'] as $idx => $pat) {
                    Patient::create([
                        'user_id' => $user->id,
                        'patient_identifier' => 'PT-2026-00' . ($idx + 1),
                        'name' => $pat['name'],
                        'age' => $pat['age'],
                        'gender' => $pat['gender'],
                        'phone' => $pat['phone'],
                        'blood_group' => $pat['blood_group'],
                        'condition' => $pat['condition'],
                        'status' => $pat['status'],
                        'allergies' => $pat['allergies'],
                        'last_visit_at' => now()->subDays($idx * 2),
                    ]);
                }
            }

            // 9. Seed Sample CRM Inquiries
            Inquiry::where('listing_id', $listing->id)->delete();
            Inquiry::create([
                'listing_id' => $listing->id,
                'name' => 'Ankit Verma',
                'phone' => '+91 9876541230',
                'email' => 'ankit.v@gmail.com',
                'service_type' => 'Service Inquiry',
                'message' => 'Hi, I would like to inquire about your pricing and availability for next week.',
                'status' => 'new',
            ]);
            Inquiry::create([
                'listing_id' => $listing->id,
                'name' => 'Pooja Kashyap',
                'phone' => '+91 8765431209',
                'email' => 'pooja.k@gmail.com',
                'service_type' => 'Privilege Card Discount',
                'message' => 'Can I use my TrueDial Privilege Card for a discount this weekend?',
                'status' => 'in_progress',
            ]);

            // 10. Seed Marketing Campaign & Invoices
            MarketingCampaign::firstOrCreate(
                ['user_id' => $user->id, 'name' => 'TrueDial Top Placement Campaign'],
                [
                    'message' => 'Promoting ' . $listing->title . ' across local search results.',
                    'audience' => ['city' => $listing->city, 'category' => $category->name],
                    'status' => 'active',
                    'scheduled_at' => now(),
                ]
            );

            TruedialInvoice::firstOrCreate(
                ['vendor_id' => $user->id, 'invoice_number' => 'TD-INV-' . strtoupper(substr(md5($cfg['slug']), 0, 6))],
                [
                    'amount' => 2999.00,
                    'tax_amount' => 539.82,
                    'status' => 'paid',
                    'issued_at' => now()->subDays(10),
                    'due_at' => now()->subDays(5),
                ]
            );

            // 11. Seed Additional Multi-City Listings (Delhi NCR, Mumbai, Bengaluru) for search completeness
            $metroLocations = [
                ['city' => 'Delhi NCR', 'district' => 'Delhi NCR', 'state' => 'Delhi', 'address' => 'Connaught Place / Cyber Hub, Delhi NCR'],
                ['city' => 'Delhi', 'district' => 'Delhi', 'state' => 'Delhi', 'address' => 'South Extension, New Delhi'],
                ['city' => 'Mumbai', 'district' => 'Mumbai', 'state' => 'Maharashtra', 'address' => 'Bandra West, Linking Road, Mumbai'],
                ['city' => 'Bengaluru', 'district' => 'Bengaluru', 'state' => 'Karnataka', 'address' => 'Indiranagar 100ft Road, Bengaluru'],
            ];

            foreach ($metroLocations as $mIdx => $mLoc) {
                $mSlug = Str::slug($cfg['business_name'] . ' ' . $mLoc['city']);
                $mTitle = $cfg['business_name'] . ' (' . $mLoc['city'] . ')';

                $mListing = Listing::updateOrCreate(
                    ['slug' => $mSlug],
                    [
                        'user_id' => $user->id,
                        'title' => $mTitle,
                        'category_id' => $category->id,
                        'tagline' => $cfg['tagline'],
                        'description' => $cfg['description'],
                        'city' => $mLoc['city'],
                        'district' => $mLoc['district'],
                        'state' => $mLoc['state'],
                        'address' => $mLoc['address'],
                        'phone' => '+91 98' . rand(10000000, 99999999),
                        'whatsapp' => '9198' . rand(10000000, 99999999),
                        'email' => Str::slug($mLoc['city']) . '.' . $cfg['email'],
                        'website' => 'https://' . $mSlug . '.in',
                        'cover_image' => $cfg['cover_image'] ?? null,
                        'status' => 'active',
                        'is_verified' => true,
                        'is_featured' => true,
                        'avg_rating' => (float) (rand(45, 49) / 10),
                        'review_count' => rand(25, 90),
                        'views_count' => rand(200, 950),
                        'phone_clicks' => rand(30, 110),
                        'whatsapp_clicks' => rand(20, 85),
                    ]
                );

                if (!empty($cfg['offers'])) {
                    Offer::firstOrCreate(
                        ['listing_id' => $mListing->id, 'title' => $cfg['offers'][0]['title']],
                        [
                            'promo_code' => $cfg['offers'][0]['promo_code'],
                            'discount_type' => $cfg['offers'][0]['discount_type'],
                            'discount_value' => $cfg['offers'][0]['discount_value'],
                            'status' => 'active',
                            'valid_until' => now()->addMonths(3),
                            'cta_label' => 'Claim Offer',
                        ]
                    );
                }
            }
        }
    }
}

