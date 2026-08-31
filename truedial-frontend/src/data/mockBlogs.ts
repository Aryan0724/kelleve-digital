export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  date: string;
  readTime: string;
  imageUrl: string;
  tags: string[];
}

export const mockBlogs: BlogPost[] = [
  {
    id: "1",
    slug: "optimize-business-listing-maximum-reach",
    title: "How to Optimize Your TrueDial Business Listing for Maximum Reach",
    excerpt: "Learn the secrets to ranking higher in local search results and attracting more customers to your TrueDial profile.",
    content: `
      <p class="mb-4">Having a business listing on TrueDial is the first step toward digital growth. But simply creating a profile isn't enough. To stand out among thousands of local businesses, you need to optimize your listing.</p>
      
      <h3 class="text-xl font-bold mt-8 mb-3">1. Complete Every Detail</h3>
      <p class="mb-4">Ensure your profile is 100% complete. Add your business hours, full address, phone number, and a detailed description. Businesses with complete profiles get 7x more clicks than incomplete ones.</p>
      
      <h3 class="text-xl font-bold mt-8 mb-3">2. High-Quality Photos</h3>
      <p class="mb-4">Upload high-resolution images of your store, products, or past work. A picture is worth a thousand words, and in local search, it's worth a thousand clicks.</p>
      
      <h3 class="text-xl font-bold mt-8 mb-3">3. Encourage Customer Reviews</h3>
      <p class="mb-4">Reviews are the lifeblood of local SEO. Ask your satisfied customers to leave a 5-star review on your TrueDial profile. Respond to all reviews, both positive and negative, to show you care.</p>
    `,
    category: "Marketing",
    author: "Rohan Sharma",
    authorRole: "Digital Marketing Head",
    authorAvatar: "https://i.pravatar.cc/150?u=rohan",
    date: "Aug 15, 2026",
    readTime: "5 min read",
    imageUrl: "https://images.unsplash.com/photo-1432828684865-eb73b228b3f1?q=80&w=1200",
    tags: ["SEO", "Local Business", "Growth"]
  },
  {
    id: "2",
    slug: "strategies-convert-local-leads",
    title: "5 Proven Strategies to Convert Local Leads into Paying Customers",
    excerpt: "Stop losing potential customers to competitors. Discover actionable strategies to improve your conversion rate.",
    content: `
      <p class="mb-4">Getting traffic to your profile is great, but converting that traffic into actual paying customers is where the real challenge lies.</p>
      
      <h3 class="text-xl font-bold mt-8 mb-3">1. Respond Quickly</h3>
      <p class="mb-4">When a customer sends an inquiry through TrueDial, speed is everything. Responding within 5 minutes increases your chances of closing the deal by 400%.</p>
      
      <h3 class="text-xl font-bold mt-8 mb-3">2. Offer Exclusive TrueDial Discounts</h3>
      <p class="mb-4">Use the 'Offers' section on your profile to give a 10% discount to users who find you on TrueDial. It creates an instant incentive to choose you over a competitor.</p>
      
      <h3 class="text-xl font-bold mt-8 mb-3">3. Professional Communication</h3>
      <p class="mb-4">Always maintain a professional tone in your WhatsApp or direct messages. Provide clear quotes and transparent pricing.</p>
    `,
    category: "Sales",
    author: "Priya Desai",
    authorRole: "Sales Strategist",
    authorAvatar: "https://i.pravatar.cc/150?u=priya",
    date: "Aug 12, 2026",
    readTime: "4 min read",
    imageUrl: "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1200&auto=format&fit=crop",
    tags: ["Sales", "Conversion", "B2B"]
  },
  {
    id: "3",
    slug: "importance-online-reviews-local-seo",
    title: "Why Online Reviews Are the Most Important Metric for Local SEO",
    excerpt: "Understand the psychology behind online reviews and how they directly impact your business's search ranking.",
    content: `
      <p class="mb-4">Did you know that 93% of consumers read online reviews before making a purchase decision? In the local business ecosystem, reviews are your digital reputation.</p>
      
      <h3 class="text-xl font-bold mt-8 mb-3">The Trust Factor</h3>
      <p class="mb-4">Customers trust online reviews as much as personal recommendations from friends. A steady stream of positive reviews builds instant credibility.</p>
      
      <h3 class="text-xl font-bold mt-8 mb-3">SEO Impact</h3>
      <p class="mb-4">Search engines like Google and TrueDial use review velocity, quantity, and quality as major ranking factors. The more reviews you have, the higher you appear in search results.</p>
    `,
    category: "SEO & Growth",
    author: "Amit Patel",
    authorRole: "SEO Expert",
    authorAvatar: "https://i.pravatar.cc/150?u=amit",
    date: "Aug 08, 2026",
    readTime: "6 min read",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200",
    tags: ["Reviews", "Reputation", "SEO"]
  },
  {
    id: "4",
    slug: "future-of-local-commerce-india",
    title: "The Future of Local Commerce in India: Trends to Watch in 2026",
    excerpt: "From hyper-local delivery to AI-driven discovery, see what's next for small businesses in India's booming digital economy.",
    content: `
      <p class="mb-4">The local commerce landscape in India is evolving at breakneck speed. Here are the top trends you need to prepare for.</p>
      
      <h3 class="text-xl font-bold mt-8 mb-3">Hyper-Local AI Discovery</h3>
      <p class="mb-4">Consumers are increasingly using voice search and AI assistants to find local businesses. Ensure your business is optimized for conversational queries.</p>
      
      <h3 class="text-xl font-bold mt-8 mb-3">Instant Fulfillment</h3>
      <p class="mb-4">Whether it's a service or a product, consumers expect instant gratification. Same-day service is no longer a luxury; it's a baseline expectation.</p>
    `,
    category: "Tech & Trends",
    author: "Neha Singh",
    authorRole: "Tech Analyst",
    authorAvatar: "https://i.pravatar.cc/150?u=neha",
    date: "Aug 01, 2026",
    readTime: "7 min read",
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200",
    tags: ["Technology", "India", "Future"]
  }
];
