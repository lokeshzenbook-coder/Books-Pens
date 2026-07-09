import { Book, Pen, Coupon, Review } from '../types';

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'b1',
    type: 'book',
    title: 'The Echo of Silence',
    author: 'Eleanor Vance',
    category: 'Fiction',
    publisher: 'Aetheria Publishing',
    isbn: '978-3-16-148410-0',
    price: 18.99,
    discount: 10,
    stock: 25,
    description: 'A gripping literary masterpiece exploring the unsent letters of a prominent 20th-century philosopher. Vance weaves an intricate story of secrets, lost love, and silent echoes across generations.',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600',
    featured: true,
    bestSeller: true,
    pages: 342,
    publishDate: '2024-03-12',
    reviews: [
      {
        id: 'r1',
        productId: 'b1',
        userName: 'Sophia L.',
        userEmail: 'sophia@example.com',
        rating: 5,
        comment: 'An absolute masterpiece. The prose is beautiful and the characters linger with you long after the final page.',
        date: '2026-05-10'
      },
      {
        id: 'r2',
        productId: 'b1',
        userName: 'Michael K.',
        userEmail: 'michael@example.com',
        rating: 4.5,
        comment: 'Very moving. Highly recommended for anyone who loves rich, character-driven fiction.',
        date: '2026-06-15'
      }
    ]
  },
  {
    id: 'b2',
    type: 'book',
    title: 'Algorithmic Mindset',
    author: 'Dr. Raymond Kurtz',
    category: 'Technology',
    publisher: 'Vertex Tech Press',
    isbn: '978-0-12-345678-9',
    price: 45.00,
    discount: 0,
    stock: 12,
    description: 'Learn to dissect complex engineering challenges using structured, algorithmic thinking. This textbook provides hands-on guidance on data structures, cognitive scaling, and mental compilation.',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=600',
    featured: true,
    bestSeller: false,
    pages: 512,
    publishDate: '2025-08-20',
    reviews: [
      {
        id: 'r3',
        productId: 'b2',
        userName: 'Alan T.',
        userEmail: 'alan@example.com',
        rating: 5,
        comment: 'Crucial reading for modern engineers. It bridges the gap between raw computer science and creative problem solving.',
        date: '2026-02-18'
      }
    ]
  },
  {
    id: 'b3',
    type: 'book',
    title: 'Beneath the Canopy',
    author: 'Clara Greenwood',
    category: 'Nature & Science',
    publisher: 'Terra Nova Books',
    isbn: '978-1-84-356028-2',
    price: 22.50,
    discount: 15,
    stock: 18,
    description: 'An immersive botanical and ecological exploration of the world’s ancient rainforests. Greenwood recounts her decade-long study of canopy-dwelling flora and their hidden communication networks.',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=600',
    featured: false,
    bestSeller: true,
    pages: 288,
    publishDate: '2025-11-05',
    reviews: []
  },
  {
    id: 'b4',
    type: 'book',
    title: 'Creative Sparks',
    author: 'Julian Thorne',
    category: 'Self-Improvement',
    publisher: 'Beacon Mind Press',
    isbn: '978-9-87-654321-0',
    price: 14.99,
    discount: 20,
    stock: 40,
    description: 'Thorne reveals practical exercises and daily habits designed to unleash latent creative potential. Perfect for writers, designers, and creators battling creative block.',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600',
    featured: false,
    bestSeller: false,
    pages: 210,
    publishDate: '2026-01-15',
    reviews: [
      {
        id: 'r4',
        productId: 'b4',
        userName: 'Emma D.',
        userEmail: 'emma@example.com',
        rating: 4,
        comment: 'Very practical tips. I liked the section on setting up a low-distraction physical workspace.',
        date: '2026-06-20'
      }
    ]
  }
];

export const INITIAL_PENS: Pen[] = [
  {
    id: 'p1',
    type: 'pen',
    brand: 'Nightingale',
    model: 'Apex Fountain Pen',
    inkColor: 'Midnight Blue',
    tipSize: 'Fine (0.5mm)',
    material: 'Polished Brass & Resin',
    price: 120.00,
    discount: 5,
    stock: 8,
    description: 'A luxurious writing instrument designed for professionals. Featuring a 14k gold-plated fine nib, a perfectly balanced heavy brass core, and high-gloss cobalt lacquer finishing.',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=600',
    featured: true,
    bestSeller: true,
    reviews: [
      {
        id: 'r5',
        productId: 'p1',
        userName: 'Henry M.',
        userEmail: 'henry@example.com',
        rating: 5,
        comment: 'Outstanding balance and ink flow. Truly a lifetime piece. Writing with it feels effortless.',
        date: '2026-04-12'
      }
    ]
  },
  {
    id: 'p2',
    type: 'pen',
    brand: 'WriteTech',
    model: 'Gel-Glide Pro',
    inkColor: 'Velvet Black',
    tipSize: 'Medium (0.7mm)',
    material: 'Recycled Matte Polymer',
    price: 4.99,
    discount: 10,
    stock: 150,
    description: 'An ultra-smooth, quick-drying gel pen optimized for fast-paced note-taking. The high-capacity archival ink prevents smudging, and the textured grip reduces finger fatigue.',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1585336139057-3c509c12002e?auto=format&fit=crop&q=80&w=600',
    featured: false,
    bestSeller: true,
    reviews: [
      {
        id: 'r6',
        productId: 'p2',
        userName: 'Lily C.',
        userEmail: 'lily@example.com',
        rating: 4,
        comment: 'The absolute best daily writer for taking rapid meeting notes. Ink dries instantly so it never smudges.',
        date: '2026-05-30'
      }
    ]
  },
  {
    id: 'p3',
    type: 'pen',
    brand: 'Stratos',
    model: 'Titanium Bolt-Action',
    inkColor: 'Graphite Black',
    tipSize: 'Ultra-Fine (0.38mm)',
    material: 'Aviation-Grade Titanium',
    price: 85.00,
    discount: 0,
    stock: 15,
    description: 'Machined from a single block of military-grade titanium, featuring an incredibly satisfying bolt-action retraction mechanism. Built to withstand extreme conditions and survive a lifetime of intensive use.',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=80&w=600',
    featured: true,
    bestSeller: false,
    reviews: []
  },
  {
    id: 'p4',
    type: 'pen',
    brand: 'Chroma',
    model: 'Felt-Tip Sketch Pen',
    inkColor: 'Burgundy Red',
    tipSize: 'Medium (0.8mm)',
    material: 'Smooth Satin Composite',
    price: 3.50,
    discount: 0,
    stock: 80,
    description: 'Designed specifically for sketching, journaling, and elegant headings. The soft felt-tip distributes rich pigmented ink evenly with light pressure.',
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1580136579312-94651dfd596d?auto=format&fit=crop&q=80&w=600',
    featured: false,
    bestSeller: false,
    reviews: []
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'DISCOUNT10',
    discountType: 'percentage',
    value: 10,
    minSpend: 20,
    isActive: true
  },
  {
    code: 'PENLOVE',
    discountType: 'fixed',
    value: 5,
    minSpend: 15,
    isActive: true
  },
  {
    code: 'BOOKWORM',
    discountType: 'percentage',
    value: 20,
    minSpend: 50,
    isActive: true
  }
];

export const CATEGORIES = {
  books: ['All', 'Fiction', 'Technology', 'Nature & Science', 'Self-Improvement'],
  pens: ['All', 'Fountain Pen', 'Gel Pen', 'Bolt-Action', 'Felt-Tip']
};

export const BRANDS = ['All', 'Nightingale', 'WriteTech', 'Stratos', 'Chroma'];
export const INK_COLORS = ['All', 'Midnight Blue', 'Velvet Black', 'Graphite Black', 'Burgundy Red'];
