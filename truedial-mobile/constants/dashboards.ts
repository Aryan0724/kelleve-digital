/**
 * Dashboard category-to-template mapping and configuration constants.
 * Maps business category slugs from the API to the correct dashboard template.
 */

export type DashboardTemplate =
  | 'hospitality'
  | 'healthcare'
  | 'professional'
  | 'wholesale'
  | 'local-service'
  | 'education'
  | 'customer';

/**
 * Maps category slugs (lowercase, from API) to dashboard template names.
 * If a user's business_category is not found, falls back to 'professional'.
 */
export const CATEGORY_DASHBOARD_MAP: Record<string, DashboardTemplate> = {
  // Hospitality
  'restaurants': 'hospitality',
  'restaurant': 'hospitality',
  'hotels': 'hospitality',
  'hotel': 'hospitality',
  'cafes': 'hospitality',
  'cafe': 'hospitality',
  'dining': 'hospitality',
  'wedding': 'hospitality',
  'wedding-planning': 'hospitality',
  'events': 'hospitality',
  'catering': 'hospitality',
  'banquet': 'hospitality',

  // Healthcare
  'hospitals': 'healthcare',
  'hospital': 'healthcare',
  'clinics': 'healthcare',
  'clinic': 'healthcare',
  'healthcare': 'healthcare',
  'dentists': 'healthcare',
  'dentist': 'healthcare',
  'dental': 'healthcare',
  'fitness': 'healthcare',
  'gym': 'healthcare',
  'physiotherapy': 'healthcare',
  'diagnostic': 'healthcare',

  // Professional Services
  'interior': 'professional',
  'interior-design': 'professional',
  'architects': 'professional',
  'architect': 'professional',
  'real-estate': 'professional',
  'real estate': 'professional',
  'construction': 'professional',
  'builders': 'professional',
  'modular-kitchen': 'professional',
  'modular kitchen': 'professional',
  'vastu': 'professional',

  // B2B Wholesale
  'b2b': 'wholesale',
  'wholesale': 'wholesale',
  'suppliers': 'wholesale',
  'supplier': 'wholesale',
  'manufacturers': 'wholesale',
  'manufacturer': 'wholesale',
  'distributors': 'wholesale',
  'industrial': 'wholesale',

  // Local Services
  'repairs': 'local-service',
  'repair': 'local-service',
  'salon': 'local-service',
  'spa': 'local-service',
  'salon-spa': 'local-service',
  'beauty': 'local-service',
  'movers': 'local-service',
  'packers': 'local-service',
  'packers-movers': 'local-service',
  'daily-needs': 'local-service',
  'groceries': 'local-service',
  'plumbing': 'local-service',
  'electrician': 'local-service',
  'cleaning': 'local-service',

  // Education
  'education': 'education',
  'schools': 'education',
  'school': 'education',
  'coaching': 'education',
  'training': 'education',
  'skill-development': 'education',
  'tuition': 'education',
};

/**
 * Resolve the dashboard template for a given user.
 */
export function resolveDashboardTemplate(
  role?: string,
  hasListing?: boolean,
  businessCategory?: string
): DashboardTemplate {
  // Customer users (Explorers)
  if (!hasListing && role !== 'business' && role !== 'vendor' && role !== 'supplier' && role !== 'builder' && role !== 'worker') {
    return 'customer';
  }

  // Business users - match category
  if (businessCategory) {
    const normalized = businessCategory.toLowerCase().trim();
    if (CATEGORY_DASHBOARD_MAP[normalized]) {
      return CATEGORY_DASHBOARD_MAP[normalized];
    }
  }

  // Default fallback for business users with unknown category
  return 'professional';
}

/**
 * Template display configuration
 */
export const TEMPLATE_CONFIG: Record<DashboardTemplate, {
  label: string;
  badgeLabel: string;
  heroGradientFrom: string;
  heroGradientTo: string;
}> = {
  hospitality: {
    label: 'Hospitality Dashboard',
    badgeLabel: 'TrueDial Hospitality',
    heroGradientFrom: '#F59E0B',
    heroGradientTo: '#EA580C',
  },
  healthcare: {
    label: 'Healthcare Dashboard',
    badgeLabel: 'TrueDial Healthcare',
    heroGradientFrom: '#0D9488',
    heroGradientTo: '#059669',
  },
  professional: {
    label: 'Professional Dashboard',
    badgeLabel: 'TrueDial Professional',
    heroGradientFrom: '#3B82F6',
    heroGradientTo: '#4F46E5',
  },
  wholesale: {
    label: 'B2B Dashboard',
    badgeLabel: 'TrueDial B2B Supplier',
    heroGradientFrom: '#10B981',
    heroGradientTo: '#0F172A',
  },
  'local-service': {
    label: 'Services Dashboard',
    badgeLabel: 'TrueDial Services',
    heroGradientFrom: '#8B5CF6',
    heroGradientTo: '#7C3AED',
  },
  education: {
    label: 'Education Dashboard',
    badgeLabel: 'TrueDial Education',
    heroGradientFrom: '#059669',
    heroGradientTo: '#0D9488',
  },
  customer: {
    label: 'My Dashboard',
    badgeLabel: 'TrueDial Member',
    heroGradientFrom: '#E8701A',
    heroGradientTo: '#C95D13',
  },
};
