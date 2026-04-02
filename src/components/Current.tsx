import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Phone, Clock, ChevronDown, Menu as MenuIcon, X,
  Facebook, Twitter, Star, Flame, UtensilsCrossed, Users,
  Truck, ChefHat, ExternalLink
} from 'lucide-react';
import logo from '../colters.png';

// ─── Fonts ───────────────────────────────────────────────
const fontImport = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
`;

// ─── Color Palette ───────────────────────────────────────
const colors = `
:root {
  --charcoal: #1a1714;
  --smoke: #2a2520;
  --leather: #3d3429;
  --ember: #c4391c;
  --amber: #d4922a;
  --cream: #f5efe6;
  --bone: #e8dfd3;
  --ash: #8a8077;
}
`;

// ─── Data ────────────────────────────────────────────────
const NAV_ITEMS = ['Home', 'Menu', 'Catering', 'Locations', 'About'];

const MENU_CATEGORIES = [
  {
    name: 'Hearty Bar-B-Q Dinners',
    description: 'Served with 2 vegetables, a homemade roll, and BBQ sauce',
    items: [
      { name: 'Beef Brisket', price: '$20.25' },
      { name: 'Link Sausage', price: '$18.75' },
      { name: 'BBQ Chicken', price: '$18.75' },
      { name: 'Pulled Pork', price: '$18.75' },
      { name: 'Turkey Breast', price: '$18.75' },
      { name: 'Smoked Ham', price: '$18.75' },
      { name: '2 Meat Combo', price: '$21.50' },
      { name: '3 Meat Combo', price: '$22.50' },
    ],
  },
  {
    name: 'Smoked Rib Dinners',
    description: 'Served with 2 vegetables, a homemade roll, and BBQ sauce',
    items: [
      { name: 'Classic Pork Spare Ribs', price: '$20.99' },
      { name: 'Full Slab Baby Backs', price: '$38.35' },
      { name: '3/4 Slab Baby Backs', price: '$28.35' },
      { name: '1/2 Slab Baby Backs', price: '$25.15' },
      { name: 'Combo Rib Plate', price: '$27.85' },
    ],
  },
  {
    name: 'BBQ Sandwiches',
    description: '1/4 lb sandwiches on a sesame seed bun',
    items: [
      { name: 'Sliced or Chopped Beef', price: '$10.75' },
      { name: 'Link Sausage', price: '$9.99' },
      { name: 'Smoked Turkey', price: '$9.99' },
      { name: 'Pulled Pork', price: '$9.99' },
      { name: "Po'Boy (2 meats)", price: '$11.05' },
      { name: 'Grilled Chicken Breast', price: '$9.99' },
    ],
  },
  {
    name: 'Value Combo Meals',
    description: 'All combos include a 20oz beverage',
    items: [
      { name: '#1 Sandwich Platter', price: '$14.25' },
      { name: '#2 Sandwich Basket', price: '$13.25' },
      { name: '#3 Sandwich and Spud', price: '$14.25' },
      { name: "#4 Po'Boy Basket", price: '$14.25' },
      { name: '#5 BBQ Chicken Plate', price: '$13.25' },
      { name: '#6 Veggie Delight', price: '$13.25' },
    ],
  },
  {
    name: 'Smoked Meats by the Pound',
    description: 'Available in half pounds. Brisket at weekly market price.',
    items: [
      { name: 'Beef Brisket', price: '$27.85/lb' },
      { name: 'Chopped Brisket', price: '$27.85/lb' },
      { name: 'Link Sausage', price: '$20.45/lb' },
      { name: '1/2 BBQ Chicken', price: '$9.95' },
      { name: 'Turkey Breast', price: '$20.45/lb' },
      { name: 'Classic Spare Ribs', price: '$21.99/lb' },
      { name: 'Pulled Pork', price: '$20.45/lb' },
    ],
  },
  {
    name: 'Family Meals',
    description: 'Perfect for feeding the whole crew',
    items: [
      { name: '#1 Just a Few! — 1 lb brisket, 2 pints veggies, 4 rolls', price: '$44.00' },
      { name: '#2 Bunkhouse Treat — mixed meats, 3 pints veggies, 6 rolls', price: '$60.25' },
      { name: '#3 Family and Friends — 2 lbs meat, 2 quarts veggies, 8 rolls', price: '$62.95' },
      { name: "#4 Texas Round'up — 3 lbs meat, 3 quarts veggies, 10 rolls", price: '$99.99' },
      { name: 'Rib Feast — 2 lbs spare ribs, 2 pints veggies, 8 rolls', price: '$59.60' },
    ],
  },
  {
    name: 'Sides & Extras',
    description: 'Beans, Potato Salad, Cole Slaw, Green Beans, Corn, Mac & Cheese, Fried Okra',
    items: [
      { name: 'Individual Side', price: '$3.75' },
      { name: '1/2 Pint', price: '$5.25' },
      { name: 'Pint', price: '$8.05' },
      { name: 'Quart', price: '$15.75' },
      { name: 'Seasoned Fries (sm/lg)', price: '$3.75 / $4.99' },
      { name: 'Onion Rings (sm/lg)', price: '$4.99 / $5.50' },
    ],
  },
  {
    name: 'Salads, Burgers & More',
    description: 'Fresh off the grill',
    items: [
      { name: 'Garden or Caesar Salad', price: '$7.15' },
      { name: 'Grilled Chicken Salad', price: '$12.85' },
      { name: 'Hamburger with Fries', price: '$10.65' },
      { name: 'Cheeseburger with Fries', price: '$11.25' },
      { name: 'Bacon Cheeseburger with Fries', price: '$11.55' },
      { name: 'Stuffed Baked Potato', price: '$8.35' },
      { name: 'Chopped BBQ Baker', price: '$14.25' },
    ],
  },
  {
    name: 'Kids Meals',
    description: '12 and under — includes 1 veggie and 10oz drink',
    items: [
      { name: 'Kids Sandwich', price: '$8.75' },
      { name: 'Kids Plate', price: '$8.75' },
      { name: 'Kids Rib', price: '$8.75' },
      { name: 'Kids Chicken Strips', price: '$8.75' },
    ],
  },
  {
    name: 'Desserts',
    description: 'The sweet finish',
    items: [
      { name: 'Chocolate Cake', price: '$4.50' },
      { name: 'Pecan Pie', price: '$4.50' },
      { name: 'Peach or Apple Cobbler', price: '$4.50' },
      { name: 'Banana Pudding', price: '$4.50' },
    ],
  },
];

const CATERING_PACKAGES = [
  {
    name: 'Down Home',
    description: '2 meats, 2 veggies, tea',
    price: '$17.95/person',
  },
  {
    name: 'Chuck Wagon',
    description: '2 meats, 3 veggies, tea',
    price: '$18.95/person',
  },
  {
    name: 'The Works',
    description: '3 meats, 3 veggies, tea',
    price: '$19.95/person',
  },
];

const TESTIMONIALS = [
  {
    text: "We have been going to Colter's since the early 80s when it was called Luther's.",
    author: 'Lisa McCuistion',
    stars: 5,
  },
  {
    text: "Been eating at Colters since pretty much day one. When the family asks for BBQ THIS is the place we head out the door to. Makes ya feel like you're sittin on the back porch at grammaw's house.",
    author: 'Ed M.',
    stars: 5,
  },
  {
    text: "I had tried other bar b q places in TX and by far this is the best place ever. I'm out here for a conference, I live in Philadelphia PA, and this is the best place in TX!",
    author: 'Jose L.',
    stars: 5,
  },
];

const LOCATIONS = [
  {
    name: 'South Arlington',
    address: '4435 Little Rd, Arlington, TX 76016',
    phone: '817-572-3930',
    mapQuery: '4435+Little+Rd+Arlington+TX+76016',
  },
  {
    name: 'South Dallas',
    address: '3904 W Camp Wisdom Rd, Dallas, TX 75237',
    phone: '972-298-3335',
    mapQuery: '3904+W+Camp+Wisdom+Rd+Dallas+TX+75237',
  },
];

const HOURS = [
  { day: 'Mon – Thu', hours: '11:00 AM – 9:00 PM' },
  { day: 'Fri – Sat', hours: '11:00 AM – 10:00 PM' },
  { day: 'Sunday', hours: '11:00 AM – 9:00 PM' },
];

// ─── Helpers ─────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' },
  }),
};

const sectionFade = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

// ─── Component ───────────────────────────────────────────
export default function ColtersBBQ() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMenuCategory, setOpenMenuCategory] = useState<number | null>(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <style>{fontImport}{colors}{`
        * { font-family: 'DM Sans', sans-serif; }
        h1, h2, h3, .font-display { font-family: 'Playfair Display', serif; }
        html { scroll-behavior: smooth; }
        .texture-overlay {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>

      <div className="min-h-screen" style={{ background: 'var(--charcoal)', color: 'var(--cream)' }}>
        {/* ═══ NAVBAR ═══ */}
        <nav
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled ? 'py-2 shadow-2xl' : 'py-4'
          }`}
          style={{ background: scrolled ? 'rgba(26,23,20,0.97)' : 'transparent', backdropFilter: scrolled ? 'blur(12px)' : 'none' }}
        >
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <button onClick={() => scrollTo('home')} className="flex items-center gap-3 group">
              <img src={logo} alt="Colter's Texas Bar-B-Q" className="h-12 w-auto" />
            </button>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase())}
                  className="text-sm font-medium tracking-wide uppercase transition-colors hover:text-[var(--amber)]"
                  style={{ color: 'var(--bone)' }}
                >
                  {item}
                </button>
              ))}
              <a
                href="https://www.order.store/store/colters-barbecue-and-grill/E2kqn6EfU2SVDoBNmeZ-xQ"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 text-sm font-semibold uppercase tracking-wider rounded transition-all hover:scale-105"
                style={{ background: 'var(--ember)', color: 'var(--cream)' }}
              >
                Order Online
              </a>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ color: 'var(--cream)' }}
            >
              {mobileMenuOpen ? <X size={28} /> : <MenuIcon size={28} />}
            </button>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden overflow-hidden"
                style={{ background: 'var(--charcoal)' }}
              >
                <div className="px-6 py-4 flex flex-col gap-4">
                  {NAV_ITEMS.map((item) => (
                    <button
                      key={item}
                      onClick={() => scrollTo(item.toLowerCase())}
                      className="text-left text-lg font-medium uppercase tracking-wide"
                      style={{ color: 'var(--bone)' }}
                    >
                      {item}
                    </button>
                  ))}
                  <a
                    href="https://www.order.store/store/colters-barbecue-and-grill/E2kqn6EfU2SVDoBNmeZ-xQ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 text-center text-sm font-semibold uppercase tracking-wider rounded"
                    style={{ background: 'var(--ember)', color: 'var(--cream)' }}
                  >
                    Order Online
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* ═══ HERO ═══ */}
        <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0">
            <img
              src="https://coltersbbq.com/wp-content/uploads/2014/01/ribs960.jpg"
              alt="Slow-smoked BBQ ribs"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(to bottom, rgba(26,23,20,0.7) 0%, rgba(26,23,20,0.4) 40%, rgba(26,23,20,0.85) 100%)'
            }} />
          </div>

          {/* Texture */}
          <div className="absolute inset-0 texture-overlay" />

          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <img src={logo} alt="Colter's Texas Bar-B-Q" className="h-28 md:h-40 w-auto mx-auto mb-8" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-lg md:text-xl font-light tracking-widest uppercase mb-4"
              style={{ color: 'var(--amber)', fontFamily: "'DM Sans', sans-serif" }}
            >
              Slow-Smoked Since the 1980s
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-6"
            >
              Real Texas BBQ.{' '}
              <span style={{ color: 'var(--ember)' }}>Real Good.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-lg md:text-xl font-light max-w-2xl mx-auto mb-10"
              style={{ color: 'var(--bone)' }}
            >
              Two Dallas-area locations serving up hand-rubbed, pit-smoked meats with
              homestyle sides — just like grandma used to make.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a
                href="https://www.order.store/store/colters-barbecue-and-grill/E2kqn6EfU2SVDoBNmeZ-xQ"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 text-sm font-bold uppercase tracking-widest rounded transition-all hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
                style={{ background: 'var(--ember)', color: 'var(--cream)' }}
              >
                <Flame size={18} /> Order Now
              </a>
              <button
                onClick={() => scrollTo('menu')}
                className="px-8 py-4 text-sm font-bold uppercase tracking-widest rounded border-2 transition-all hover:scale-105"
                style={{ borderColor: 'var(--amber)', color: 'var(--amber)' }}
              >
                View Menu
              </button>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ChevronDown size={28} style={{ color: 'var(--ash)' }} />
          </motion.div>
        </section>

        {/* ═══ STATS BAR ═══ */}
        <section style={{ background: 'var(--smoke)' }} className="border-t border-b" css={{ borderColor: 'var(--leather)' }}>
          <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center" style={{ borderColor: 'rgba(61,52,41,0.5)' }}>
            {[
              { value: '40+', label: 'Years Smoking', icon: Flame },
              { value: '2', label: 'DFW Locations', icon: MapPin },
              { value: '5★', label: 'Reviews', icon: Star },
              { value: '1000s', label: 'Events Catered', icon: Users },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="flex flex-col items-center gap-2"
              >
                <stat.icon size={22} style={{ color: 'var(--amber)' }} />
                <span className="text-3xl md:text-4xl font-black" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--cream)' }}>
                  {stat.value}
                </span>
                <span className="text-xs uppercase tracking-widest font-medium" style={{ color: 'var(--ash)' }}>
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══ ABOUT / FEATURED ═══ */}
        <section id="about" className="py-24 texture-overlay" style={{ background: 'var(--charcoal)' }}>
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              variants={sectionFade}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.3em] font-semibold mb-4" style={{ color: 'var(--amber)' }}>
                  Our Story
                </p>
                <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
                  A Dallas Tradition{' '}
                  <span style={{ color: 'var(--ember)' }}>Since the '80s</span>
                </h2>
                <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--bone)' }}>
                  What started as Luther's back in the early '80s has grown into a
                  Dallas-Fort Worth staple. Now known as Colter's Texas Bar-B-Q, we've
                  been serving the same slow-smoked, pit-fired meats that keep families
                  coming back generation after generation.
                </p>
                <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--bone)' }}>
                  Every cut is hand-rubbed with our signature seasoning and smoked low
                  and slow over real wood. Pair it with our homestyle sides — made fresh
                  daily — and you've got a meal that makes you feel like you're sitting
                  on the back porch at grandma's house.
                </p>
                <div className="flex gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-black" style={{ color: 'var(--amber)', fontFamily: "'Playfair Display', serif" }}>100%</div>
                    <div className="text-xs uppercase tracking-widest mt-1" style={{ color: 'var(--ash)' }}>Real Wood Smoked</div>
                  </div>
                  <div className="w-px" style={{ background: 'var(--leather)' }} />
                  <div className="text-center">
                    <div className="text-2xl font-black" style={{ color: 'var(--amber)', fontFamily: "'Playfair Display', serif" }}>Fresh</div>
                    <div className="text-xs uppercase tracking-widest mt-1" style={{ color: 'var(--ash)' }}>Sides Made Daily</div>
                  </div>
                  <div className="w-px" style={{ background: 'var(--leather)' }} />
                  <div className="text-center">
                    <div className="text-2xl font-black" style={{ color: 'var(--amber)', fontFamily: "'Playfair Display', serif" }}>Family</div>
                    <div className="text-xs uppercase tracking-widest mt-1" style={{ color: 'var(--ash)' }}>Owned & Operated</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg overflow-hidden row-span-2">
                  <img
                    src="https://coltersbbq.com/wp-content/uploads/2014/01/sandwich960.jpg"
                    alt="Colter's BBQ sandwich piled high with smoked meat"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="rounded-lg overflow-hidden">
                  <img
                    src="https://coltersbbq.com/wp-content/uploads/2014/01/BakedPotato480x240.jpg"
                    alt="Famous stuffed baked potato"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="rounded-lg overflow-hidden">
                  <img
                    src="https://coltersbbq.com/wp-content/uploads/2014/01/veggies480240.jpg"
                    alt="Homestyle side items made fresh daily"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══ FEATURED HIGHLIGHTS ═══ */}
        <section style={{ background: 'var(--smoke)' }} className="py-20">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Flame,
                title: 'Famous Baked Potatoes',
                desc: 'These hot bakers are a meal in themselves — try one today with your choice of chopped meat!',
              },
              {
                icon: UtensilsCrossed,
                title: 'Homestyle Side Items',
                desc: 'Fresh sides made daily. Plenty of options to couple with your smoked Bar-B-Q. Did we mention cobbler counts as a veggie?',
              },
              {
                icon: Truck,
                title: 'We Cater Everything',
                desc: "One call does it all! From pickup to full-service on-site catering, we've got your next event covered.",
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="p-8 rounded-lg border transition-all hover:-translate-y-1"
                style={{ background: 'var(--charcoal)', borderColor: 'var(--leather)' }}
              >
                <card.icon size={28} style={{ color: 'var(--ember)' }} className="mb-4" />
                <h3 className="text-xl font-bold mb-3">{card.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--ash)' }}>{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══ PROMO BANNER ═══ */}
        <section className="py-6 text-center" style={{ background: 'var(--ember)' }}>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm md:text-base font-bold uppercase tracking-widest"
            style={{ color: 'var(--cream)' }}
          >
            🔥 Kids Eat Free Every Wednesday Night After 4 PM — Dine In Only 🔥
          </motion.p>
        </section>

        {/* ═══ MENU ═══ */}
        <section id="menu" className="py-24 texture-overlay" style={{ background: 'var(--charcoal)' }}>
          <div className="max-w-5xl mx-auto px-6">
            <motion.div
              variants={sectionFade}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <p className="text-xs uppercase tracking-[0.3em] font-semibold mb-4" style={{ color: 'var(--amber)' }}>
                What We're Smoking
              </p>
              <h2 className="text-3xl md:text-5xl font-black mb-4">
                The Menu
              </h2>
              <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--ash)' }}>
                Every meat hand-rubbed and slow-smoked over real wood. Sides made fresh daily from scratch.
              </p>
            </motion.div>

            {/* Accordion */}
            <div className="space-y-3">
              {MENU_CATEGORIES.map((cat, catIdx) => (
                <motion.div
                  key={cat.name}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={catIdx * 0.5}
                  className="rounded-lg border overflow-hidden"
                  style={{ borderColor: 'var(--leather)', background: 'var(--smoke)' }}
                >
                  <button
                    onClick={() => setOpenMenuCategory(openMenuCategory === catIdx ? null : catIdx)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left transition-colors hover:bg-[rgba(61,52,41,0.3)]"
                  >
                    <div>
                      <h3 className="text-lg font-bold">{cat.name}</h3>
                      <p className="text-xs mt-1" style={{ color: 'var(--ash)' }}>{cat.description}</p>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`transition-transform ${openMenuCategory === catIdx ? 'rotate-180' : ''}`}
                      style={{ color: 'var(--amber)' }}
                    />
                  </button>
                  <AnimatePresence>
                    {openMenuCategory === catIdx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 grid gap-2">
                          {cat.items.map((item) => (
                            <div
                              key={item.name}
                              className="flex justify-between items-baseline py-2 border-b last:border-0"
                              style={{ borderColor: 'rgba(61,52,41,0.5)' }}
                            >
                              <span className="text-sm font-medium" style={{ color: 'var(--bone)' }}>{item.name}</span>
                              <span className="text-sm font-bold ml-4 whitespace-nowrap" style={{ color: 'var(--amber)' }}>
                                {item.price}
                              </span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ TESTIMONIALS ═══ */}
        <section className="py-24" style={{ background: 'var(--smoke)' }}>
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              variants={sectionFade}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <p className="text-xs uppercase tracking-[0.3em] font-semibold mb-4" style={{ color: 'var(--amber)' }}>
                What Folks Say
              </p>
              <h2 className="text-3xl md:text-5xl font-black">
                Straight From <span style={{ color: 'var(--ember)' }}>Our Regulars</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {TESTIMONIALS.map((t, i) => (
                <motion.div
                  key={t.author}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="p-8 rounded-lg border relative"
                  style={{ background: 'var(--charcoal)', borderColor: 'var(--leather)' }}
                >
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.stars }).map((_, si) => (
                      <Star key={si} size={16} fill="var(--amber)" style={{ color: 'var(--amber)' }} />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed mb-6 italic" style={{ color: 'var(--bone)' }}>
                    "{t.text}"
                  </p>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--amber)' }}>
                    — {t.author}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ CATERING ═══ */}
        <section id="catering" className="py-24 texture-overlay" style={{ background: 'var(--charcoal)' }}>
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              variants={sectionFade}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <p className="text-xs uppercase tracking-[0.3em] font-semibold mb-4" style={{ color: 'var(--amber)' }}>
                Events & Catering
              </p>
              <h2 className="text-3xl md:text-5xl font-black mb-4">
                We Cater Every Event,{' '}
                <span style={{ color: 'var(--ember)' }}>Every Place, Every Time</span>
              </h2>
              <p className="text-base max-w-2xl mx-auto" style={{ color: 'var(--ash)' }}>
                From pickup orders to full-service on-site catering with setup, service, and cleanup —
                we're one of the most affordable caterers in the DFW Metroplex.
              </p>
            </motion.div>

            {/* Catering styles */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {[
                { icon: ChefHat, title: 'Pickup', desc: 'Call your order in and we\'ll have it fresh, hot, and ready for you.' },
                { icon: Truck, title: 'Delivery', desc: 'We deliver and set up your self-service buffet at any location.' },
                { icon: Users, title: 'Full Service', desc: 'We do everything — deliver, setup, serve, and clean up. 100 person minimum.' },
              ].map((style, i) => (
                <motion.div
                  key={style.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="text-center p-6"
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: 'var(--leather)' }}
                  >
                    <style.icon size={24} style={{ color: 'var(--amber)' }} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{style.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--ash)' }}>{style.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Buffet packages */}
            <div className="grid md:grid-cols-3 gap-6">
              {CATERING_PACKAGES.map((pkg, i) => (
                <motion.div
                  key={pkg.name}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className={`p-8 rounded-lg border text-center transition-all hover:-translate-y-1 ${
                    i === 2 ? 'ring-2' : ''
                  }`}
                  style={{
                    background: 'var(--smoke)',
                    borderColor: i === 2 ? 'var(--ember)' : 'var(--leather)',
                    ...(i === 2 ? { ringColor: 'var(--ember)' } : {}),
                  }}
                >
                  {i === 2 && (
                    <span
                      className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full mb-4"
                      style={{ background: 'var(--ember)', color: 'var(--cream)' }}
                    >
                      Most Popular
                    </span>
                  )}
                  <h3 className="text-2xl font-black mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {pkg.name}
                  </h3>
                  <p className="text-sm mb-6" style={{ color: 'var(--ash)' }}>{pkg.description}</p>
                  <p className="text-3xl font-black mb-1" style={{ color: 'var(--amber)', fontFamily: "'Playfair Display', serif" }}>
                    {pkg.price}
                  </p>
                  <p className="text-xs mb-6" style={{ color: 'var(--ash)' }}>15+ people minimum</p>
                  <a
                    href="tel:9722983335"
                    className="inline-block w-full px-6 py-3 text-sm font-bold uppercase tracking-wider rounded transition-all hover:scale-105"
                    style={{
                      background: i === 2 ? 'var(--ember)' : 'transparent',
                      color: i === 2 ? 'var(--cream)' : 'var(--amber)',
                      border: i === 2 ? 'none' : '2px solid var(--amber)',
                    }}
                  >
                    Call to Book
                  </a>
                </motion.div>
              ))}
            </div>

            <p className="text-center text-sm mt-8" style={{ color: 'var(--ash)' }}>
              Add ribs to any package: $7.95/person · Hot peach or apple cobbler: $2.00/person ·
              Box lunches also available from $12.00/person
            </p>
          </div>
        </section>

        {/* ═══ LOCATIONS ═══ */}
        <section id="locations" className="py-24" style={{ background: 'var(--smoke)' }}>
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              variants={sectionFade}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <p className="text-xs uppercase tracking-[0.3em] font-semibold mb-4" style={{ color: 'var(--amber)' }}>
                Find Us
              </p>
              <h2 className="text-3xl md:text-5xl font-black">
                Two <span style={{ color: 'var(--ember)' }}>DFW Locations</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {LOCATIONS.map((loc, i) => (
                <motion.div
                  key={loc.name}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="p-8 rounded-lg border"
                  style={{ background: 'var(--charcoal)', borderColor: 'var(--leather)' }}
                >
                  <h3 className="text-2xl font-black mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {loc.name}
                  </h3>
                  <div className="space-y-3 mb-6">
                    <a
                      href={`https://maps.google.com/?q=${loc.mapQuery}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm transition-colors hover:text-[var(--amber)]"
                      style={{ color: 'var(--bone)' }}
                    >
                      <MapPin size={16} style={{ color: 'var(--ember)' }} className="shrink-0" />
                      {loc.address}
                    </a>
                    <a
                      href={`tel:${loc.phone.replace(/-/g, '')}`}
                      className="flex items-center gap-3 text-sm transition-colors hover:text-[var(--amber)]"
                      style={{ color: 'var(--bone)' }}
                    >
                      <Phone size={16} style={{ color: 'var(--ember)' }} className="shrink-0" />
                      {loc.phone}
                    </a>
                  </div>

                  <div className="border-t pt-4" style={{ borderColor: 'var(--leather)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock size={14} style={{ color: 'var(--amber)' }} />
                      <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--amber)' }}>Hours</span>
                    </div>
                    {HOURS.map((h) => (
                      <div key={h.day} className="flex justify-between text-sm py-1" style={{ color: 'var(--bone)' }}>
                        <span>{h.day}</span>
                        <span style={{ color: 'var(--ash)' }}>{h.hours}</span>
                      </div>
                    ))}
                  </div>

                  {loc.name === 'South Dallas' && (
                    <div className="mt-4 p-3 rounded text-center" style={{ background: 'rgba(196,57,28,0.15)' }}>
                      <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--ember)' }}>
                        🔥 Now Hiring All Positions!
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Order online CTA */}
            <motion.div
              variants={sectionFade}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center p-10 rounded-lg border"
              style={{ background: 'var(--charcoal)', borderColor: 'var(--leather)' }}
            >
              <h3 className="text-2xl font-black mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                Order Online — Dallas Location
              </h3>
              <p className="text-sm mb-6" style={{ color: 'var(--ash)' }}>
                Skip the line and get your favorites delivered via Uber Eats.
              </p>
              <a
                href="https://www.order.store/store/colters-barbecue-and-grill/E2kqn6EfU2SVDoBNmeZ-xQ"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 text-sm font-bold uppercase tracking-widest rounded transition-all hover:scale-105"
                style={{ background: 'var(--ember)', color: 'var(--cream)' }}
              >
                <ExternalLink size={16} /> Order on Uber Eats
              </a>
            </motion.div>
          </div>
        </section>

        {/* ═══ FINAL CTA ═══ */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://coltersbbq.com/wp-content/uploads/2014/01/chicken480240.jpg"
              alt="BBQ chicken on the grill"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(to right, rgba(26,23,20,0.92) 0%, rgba(26,23,20,0.8) 100%)'
            }} />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
            <motion.div
              variants={sectionFade}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-black mb-6">
                Come Hungry.{' '}
                <span style={{ color: 'var(--ember)' }}>Leave Happy.</span>
              </h2>
              <p className="text-lg mb-10" style={{ color: 'var(--bone)' }}>
                Whether you're feeding the family, hosting a party, or just craving
                real-deal Texas BBQ — Colter's has you covered.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://www.order.store/store/colters-barbecue-and-grill/E2kqn6EfU2SVDoBNmeZ-xQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 text-sm font-bold uppercase tracking-widest rounded transition-all hover:scale-105"
                  style={{ background: 'var(--ember)', color: 'var(--cream)' }}
                >
                  Order Online
                </a>
                <a
                  href="tel:9722983335"
                  className="px-8 py-4 text-sm font-bold uppercase tracking-widest rounded border-2 transition-all hover:scale-105"
                  style={{ borderColor: 'var(--amber)', color: 'var(--amber)' }}
                >
                  Call for Catering
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer className="border-t" style={{ background: 'var(--charcoal)', borderColor: 'var(--leather)' }}>
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="grid md:grid-cols-4 gap-12">
              {/* Brand */}
              <div className="md:col-span-1">
                <img src={logo} alt="Colter's Texas Bar-B-Q" className="h-16 w-auto mb-4" />
                <p className="text-sm leading-relaxed" style={{ color: 'var(--ash)' }}>
                  Real Texas BBQ since the 1980s. Two DFW locations serving slow-smoked
                  meats and homestyle sides.
                </p>
                <div className="flex gap-4 mt-6">
                  <a
                    href="http://facebook.com/coltersbbq"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-[var(--leather)]"
                    style={{ background: 'var(--smoke)' }}
                  >
                    <Facebook size={18} style={{ color: 'var(--bone)' }} />
                  </a>
                  <a
                    href="http://twitter.com/coltersbbq"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-[var(--leather)]"
                    style={{ background: 'var(--smoke)' }}
                  >
                    <Twitter size={18} style={{ color: 'var(--bone)' }} />
                  </a>
                </div>
              </div>

              {/* Quick links */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--amber)' }}>
                  Quick Links
                </h4>
                <div className="space-y-2">
                  {NAV_ITEMS.map((item) => (
                    <button
                      key={item}
                      onClick={() => scrollTo(item.toLowerCase())}
                      className="block text-sm transition-colors hover:text-[var(--amber)]"
                      style={{ color: 'var(--ash)' }}
                    >
                      {item}
                    </button>
                  ))}
                  <a
                    href="http://www.yelp.com/biz/colters-bbq-dallas"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm transition-colors hover:text-[var(--amber)]"
                    style={{ color: 'var(--ash)' }}
                  >
                    Yelp Reviews
                  </a>
                </div>
              </div>

              {/* Arlington */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--amber)' }}>
                  South Arlington
                </h4>
                <p className="text-sm mb-1" style={{ color: 'var(--bone)' }}>4435 Little Rd</p>
                <p className="text-sm mb-3" style={{ color: 'var(--bone)' }}>Arlington, TX 76016</p>
                <a href="tel:8175723930" className="text-sm font-semibold" style={{ color: 'var(--amber)' }}>
                  817-572-3930
                </a>
              </div>

              {/* Dallas */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--amber)' }}>
                  South Dallas
                </h4>
                <p className="text-sm mb-1" style={{ color: 'var(--bone)' }}>3904 W Camp Wisdom Rd</p>
                <p className="text-sm mb-3" style={{ color: 'var(--bone)' }}>Dallas, TX 75237</p>
                <a href="tel:9722983335" className="text-sm font-semibold" style={{ color: 'var(--amber)' }}>
                  972-298-3335
                </a>
              </div>
            </div>

            <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderColor: 'var(--leather)' }}>
              <p className="text-xs" style={{ color: 'var(--ash)' }}>
                © {new Date().getFullYear()} Colter's Texas Bar-B-Q. All rights reserved.
              </p>
              <p className="text-xs" style={{ color: 'var(--ash)' }}>
                Mon–Thu 11AM–9PM · Fri–Sat 11AM–10PM · Sun 11AM–9PM
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
