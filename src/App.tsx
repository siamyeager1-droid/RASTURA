import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Phone, 
  Sparkles, 
  Menu, 
  X, 
  Check, 
  Eye, 
  ChevronRight, 
  Utensils, 
  Award, 
  Flame, 
  ShieldCheck, 
  Heart,
  Instagram,
  Facebook,
  Compass,
  LogIn,
  LogOut,
  User as UserIcon,
  CloudLightning
} from 'lucide-react';
import { MenuItem, Reservation } from './types';
import { INITIAL_REVIEWS } from './data';
import MenuSection from './components/MenuSection';
import ItemModal from './components/ItemModal';
import ReservationForm from './components/ReservationForm';
import BookingsDrawer from './components/BookingsDrawer';
import AuthModal from './components/AuthModal';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { auth, db, googleProvider, signInWithPopup, signOut } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, doc, setDoc, getDocs, query, where, updateDoc } from 'firebase/firestore';

export default function App() {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isBookingsOpen, setIsBookingsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dine' | 'manager'>('dine');

  // Shared menu filter states to react when clicking nav items like "Drinks" or "Menu"
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'appetizer' | 'main' | 'drinks'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);

  // Sommelier recommendations active toggle
  const [sommelierActive, setSommelierActive] = useState(true);

  // Live wood-fire hearth temperature simulation
  const [hearthTemp, setHearthTemp] = useState(850.4);

  useEffect(() => {
    const interval = setInterval(() => {
      setHearthTemp(prev => {
        const change = (Math.random() - 0.5) * 1.6;
        const next = prev + change;
        if (next < 846.0) return 846.0;
        if (next > 855.0) return 855.0;
        return parseFloat(next.toFixed(1));
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Parallax scroll effects using motion/react
  const { scrollY } = useScroll();
  const yHeroBg = useTransform(scrollY, [0, 800], [0, 180]);
  const yHeroText = useTransform(scrollY, [0, 800], [0, 60]);
  const yHeroImage = useTransform(scrollY, [0, 800], [0, -80]);
  const yStoryBg = useTransform(scrollY, [200, 1500], [-40, 40]);

  // Firebase Auth user state
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Load and manage reservations (local with fallback, synced with Firestore if user logged in)
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // Monitor auth state and fetch/sync reservations
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoadingUser(false);

      if (currentUser) {
        // Authenticated - fetch from Firestore
        try {
          const q = query(
            collection(db, 'reservations'),
            where('userId', '==', currentUser.uid)
          );
          const querySnapshot = await getDocs(q);
          const cloudRes: Reservation[] = [];
          
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            cloudRes.push({
              id: doc.id,
              userId: data.userId,
              name: data.name,
              email: data.email,
              phone: data.phone,
              date: data.date,
              time: data.time,
              guests: data.guests,
              notes: data.notes,
              seatingPreference: data.seatingPreference,
              status: data.status,
              createdAt: data.createdAt
            } as Reservation);
          });

          // Sync local storage unsynced reservations if any
          const savedLocal = localStorage.getItem('rastura_reservations');
          if (savedLocal) {
            try {
              const localList: Reservation[] = JSON.parse(savedLocal);
              const unsynced = localList.filter(l => !l.userId && l.id !== 'res-sim-1');
              
              if (unsynced.length > 0) {
                const batchPromises = unsynced.map(async (res) => {
                  const docRef = doc(db, 'reservations', res.id);
                  const syncedRes = { ...res, userId: currentUser.uid };
                  await setDoc(docRef, syncedRes);
                  cloudRes.push(syncedRes);
                });
                await Promise.all(batchPromises);
                // Clear local unsynced cache once done
                localStorage.removeItem('rastura_reservations');
              }
            } catch (e) {
              console.error("Local sync error:", e);
            }
          }

          // Sort descending by date/time or creation
          cloudRes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setReservations(cloudRes);
        } catch (error) {
          console.error("Error retrieving Cloud reservations:", error);
        }
      } else {
        // Not authenticated - fallback to local storage
        const saved = localStorage.getItem('rastura_reservations');
        if (saved) {
          try {
            setReservations(JSON.parse(saved));
          } catch (e) {
            console.error(e);
          }
        } else {
          // Default mock reservation for offline/new visitors
          const tomorrowStr = new Date();
          tomorrowStr.setDate(tomorrowStr.getDate() + 1);
          const dateFormatted = tomorrowStr.toISOString().split('T')[0];
          const initialMock = [
            {
              id: 'res-sim-1',
              name: 'Evelyn Carter',
              email: 'evelyn@example.com',
              phone: '+1 (555) 019-2834',
              date: dateFormatted,
              time: '19:30',
              guests: '4',
              seatingPreference: 'chefs-counter',
              notes: 'Celebrating 10th anniversary. Prefers table close to the oak fire grill.',
              status: 'confirmed' as const,
              createdAt: new Date().toISOString()
            }
          ];
          setReservations(initialMock);
          localStorage.setItem('rastura_reservations', JSON.stringify(initialMock));
        }
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Handle Sign-In (opens the premium login & registration experience!)
  const handleSignIn = () => {
    setIsAuthModalOpen(true);
  };

  // Handle Sign-Out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setReservations([]);
    } catch (e) {
      console.error("Sign out failed:", e);
    }
  };

  // Handle adding a new reservation
  const handleAddReservation = async (newRes: Omit<Reservation, 'id' | 'status' | 'createdAt'>) => {
    const reservationId = `res-${Math.floor(100000 + Math.random() * 900000)}`;
    const reservation: Reservation = {
      ...newRes,
      id: reservationId,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      userId: user ? user.uid : undefined
    };

    if (user) {
      try {
        await setDoc(doc(db, 'reservations', reservationId), reservation);
        setReservations(prev => [reservation, ...prev]);
      } catch (e) {
        console.error("Firestore save error:", e);
        // Local fallback
        setReservations(prev => [reservation, ...prev]);
      }
    } else {
      setReservations(prev => {
        const updated = [reservation, ...prev];
        localStorage.setItem('rastura_reservations', JSON.stringify(updated));
        return updated;
      });
    }
  };

  // Handle cancelling a reservation
  const handleCancelReservation = async (id: string) => {
    if (user) {
      try {
        await updateDoc(doc(db, 'reservations', id), { status: 'cancelled' });
        setReservations(prev => prev.map(res => 
          res.id === id ? { ...res, status: 'cancelled' as const } : res
        ));
      } catch (e) {
        console.error("Firestore cancel error:", e);
        // Local fallback
        setReservations(prev => prev.map(res => 
          res.id === id ? { ...res, status: 'cancelled' as const } : res
        ));
      }
    } else {
      setReservations(prev => {
        const updated = prev.map(res => 
          res.id === id ? { ...res, status: 'cancelled' as const } : res
        );
        localStorage.setItem('rastura_reservations', JSON.stringify(updated));
        return updated;
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background font-body selection:bg-primary selection:text-on-primary">
      {/* 1. Header & Navigation */}
      <header id="main-header" className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-outline/15 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#hero" id="brand-logo-link" className="flex items-center gap-2 group">
            <span className="font-display text-3xl uppercase tracking-tighter text-on-surface group-hover:text-primary transition-colors">
              RASTURA
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-label-bold uppercase tracking-widest text-on-surface">
            <a 
              href="#story" 
              className="hover:text-primary transition-colors py-2 relative group"
            >
              The Story
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a 
              href="#menu" 
              onClick={() => setSelectedCategory('all')}
              className={`hover:text-primary transition-colors py-2 relative group ${selectedCategory !== 'drinks' ? 'text-primary font-bold' : ''}`}
            >
              Menu
              <span className={`absolute bottom-0 left-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full ${selectedCategory !== 'drinks' ? 'w-full' : 'w-0'}`}></span>
            </a>
            <a 
              href="#menu" 
              onClick={() => setSelectedCategory('drinks')}
              className={`hover:text-primary transition-colors py-2 relative group ${selectedCategory === 'drinks' ? 'text-primary font-bold' : ''}`}
            >
              Drinks
              <span className={`absolute bottom-0 left-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full ${selectedCategory === 'drinks' ? 'w-full' : 'w-0'}`}></span>
            </a>
            <a 
              href="#team" 
              className="hover:text-primary transition-colors py-2 relative group"
            >
              Team
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button
              id="view-bookings-nav-btn"
              onClick={() => setIsBookingsOpen(true)}
              className="px-4 py-2 glass-button text-xs font-label-bold uppercase tracking-widest cursor-pointer flex items-center gap-2 rounded-lg"
            >
              <Calendar size={13} />
              My Bookings
              {reservations.filter(r => r.status === 'confirmed').length > 0 && (
                <span className="w-1.5 h-1.5 bg-primary rounded-full inline-block animate-ping"></span>
              )}
            </button>
            <a
              id="reserve-nav-btn"
              href="#reserve"
              className="px-5 py-2.5 bg-primary text-on-primary text-xs font-display uppercase tracking-widest font-semibold hover:bg-primary-dark transition-all duration-300 shadow-md hover:shadow-primary/20 mr-1 rounded-lg"
            >
              Book a Table
            </a>

            {/* Cloud Auth Synchronization Widget */}
            {user ? (
              <div className="flex items-center gap-3 border-l border-outline-variant/30 pl-4 py-1">
                <div className="flex items-center gap-2" title={user.email || 'Signed In'}>
                  <img 
                    src={user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'} 
                    alt={user.displayName || 'User'} 
                    className="w-8 h-8 rounded-full border border-primary/40 object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="hidden xl:flex flex-col text-left">
                    <span className="text-[10px] font-label-bold text-on-surface uppercase tracking-wider truncate max-w-[80px]">{user.displayName?.split(' ')[0]}</span>
                    <span className="text-[8px] text-primary font-mono uppercase tracking-widest flex items-center gap-0.5">
                      <CloudLightning size={8} className="animate-pulse" /> CLOUD ACTIVE
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="p-1.5 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                className="px-4 py-2 glass-button-primary text-xs font-label-bold uppercase tracking-widest cursor-pointer flex items-center gap-1.5 rounded-lg"
                title="Secure Google Sign-In"
              >
                <LogIn size={13} className="shrink-0" />
                <span>Sign In</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center gap-3">
            <button
              id="mobile-bookings-trigger-btn"
              onClick={() => setIsBookingsOpen(true)}
              className="p-2 bg-surface border border-outline-variant text-on-surface relative cursor-pointer"
              aria-label="My Bookings"
            >
              <Calendar size={18} />
              {reservations.filter(r => r.status === 'confirmed').length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full"></span>
              )}
            </button>

            <button
              id="mobile-menu-trigger-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 bg-inverse-surface text-background hover:bg-primary hover:text-on-primary transition-all cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div id="mobile-nav-panel" className="fixed inset-0 z-40 md:hidden bg-background animate-in fade-in duration-200">
          <div className="flex flex-col h-full pt-24 px-8 pb-10 justify-between">
            <nav className="flex flex-col gap-6 text-2xl font-display uppercase tracking-wider">
              <a 
                href="#story" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-primary transition-colors flex items-center justify-between border-b border-outline-variant/30 pb-2"
              >
                <span>Story</span>
                <ChevronRight size={18} className="text-primary" />
              </a>
              <a 
                href="#menu" 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setSelectedCategory('all');
                }}
                className="hover:text-primary transition-colors flex items-center justify-between border-b border-outline-variant/30 pb-2"
              >
                <span>Menu</span>
                <ChevronRight size={18} className="text-primary" />
              </a>
              <a 
                href="#menu" 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setSelectedCategory('drinks');
                }}
                className="hover:text-primary transition-colors flex items-center justify-between border-b border-outline-variant/30 pb-2"
              >
                <span>Drinks</span>
                <ChevronRight size={18} className="text-primary" />
              </a>
              <a 
                href="#team" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-primary transition-colors flex items-center justify-between border-b border-outline-variant/30 pb-2"
              >
                <span>Team</span>
                <ChevronRight size={18} className="text-primary" />
              </a>
              <a 
                href="#reserve" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-primary transition-colors flex items-center justify-between pb-2"
              >
                <span>Book Table</span>
                <ChevronRight size={18} className="text-primary" />
              </a>
            </nav>

            <div className="flex flex-col gap-4">
              {user ? (
                <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/10">
                  <div className="flex items-center gap-3">
                    <img 
                      src={user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'} 
                      alt={user.displayName || 'User'} 
                      className="w-10 h-10 rounded-full border border-primary/40 object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-label-bold text-on-surface uppercase tracking-wider">{user.displayName}</span>
                      <span className="text-[10px] text-primary font-mono uppercase tracking-widest flex items-center gap-0.5">
                        <CloudLightning size={10} className="animate-pulse" /> CLOUD STORAGE ACTIVE
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="p-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    handleSignIn();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-4 bg-primary/10 border border-primary/20 text-primary text-xs font-label-bold uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                >
                  <LogIn size={15} />
                  <span>Google Sign-In</span>
                </button>
              )}

              <button
                id="mobile-drawer-bookings-btn"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsBookingsOpen(true);
                }}
                className="w-full py-4 border border-outline text-center text-xs font-label-bold uppercase tracking-widest text-on-surface cursor-pointer"
              >
                My Table Bookings ({reservations.filter(r => r.status === 'confirmed').length})
              </button>
              <a
                id="mobile-drawer-reserve-btn"
                href="#reserve"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-4 bg-primary text-on-primary text-center font-display text-xs uppercase tracking-widest font-bold"
              >
                Reserve Table Now
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 2. Hero Section */}
      <section id="hero" className="relative bg-surface py-12 lg:py-24 overflow-hidden border-b border-outline-variant">
        {/* Background Subtle Grid Accents with parallax */}
        <motion.div 
          style={{ y: yHeroBg }}
          className="absolute inset-0 bg-[linear-gradient(to_right,#efeded_1px,transparent_1px),linear-gradient(to_bottom,#efeded_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none"
        ></motion.div>
        
        {/* Decorative Vertical Rail with parallax */}
        <motion.div 
          style={{ y: yHeroText }}
          className="hidden xl:flex absolute left-8 top-1/3 flex-col items-center gap-6 pointer-events-none select-none"
        >
          <span className="vertical-rail font-display text-[10px] uppercase tracking-widest text-secondary/40">HEARTH-SEARED AUTHORITY</span>
          <div className="w-[1px] h-24 bg-outline-variant"></div>
          <Flame size={14} className="text-primary/30" />
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-6 flex flex-col gap-8"
          >
            <div className="flex flex-col gap-3">
              <span className="text-primary font-display uppercase tracking-widest text-xs sm:text-sm flex items-center gap-2">
                <Flame size={16} className="animate-pulse" />
                EST. 2018 — CULINARY AUTHORITY
              </span>
              <h1 className="font-display text-6xl sm:text-8xl uppercase tracking-tighter text-on-surface leading-tight">
                RASTURA
              </h1>
              <p className="font-display text-2xl sm:text-3xl uppercase tracking-wide text-primary/95">
                Where Taste Meets Elegance
              </p>
            </div>

            <p className="font-body text-sm sm:text-base text-on-surface-variant leading-relaxed max-w-xl">
              Immerse yourself in a narrative of bold flavors, luxury design, and modern craftsmanship. We cook over open oak fires with precision to produce a gastronomic narrative that respects both raw elements and culinary heritage.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <a
                id="hero-book-btn"
                href="#reserve"
                className="px-8 py-4 bg-primary text-on-primary text-xs font-display uppercase tracking-widest font-bold text-center hover:bg-primary-dark transition-all duration-300 shadow-md hover:shadow-primary/20"
              >
                Secure Table Reservation
              </a>
              <a
                id="hero-call-btn"
                href="tel:+15550192834"
                className="px-6 py-4 border border-outline/30 text-on-surface text-xs font-label-bold uppercase tracking-widest text-center hover:border-primary hover:text-primary transition-all duration-300 flex items-center justify-center gap-2.5 bg-background"
              >
                <Phone size={14} />
                +1 (555) 019-2834
              </a>
            </div>

            {/* Live Hearth Temperature Widget */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex items-center gap-4 bg-inverse-surface text-background p-4 border border-primary/20 max-w-md relative overflow-hidden shadow-lg group"
            >
              <div className="absolute right-0 top-0 translate-x-2 -translate-y-2 w-16 h-16 bg-primary/15 rounded-full blur-xl group-hover:bg-primary/25 transition-all duration-700"></div>
              <div className="w-10 h-10 bg-primary/10 flex items-center justify-center border border-primary/30 relative shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping bg-primary/20 opacity-75"></span>
                <Flame className="text-primary animate-pulse" size={20} />
              </div>
              <div className="flex flex-col flex-grow min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[9px] font-label-bold uppercase tracking-widest text-primary font-bold">OAKWOOD HEARTH STATUS</span>
                  <span className="flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="text-[8px] font-mono tracking-wider text-emerald-500 font-bold uppercase">LIVE FEED</span>
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="font-display text-2xl tracking-tight text-white font-bold">{hearthTemp}°F</span>
                  <span className="text-[10px] text-surface-container-highest/60 font-body truncate">Active Oak Fire Combustion</span>
                </div>
              </div>
            </motion.div>

            {/* Micro Diner Social Proof (Reviews badge) */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-surface-container/60 p-4 border border-outline-variant/60 max-w-md"
            >
              <div className="flex -space-x-3 overflow-hidden shrink-0">
                {INITIAL_REVIEWS.map(rev => (
                  <img
                    key={rev.id}
                    src={rev.avatar}
                    alt={rev.name}
                    referrerPolicy="no-referrer"
                    className="inline-block h-8 w-8 rounded-none ring-2 ring-background object-cover"
                  />
                ))}
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex gap-0.5 text-primary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-sm">★</span>
                  ))}
                </div>
                <span className="text-[10px] font-label-bold text-on-surface uppercase tracking-wider">
                  Approved by 1,200+ Discerning Diners
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Right Content (Platter Image with Parallax scroll) */}
          <motion.div 
            style={{ y: yHeroImage }}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, ease: "easeOut", delay: 0.15 }}
            className="lg:col-span-6 relative mt-8 lg:mt-0"
          >
            <div className="relative border-4 border-on-surface shadow-2xl overflow-hidden aspect-4/3 bg-surface-container">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80"
                alt="Signature Plated Dish"
                className="w-full h-full object-cover grayscale-10 hover:grayscale-0 transition-all duration-700"
              />
              {/* Accompanying Floating Badge */}
              <div className="absolute bottom-5 left-5 bg-background border border-outline p-4 shadow-xl max-w-xs flex items-start gap-3">
                <Award className="text-primary shrink-0 mt-0.5" size={20} />
                <div className="flex flex-col">
                  <span className="font-display text-xs uppercase tracking-wider text-on-surface">Signature Wood-Fired Cut</span>
                  <span className="font-body text-[10px] text-on-surface-variant mt-0.5">Seared on premium local white oak logs</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Our Story Section */}
      <section id="story" className="py-20 bg-surface-container-low border-b border-outline-variant overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Story Left Image (Grayscale to Color on Hover, sliding in from left) */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-5 order-2 lg:order-1"
          >
            <div className="group relative border-2 border-outline/30 overflow-hidden aspect-1/1 shadow-xl cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
                alt="Rastura Dining Room Interior"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out transform group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-primary/10 opacity-30 group-hover:opacity-0 transition-opacity duration-500"></div>
              <div className="absolute bottom-4 right-4 bg-background px-3 py-1 text-[10px] font-label-bold uppercase tracking-widest text-on-surface border border-outline">
                Saloon Interior
              </div>
            </div>
          </motion.div>

          {/* Story Right Text Block (sliding in from right) */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 order-1 lg:order-2 flex flex-col gap-6"
          >
            <span className="text-primary font-display uppercase tracking-widest text-xs">Our Heritage</span>
            <h2 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-on-surface">
              A Symphony of Oak Fire &amp; Modern Contrast
            </h2>
            <p className="font-body text-sm sm:text-base text-on-surface-variant leading-relaxed">
              Established in the heart of the city's historic warehouse district in 2018, Rastura is a testament to the pursuit of culinary authenticity. We rejected standard contemporary gas grills and returned entirely to raw, dynamic combustion. 
            </p>
            <p className="font-body text-sm sm:text-base text-on-surface-variant leading-relaxed">
              Our hearth is fueled with cured white oak and fruitwoods, reaching cooking temperatures in excess of 850°F. This deliberate return to fire yields a distinct char and sweet smoke note that cannot be duplicated. Paired with a meticulously minimalist room design of custom-poured concrete and welded heavy plates, Rastura is where absolute raw nature meets architectural precision.
            </p>

            <div className="grid grid-cols-3 gap-6 border-t border-outline-variant pt-6 mt-4">
              <div className="flex flex-col">
                <span className="font-display text-3xl text-primary">850°F</span>
                <span className="text-[10px] uppercase font-label-bold text-secondary mt-1 tracking-wider">Combustion Temperature</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-3xl text-primary">100%</span>
                <span className="text-[10px] uppercase font-label-bold text-secondary mt-1 tracking-wider">Hardwood Cured Logs</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-3xl text-primary">365+</span>
                <span className="text-[10px] uppercase font-label-bold text-secondary mt-1 tracking-wider">Days Aged Cellar Stock</span>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 4. Our Values Section (Bento Style Cards) */}
      <section id="values" className="py-20 bg-surface border-b border-outline-variant">
        <div className="max-w-7xl mx-auto px-6 flex flex-col gap-12">
          
          <div className="text-center max-w-xl mx-auto flex flex-col gap-3">
            <span className="text-primary font-display uppercase tracking-widest text-xs">Our Pillars</span>
            <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-tight text-on-surface">
              The Rastura Ideals
            </h2>
            <p className="font-body text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              We operate under a strict code of precision and hospitality, ensuring that every element—from custom metal tables to the selection of sea salt—is deliberate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Value 1: Precision */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0 }}
              className="bg-surface-container border border-outline/20 p-8 flex flex-col gap-4 shadow-sm hover:border-primary transition-all duration-300"
            >
              <div className="w-10 h-10 bg-primary/10 flex items-center justify-center text-primary">
                <Utensils size={20} />
              </div>
              <h3 className="font-display text-xl uppercase tracking-tight text-on-surface">Precision</h3>
              <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                From micro-sliced Wagyu carpaccio to the exact temperature curve of our aging cabinets, we believe gastronomy is a science of fractions. Every millimeter counts.
              </p>
            </motion.div>

            {/* Value 2: Integrity */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="bg-surface-container border border-outline/20 p-8 flex flex-col gap-4 shadow-sm hover:border-primary transition-all duration-300"
            >
              <div className="w-10 h-10 bg-primary/10 flex items-center justify-center text-primary">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-display text-xl uppercase tracking-tight text-on-surface">Integrity</h3>
              <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                We work directly with small-herd ranchers and local, sustainable growers. We serve only what is genuine, fresh, and harvested within our strict quality standards.
              </p>
            </motion.div>

            {/* Value 3: Hospitality */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-surface-container border border-outline/20 p-8 flex flex-col gap-4 shadow-sm hover:border-primary transition-all duration-300"
            >
              <div className="w-10 h-10 bg-primary/10 flex items-center justify-center text-primary">
                <Heart size={20} />
              </div>
              <h3 className="font-display text-xl uppercase tracking-tight text-on-surface">Hospitality</h3>
              <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                True luxury is never cold. We welcome our diners with an attentive yet unpretentious style of care that anticipates your needs without invading your peace.
              </p>
            </motion.div>
          </div>

        </div>
      </section>

      {/* 5. Menu Section */}
      <section id="menu" className="py-20 bg-surface-container-low border-b border-outline-variant">
        <div className="max-w-7xl mx-auto px-6 flex flex-col gap-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-outline-variant pb-6">
            <div className="flex flex-col gap-3">
              <span className="text-primary font-display uppercase tracking-widest text-xs">The Culinary Sequence</span>
              <h2 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-on-surface">
                Seasonal Menu
              </h2>
            </div>
            <p className="font-body text-xs sm:text-sm text-on-surface-variant max-w-md leading-relaxed">
              Curated by Executive Chef Marcus Vance, our menu changes with local micro-seasons. Our current edition balances high-contrast winter greens with oak-fired prime proteins.
            </p>
          </div>

          {/* Interactive Menu Filtering & Grid */}
          <MenuSection 
            onItemSelect={(item) => setSelectedItem(item)} 
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedDiets={selectedDiets}
            setSelectedDiets={setSelectedDiets}
            sommelierActive={sommelierActive}
            setSommelierActive={setSommelierActive}
          />

        </div>
      </section>

      {/* 6. The Brigade Team Section */}
      <section id="team" className="py-20 bg-surface border-b border-outline-variant overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Team Left Text Block (sliding in from left) */}
          <motion.div 
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-6 flex flex-col gap-6"
          >
            <span className="text-primary font-display uppercase tracking-widest text-xs">The Culinary Brigade</span>
            <h2 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-on-surface">
              Led by Executive Chef Marcus Vance
            </h2>
            <p className="font-body text-sm sm:text-base text-on-surface-variant leading-relaxed">
              Marcus Vance believes that fire is a living element that must be studied and respected. Having spent years training under culinary masters in Tokyo, Paris, and San Sebastian, Marcus combined these global rigorous standards with the rusticity of wood-fired smoke to open Rastura.
            </p>
            <p className="font-body text-sm sm:text-base text-on-surface-variant leading-relaxed">
              His brigade of sous chefs and line stations operate with military cohesion. Every plate is double-inspected before leaving the pass, ensuring that taste and visual architecture are absolutely harmonious.
            </p>

            <div className="flex items-start gap-4 border-l-2 border-primary pl-4 py-1 italic bg-surface-container/50 p-4">
              <span className="text-primary font-display text-4xl leading-none">“</span>
              <p className="text-xs text-on-surface font-body leading-relaxed">
                Fire has no dial. It requires our presence, our absolute focus. We cannot hide behind gadgets; our eyes, our hands, and our noses are the only instruments that matter. That is true craftsmanship.
              </p>
            </div>
          </motion.div>

          {/* Team Right Image (sliding in from right) */}
          <motion.div 
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-6"
          >
            <div className="relative border-4 border-on-surface shadow-2xl overflow-hidden aspect-4/5 bg-surface-container">
              <img
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80"
                alt="Executive Chef Marcus Vance in Kitchen"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute top-5 left-5 bg-background border border-outline py-2.5 px-4">
                <span className="font-display text-[10px] uppercase tracking-widest text-primary">Marcus Vance</span>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 7. Reviews Carousel Section */}
      <section id="reviews" className="py-20 bg-surface-container-low border-b border-outline-variant">
        <div className="max-w-7xl mx-auto px-6 flex flex-col gap-12">
          <div className="text-center flex flex-col gap-2">
            <span className="text-primary font-display uppercase tracking-widest text-xs">Critic &amp; Diner Consensus</span>
            <h2 className="font-display text-3xl uppercase tracking-tight text-on-surface">The Verdicts</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {INITIAL_REVIEWS.map(rev => (
              <div key={rev.id} className="bg-surface border border-outline-variant p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-sm">
                <div className="flex flex-col gap-4">
                  <div className="flex gap-0.5 text-primary">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <span key={i} className="text-sm">★</span>
                    ))}
                  </div>
                  <p className="font-body text-xs text-on-surface-variant leading-relaxed italic">
                    "{rev.text}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-outline-variant/40">
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    referrerPolicy="no-referrer"
                    className="h-9 w-9 rounded-none object-cover border border-outline/30"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-label-bold text-on-surface uppercase tracking-wide">{rev.name}</span>
                    <span className="text-[9px] text-secondary font-mono mt-0.5">{rev.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Reservations Section (Form & Booking Table) */}
      <section id="reserve" className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Reservation Left Description */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <span className="text-primary font-display uppercase tracking-widest text-xs">Reserve Table</span>
            <h2 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-on-surface">
              Secure Your Placement
            </h2>
            <p className="font-body text-sm sm:text-base text-on-surface-variant leading-relaxed">
              We allocate approximately 65% of our salon seating to online bookings, leaving the remainder available for walk-ins on a first-come, first-served schedule. 
            </p>
            <p className="font-body text-sm text-on-surface-variant leading-relaxed">
              Should your desired date be unavailable online, or if you are coordinating a large private event (+12), please contact our reservation desk directly at <a href="tel:+15550192834" className="text-primary font-semibold hover:underline">+1 (555) 019-2834</a>.
            </p>

            <div className="bg-surface-container border border-outline-variant p-6 flex flex-col gap-4 mt-4">
              <h4 className="font-display text-lg uppercase text-on-surface flex items-center gap-2">
                <Compass size={18} className="text-primary" />
                Diner Standards
              </h4>
              <ul className="flex flex-col gap-2.5 text-xs text-on-surface-variant font-body">
                <li className="flex items-start gap-2">
                  <Check size={12} className="text-primary mt-0.5 shrink-0" />
                  <span><strong>Dress Code:</strong> Smart Casual (No beach attire, please).</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={12} className="text-primary mt-0.5 shrink-0" />
                  <span><strong>Grace Period:</strong> Tables held for exactly 15 minutes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={12} className="text-primary mt-0.5 shrink-0" />
                  <span><strong>Cancellations:</strong> Please cancel at least 4 hours in advance.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Reservation Form Component */}
          <div className="lg:col-span-7">
            <ReservationForm 
              onAddReservation={handleAddReservation} 
              user={user}
              onSignIn={handleSignIn}
            />
          </div>

        </div>
      </section>

      {/* 9. Footer */}
      <footer id="main-footer" className="bg-inverse-surface text-background border-t border-outline/20">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          
          {/* Footer Logo & Brand info */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <h3 className="font-display text-3xl uppercase tracking-tighter text-background">
              RASTURA
            </h3>
            <p className="font-body text-xs text-surface-container-highest max-w-sm leading-relaxed">
              Rastura combines bold open woodfire flavors with industrial raw materials to offer an elite culinary narrative. Experience taste crafted with precision.
            </p>
            <div className="flex gap-4 mt-2">
              <a href="#" className="p-2 bg-surface/10 hover:bg-primary hover:text-on-primary transition-colors text-surface-container-highest">
                <Instagram size={16} />
              </a>
              <a href="#" className="p-2 bg-surface/10 hover:bg-primary hover:text-on-primary transition-colors text-surface-container-highest">
                <Facebook size={16} />
              </a>
            </div>
          </div>

          {/* Footer Hours */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <h4 className="font-display text-xs uppercase tracking-widest text-primary font-bold">
              Hours of Combust
            </h4>
            <div className="flex flex-col gap-2 font-body text-xs text-surface-container-highest">
              <div className="flex justify-between border-b border-surface-container/10 pb-1.5">
                <span>Wednesday &ndash; Thursday:</span>
                <span className="font-semibold text-background">17:00 &ndash; 22:00</span>
              </div>
              <div className="flex justify-between border-b border-surface-container/10 pb-1.5">
                <span>Friday &ndash; Saturday:</span>
                <span className="font-semibold text-background">17:00 &ndash; 23:00</span>
              </div>
              <div className="flex justify-between border-b border-surface-container/10 pb-1.5">
                <span>Sunday Brunch:</span>
                <span className="font-semibold text-background">11:00 &ndash; 15:00</span>
              </div>
              <div className="flex justify-between">
                <span>Monday &ndash; Tuesday:</span>
                <span className="font-semibold text-primary italic uppercase text-[10px]">Cured wood rests</span>
              </div>
            </div>
          </div>

          {/* Footer Location details */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <h4 className="font-display text-xs uppercase tracking-widest text-primary font-bold">
              Our Saloon Location
            </h4>
            <div className="flex flex-col gap-3 font-body text-xs text-surface-container-highest">
              <p className="leading-relaxed">
                982 Iron Foundry Alley, Suite 4A<br />
                Historic District, City Centre
              </p>
              <div className="flex flex-col gap-1.5">
                <span><strong>Desk:</strong> +1 (555) 019-2834</span>
                <span><strong>Concierge:</strong> concierge@rastura.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Copyright */}
        <div className="border-t border-surface-container/10">
          <div className="max-w-7xl mx-auto px-6 h-16 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-surface-container-highest/60 font-body">
            <span>&copy; {new Date().getFullYear()} RASTURA LLC. All Rights Reserved.</span>
            <div className="flex gap-4">
              <a href="#" className="hover:underline">Privacy Policy</a>
              <span>&bull;</span>
              <a href="#" className="hover:underline">Terms of Reservation</a>
            </div>
          </div>
        </div>
      </footer>

      {/* 10. Modals & Drawers */}
      <ItemModal 
        item={selectedItem} 
        onClose={() => setSelectedItem(null)} 
      />

      <BookingsDrawer
        isOpen={isBookingsOpen}
        onClose={() => setIsBookingsOpen(false)}
        reservations={reservations}
        onCancelReservation={handleCancelReservation}
        user={user}
        onSignIn={handleSignIn}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
