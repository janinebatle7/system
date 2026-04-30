import React, { useState } from 'react';
import { 
  ShoppingCart, Calendar, Menu, X, Trash2, Plus, Minus, 
  Heart, Star, Clock, MapPin, 
  CheckCircle2, AlertCircle, ArrowRight, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types & Data ---
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: 'Baked' | 'Steamed' | 'Sticky Rice' | 'Beverage';
  rating: number;
  prepTime: string;
}

interface CartItem extends Product {
  quantity: number;
}

const PRODUCTS: Product[] = [
  { id: 1, name: 'Premium Bibingka', description: 'Traditionally baked in clay pots with salted egg and premium cheese.', price: 145, image_url: 'https://images.unsplash.com/photo-1621245033771-e14766e413ee?q=80&w=500', category: 'Baked', rating: 4.9, prepTime: '20 mins' },
  { id: 2, name: 'Puto Bumbong', description: 'Classic purple rice cake steamed in bamboo, topped with muscovado and coconut.', price: 95, image_url: 'https://images.unsplash.com/photo-1601050633722-6fb68202d090?q=80&w=500', category: 'Steamed', rating: 4.8, prepTime: '15 mins' },
  { id: 3, name: 'Rainbow Sapin-Sapin', description: 'Vibrant layers of glutinous rice, ube, and jackfruit flavors.', price: 160, image_url: 'https://images.unsplash.com/photo-1596797038530-2c39da82b641?q=80&w=500', category: 'Sticky Rice', rating: 4.7, prepTime: '10 mins' },
  { id: 4, name: 'Amber Kutsinta', description: 'Soft and chewy brown rice cake served with freshly grated coconut.', price: 75, image_url: 'https://images.unsplash.com/photo-1621245033771-e14766e413ee?q=80&w=500', category: 'Steamed', rating: 4.6, prepTime: '5 mins' },
  { id: 5, name: 'Special Cassava Cake', description: 'Creamy cassava base with a rich custard brûlée topping.', price: 195, image_url: 'https://images.unsplash.com/photo-1596797038530-2c39da82b641?q=80&w=500', category: 'Baked', rating: 4.9, prepTime: '30 mins' },
  { id: 6, name: 'Ube Kalamay', description: 'Sticky sweet treat made from ground rice and pure ube halaya.', price: 130, image_url: 'https://images.unsplash.com/photo-1601050633722-6fb68202d090?q=80&w=500', category: 'Sticky Rice', rating: 4.8, prepTime: '10 mins' },
];

export default function App() {
  const [view, setView] = useState<'home' | 'shop' | 'reserve' | 'login' | 'register' | 'checkout'>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<{id: number, text: string}[]>([]);

  const addNotification = (text: string) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, text }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 3000);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
    addNotification(`Added ${product.name} to cart!`);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 leaf-pattern -z-10" />

      {/* Navigation */}
      <nav className="sticky top-0 z-[100] bg-white/70 backdrop-blur-xl border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 cursor-pointer group" 
              onClick={() => setView('home')}
            >
              <div className="w-12 h-12 bg-[#D97706] rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-orange-900/20 group-hover:rotate-6 transition-transform">
                LB
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-[#4A3728]">Lutong <span className="text-[#D97706]">Bahay</span></h1>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 -mt-1">Kakanin Delights</p>
              </div>
            </motion.div>

            <div className="hidden md:flex items-center space-x-10">
              {['home', 'shop', 'reserve'].map((v) => (
                <button 
                  key={v}
                  onClick={() => setView(v as any)} 
                  className={`text-sm font-bold uppercase tracking-widest transition-colors relative ${view === v ? 'text-[#D97706]' : 'text-stone-500 hover:text-[#D97706]'}`}
                >
                  {v}
                  {view === v && <motion.div layoutId="nav-line" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#D97706]" />}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <div className="hidden sm:flex items-center gap-3 bg-stone-100 p-1.5 pr-4 rounded-full border border-stone-200">
                   <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#D97706] shadow-sm"><User size={18} /></div>
                   <span className="text-sm font-bold">{user.username}</span>
                </div>
              ) : (
                <button onClick={() => setView('login')} className="hidden sm:block text-sm font-bold text-[#D97706] hover:underline">Sign In</button>
              )}
              
              <button 
                onClick={() => setIsCartOpen(true)} 
                className="relative p-3 bg-white border border-stone-200 rounded-2xl shadow-sm hover:border-[#D97706] transition-all group"
              >
                <ShoppingCart size={22} className="text-stone-600 group-hover:text-[#D97706]" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#D97706] text-white text-[10px] w-6 h-6 flex items-center justify-center rounded-full border-2 border-white font-black shadow-md">
                    {cart.length}
                  </span>
                )}
              </button>
              
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2">
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-stone-200 overflow-hidden"
            >
              <div className="flex flex-col p-4 space-y-4">
                {['home', 'shop', 'reserve'].map((v) => (
                  <button 
                    key={v}
                    onClick={() => { setView(v as any); setIsMenuOpen(false); }} 
                    className={`text-left px-4 py-2 font-bold uppercase tracking-widest ${view === v ? 'text-[#D97706]' : 'text-stone-500'}`}
                  >
                    {v}
                  </button>
                ))}
                {!user && <button onClick={() => { setView('login'); setIsMenuOpen(false); }} className="text-left px-4 py-2 font-bold uppercase tracking-widest text-[#D97706]">Sign In</button>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <AnimatePresence mode="wait">
          {view === 'home' && <HomeView key="home" setView={setView} />}
          {view === 'shop' && <ShopView key="shop" products={PRODUCTS} addToCart={addToCart} />}
          {view === 'reserve' && <ReservationView key="reserve" user={user} setView={setView} />}
          {view === 'login' && <AuthView key="login" mode="login" setView={setView} setUser={setUser} />}
          {view === 'register' && <AuthView key="register" mode="register" setView={setView} setUser={setUser} />}
          {view === 'checkout' && <CheckoutView key="checkout" cart={cart} total={cartTotal} setView={setView} />}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-[#2D241E] text-stone-300 py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
             <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#D97706] rounded-xl flex items-center justify-center text-white font-bold text-xl">LB</div>
              <h2 className="text-2xl font-bold text-white">Lutong Bahay</h2>
            </div>
            <p className="max-w-md text-stone-400 leading-relaxed italic font-serif text-lg">"Preserving the sweet heritage of Filipino celebrations, one kakanin at a time."</p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-[#D97706] transition-colors cursor-pointer"><Star size={20} /></div>
              <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-[#D97706] transition-colors cursor-pointer"><Heart size={20} /></div>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Quick Links</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><button onClick={() => setView('shop')} className="hover:text-[#D97706] transition-colors">Our Menu</button></li>
              <li><button onClick={() => setView('reserve')} className="hover:text-[#D97706] transition-colors">Reservations</button></li>
              <li><button className="hover:text-[#D97706] transition-colors">Catering</button></li>
              <li><button className="hover:text-[#D97706] transition-colors">Locations</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Find Us</h4>
            <div className="space-y-4 text-sm text-stone-400">
              <p className="flex items-start gap-3"><MapPin size={18} className="text-[#D97706] shrink-0" /> 123 Culinary Heritage St., Intramuros, Manila, Philippines</p>
              <p className="flex items-center gap-3"><Clock size={18} className="text-[#D97706] shrink-0" /> Open Daily: 7:00 AM - 9:00 PM</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Notifications */}
      <div className="fixed bottom-8 left-8 z-[200] space-y-3 pointer-events-none">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div 
              key={n.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white border-l-4 border-[#D97706] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 pointer-events-auto min-w-[300px]"
            >
              <div className="w-8 h-8 bg-orange-100 text-[#D97706] rounded-full flex items-center justify-center">
                <CheckCircle2 size={18} />
              </div>
              <span className="font-bold text-sm">{n.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart} 
        setCart={setCart}
        total={cartTotal}
        setView={setView}
      />
    </div>
  );
}

// --- SUBVIEWS ---

function HomeView({ setView }: { setView: any }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="space-y-24 py-12"
    >
      <div className="flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-[#D97706] rounded-full font-black text-xs uppercase tracking-widest"
          >
            <Star size={14} fill="currentColor" /> Award Winning Heritage Recipes
          </motion.div>
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-6xl lg:text-8xl font-bold leading-[0.9] text-[#2D241E]"
          >
            Taste the <span className="text-[#D97706] italic">Soul</span> of the Philippines
          </motion.h2>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-stone-500 max-w-xl mx-auto lg:mx-0 leading-relaxed"
          >
            From the warmth of our clay pots to your table. Experience authentic, handmade kakanin made with love and tradition.
          </motion.p>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4"
          >
            <button onClick={() => setView('shop')} className="btn-primary group">
              Explore Menu <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => setView('reserve')} className="btn-secondary">
              Reserve a Table
            </button>
          </motion.div>
          
          <div className="flex items-center gap-8 justify-center lg:justify-start pt-8">
            <div><p className="text-3xl font-bold">15k+</p><p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Happy Clients</p></div>
            <div className="w-px h-10 bg-stone-200"></div>
            <div><p className="text-3xl font-bold">25+</p><p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Delicacies</p></div>
            <div className="w-px h-10 bg-stone-200"></div>
            <div><p className="text-3xl font-bold">100%</p><p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Handmade</p></div>
          </div>
        </div>
        
        <div className="flex-1 relative">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <img 
              src="https://images.unsplash.com/photo-1596797038530-2c39da82b641?q=80&w=800" 
              alt="Kakanin Plate" 
              className="rounded-[40px] shadow-2xl border-[16px] border-white"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-xl glass-card animate-float">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#D97706] rounded-full flex items-center justify-center text-white"><Heart fill="white" /></div>
                  <div>
                    <p className="text-sm font-black">Bibingka Special</p>
                    <p className="text-xs text-stone-400 font-bold">🔥 Most Ordered Today</p>
                  </div>
               </div>
            </div>
          </motion.div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-orange-200 rounded-full blur-[100px] opacity-30 -z-10" />
        </div>
      </div>
    </motion.div>
  );
}

function ShopView({ products, addToCart }: { products: Product[], addToCart: any }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Baked', 'Steamed', 'Sticky Rice'];

  const filtered = activeCategory === 'All' ? products : products.filter(p => p.category === activeCategory);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-12 py-12">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h2 className="text-5xl font-bold">Our Signature Menu</h2>
        <p className="text-stone-500">Discover our collection of heirloom recipes, each prepared daily with premium ingredients and traditional methods.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {categories.map(cat => (
          <button 
            key={cat} 
            onClick={() => setActiveCategory(cat)}
            className={`px-8 py-3 rounded-2xl font-bold text-sm transition-all ${activeCategory === cat ? 'bg-[#D97706] text-white shadow-lg' : 'bg-white text-stone-500 hover:bg-orange-50'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {filtered.map(product => (
            <motion.div 
              layout
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[32px] overflow-hidden group border border-stone-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
            >
              <div className="h-64 overflow-hidden relative">
                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                   <Star size={14} fill="#D97706" className="text-[#D97706]" />
                   <span className="text-xs font-black">{product.rating}</span>
                </div>
                <div className="absolute top-4 right-4 bg-orange-600 text-white px-4 py-2 rounded-2xl font-black shadow-lg">
                   ₱{product.price}
                </div>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <div className="mb-4">
                  <span className="text-[10px] uppercase tracking-widest font-black text-[#D97706] bg-orange-50 px-3 py-1 rounded-full">{product.category}</span>
                  <h3 className="text-2xl font-bold mt-3 group-hover:text-[#D97706] transition-colors">{product.name}</h3>
                </div>
                <p className="text-stone-500 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">{product.description}</p>
                <div className="flex items-center gap-4 mb-6 text-xs font-bold text-stone-400">
                   <span className="flex items-center gap-1.5"><Clock size={14} /> {product.prepTime}</span>
                   <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
                   <span>Handmade</span>
                </div>
                <button 
                  onClick={() => addToCart(product)}
                  className="w-full btn-primary py-4 rounded-2xl"
                >
                  <Plus size={20} /> Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function AuthView({ mode, setView, setUser }: any) {
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setUser({ username: 'Juan Dela Cruz', email: 'juan@example.com' });
    setView('home');
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto py-20">
      <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-stone-100">
        <div className="text-center mb-10">
           <div className="w-16 h-16 bg-orange-100 text-[#D97706] rounded-3xl flex items-center justify-center mx-auto mb-6">
              <User size={32} />
           </div>
           <h2 className="text-3xl font-bold mb-2">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
           <p className="text-stone-400 font-medium">Enjoy exclusive deals and faster ordering</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'register' && (
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-widest text-stone-500 ml-1">Full Name</label>
              <input type="text" className="input-field" placeholder="Juana Dela Cruz" required />
            </div>
          )}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-widest text-stone-500 ml-1">Email</label>
            <input type="email" className="input-field" placeholder="your@email.com" required />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-widest text-stone-500 ml-1">Password</label>
            <input type="password" className="input-field" placeholder="••••••••" required />
          </div>
          <button type="submit" className="w-full btn-primary py-4 mt-4 shadow-orange-900/10">
            {mode === 'login' ? 'Login to Account' : 'Register Now'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-bold">
          {mode === 'login' ? (
            <p className="text-stone-400">New here? <button onClick={() => setView('register')} className="text-[#D97706] hover:underline">Create an account</button></p>
          ) : (
            <p className="text-stone-400">Already have an account? <button onClick={() => setView('login')} className="text-[#D97706] hover:underline">Login here</button></p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ReservationView({ user, setView }: any) {
  if (!user) {
    return (
      <div className="text-center py-32 bg-white rounded-[40px] border border-stone-100 shadow-sm max-w-2xl mx-auto space-y-8">
        <div className="w-24 h-24 bg-orange-50 text-[#D97706] rounded-full flex items-center justify-center mx-auto">
          <Calendar size={48} strokeWidth={1.5} />
        </div>
        <div className="space-y-3">
          <h2 className="text-4xl font-bold">Reservation Required</h2>
          <p className="text-stone-500 max-w-xs mx-auto">Please sign in to book your table or manage your existing reservations.</p>
        </div>
        <button onClick={() => setView('login')} className="btn-primary px-12 mx-auto">Sign In to Reserve</button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto py-12">
      <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row">
        <div className="flex-1 p-12 bg-stone-900 text-white space-y-8">
           <h2 className="text-4xl font-bold leading-tight">Host Your <span className="text-[#D97706]">Celebrations</span> With Us</h2>
           <p className="text-stone-400 leading-relaxed">Whether it's a family reunion or a casual afternoon treat, we provide the perfect ambiance and authentic kakanin for your special moments.</p>
           <div className="space-y-4 pt-4">
             <div className="flex gap-4">
               <div className="w-10 h-10 bg-[#D97706]/20 text-[#D97706] rounded-xl flex items-center justify-center shrink-0"><MapPin size={20} /></div>
               <div><p className="font-bold">Exclusive Area</p><p className="text-sm text-stone-500">Private booths available</p></div>
             </div>
             <div className="flex gap-4">
               <div className="w-10 h-10 bg-[#D97706]/20 text-[#D97706] rounded-xl flex items-center justify-center shrink-0"><Calendar size={20} /></div>
               <div><p className="font-bold">Instant Booking</p><p className="text-sm text-stone-500">Real-time table availability</p></div>
             </div>
           </div>
        </div>
        <div className="flex-[1.5] p-12 space-y-8">
           <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-stone-500 ml-1">Date</label>
                <input type="date" className="input-field" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-stone-500 ml-1">Time</label>
                <select className="input-field">
                  {['10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-stone-500 ml-1">Guests</label>
                <select className="input-field">
                  {[1,2,3,4,5,6,8,10].map(n => <option key={n}>{n} {n === 1 ? 'Person' : 'People'}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-stone-500 ml-1">Occasion</label>
                <select className="input-field">
                  <option>Casual Dining</option>
                  <option>Birthday</option>
                  <option>Anniversary</option>
                  <option>Business Meeting</option>
                </select>
              </div>
              <div className="col-span-2 space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-stone-500 ml-1">Special Requests</label>
                <textarea className="input-field h-24" placeholder="Any allergies or special arrangements?"></textarea>
              </div>
           </div>
           <button className="w-full btn-primary py-4" onClick={() => { alert('Reservation Confirmed!'); setView('home'); }}>
             Confirm Booking
           </button>
        </div>
      </div>
    </motion.div>
  );
}

function CartDrawer({ isOpen, onClose, cart, setCart, total, setView }: any) {
  const updateQty = (id: number, delta: number) => {
    setCart((prev: any) => prev.map((item: any) => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[200]" />
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[210] shadow-2xl flex flex-col"
          >
            <div className="p-8 border-b border-stone-100 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Your Selection</h2>
                <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">{cart.length} items added</p>
              </div>
              <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-stone-100 flex items-center justify-center transition-colors"><X size={24} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                   <div className="w-24 h-24 bg-stone-50 text-stone-200 rounded-full flex items-center justify-center"><ShoppingCart size={48} /></div>
                   <div className="space-y-2">
                     <p className="text-xl font-bold">Your cart is empty</p>
                     <p className="text-stone-400 text-sm">Add some delicious kakanin to get started!</p>
                   </div>
                   <button onClick={() => { onClose(); setView('shop'); }} className="btn-secondary px-8">Browse Menu</button>
                </div>
              ) : (
                <div className="space-y-8">
                  {cart.map((item: any) => (
                    <div key={item.id} className="flex gap-6 group">
                      <div className="w-24 h-24 rounded-[20px] overflow-hidden shrink-0 border border-stone-100 shadow-sm">
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex-1 space-y-3">
                         <div className="flex justify-between items-start">
                           <h4 className="font-bold leading-tight">{item.name}</h4>
                           <button onClick={() => setCart((c: any) => c.filter((i: any) => i.id !== item.id))} className="text-stone-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                         </div>
                         <div className="flex items-center justify-between">
                            <p className="text-[#D97706] font-black">₱{item.price}</p>
                            <div className="flex items-center gap-4 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-100">
                               <button onClick={() => updateQty(item.id, -1)} className="text-stone-400 hover:text-[#D97706]"><Minus size={14} /></button>
                               <span className="font-bold text-sm min-w-[20px] text-center">{item.quantity}</span>
                               <button onClick={() => updateQty(item.id, 1)} className="text-stone-400 hover:text-[#D97706]"><Plus size={14} /></button>
                            </div>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-8 bg-stone-50 border-t border-stone-100 space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-stone-400 font-bold text-sm"><span>Subtotal</span><span>₱{total.toFixed(2)}</span></div>
                  <div className="flex justify-between text-stone-400 font-bold text-sm"><span>Delivery</span><span>FREE</span></div>
                  <div className="flex justify-between text-2xl font-bold pt-2 border-t border-stone-200"><span>Total</span><span className="text-[#D97706]">₱{total.toFixed(2)}</span></div>
                </div>
                <button 
                  onClick={() => { onClose(); setView('checkout'); }}
                  className="w-full btn-primary py-5 text-lg shadow-orange-900/10"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function CheckoutView({ cart, total, setView }: any) {
  const [step, setStep] = useState(1);

  if (cart.length === 0) {
    return <div className="text-center py-40 space-y-6">
      <h2 className="text-3xl font-bold">Your cart is empty</h2>
      <button onClick={() => setView('shop')} className="btn-primary mx-auto">Back to Menu</button>
    </div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto py-12">
      <div className="flex justify-center mb-16">
        <div className="flex items-center gap-4">
          {[1, 2, 3].map(s => (
            <React.Fragment key={s}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= s ? 'bg-[#D97706] text-white' : 'bg-stone-200 text-stone-400'}`}>
                {step > s ? <CheckCircle2 size={20} /> : s}
              </div>
              {s < 3 && <div className={`w-20 h-1 rounded-full ${step > s ? 'bg-[#D97706]' : 'bg-stone-200'}`} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-[1.5] space-y-8">
           {step === 1 && (
             <div className="space-y-8">
               <h3 className="text-3xl font-bold">Delivery Details</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-1.5"><label className="text-xs font-black uppercase tracking-widest text-stone-500 ml-1">Phone Number</label><input type="tel" className="input-field" placeholder="09XX-XXX-XXXX" /></div>
                 <div className="space-y-1.5"><label className="text-xs font-black uppercase tracking-widest text-stone-500 ml-1">Delivery Time</label><select className="input-field"><option>As soon as possible</option><option>Scheduled</option></select></div>
                 <div className="col-span-2 space-y-1.5"><label className="text-xs font-black uppercase tracking-widest text-stone-500 ml-1">Address</label><textarea className="input-field h-24" placeholder="House/Bldg No., Street, Brgy, City"></textarea></div>
               </div>
             </div>
           )}
           
           {step === 2 && (
             <div className="space-y-8">
               <h3 className="text-3xl font-bold">Payment Method</h3>
               <div className="grid grid-cols-1 gap-4">
                 {['GCash', 'Cash on Delivery', 'Credit/Debit Card'].map(m => (
                   <label key={m} className="p-6 border-2 border-stone-100 rounded-3xl flex items-center justify-between cursor-pointer hover:border-[#D97706] transition-colors group">
                     <span className="font-bold group-hover:text-[#D97706]">{m}</span>
                     <input type="radio" name="payment" className="w-5 h-5 accent-[#D97706]" />
                   </label>
                 ))}
               </div>
             </div>
           )}

           {step === 3 && (
             <div className="text-center py-12 space-y-6">
               <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto"><CheckCircle2 size={40} /></div>
               <div className="space-y-2">
                 <h3 className="text-3xl font-bold">Ready to order?</h3>
                 <p className="text-stone-500">Please review your order summary on the right.</p>
               </div>
             </div>
           )}

           <div className="flex justify-between pt-8 border-t border-stone-100">
             {step > 1 ? <button onClick={() => setStep(step - 1)} className="btn-secondary">Go Back</button> : <div />}
             <button 
              onClick={() => step < 3 ? setStep(step + 1) : (alert('Order Placed! Reference: LB-' + Math.floor(Math.random()*100000)), setView('home'))} 
              className="btn-primary px-12"
             >
               {step === 3 ? 'Place Order' : 'Continue'}
             </button>
           </div>
        </div>

        <div className="flex-1">
          <div className="bg-white p-8 rounded-[32px] shadow-xl border border-stone-100 sticky top-32">
            <h4 className="text-xl font-bold mb-6">Order Summary</h4>
            <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2">
               {cart.map((item: any) => (
                 <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-stone-500"><span className="font-black text-[#D97706]">{item.quantity}x</span> {item.name}</span>
                    <span className="font-bold">₱{(item.price * item.quantity).toFixed(2)}</span>
                 </div>
               ))}
            </div>
            <div className="space-y-3 pt-6 border-t border-stone-100">
              <div className="flex justify-between text-stone-400 font-bold text-xs uppercase tracking-widest"><span>Subtotal</span><span>₱{total.toFixed(2)}</span></div>
              <div className="flex justify-between text-stone-400 font-bold text-xs uppercase tracking-widest"><span>Delivery</span><span>FREE</span></div>
              <div className="flex justify-between text-2xl font-bold pt-4 text-[#2D241E]"><span>Total</span><span>₱{total.toFixed(2)}</span></div>
            </div>
            <div className="mt-8 bg-orange-50 p-4 rounded-2xl flex gap-3">
               <AlertCircle className="text-[#D97706] shrink-0" size={20} />
               <p className="text-[10px] font-bold text-[#D97706] uppercase tracking-wider leading-relaxed">Orders placed now will be delivered within 45-60 minutes depending on your location.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
