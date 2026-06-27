import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Eye, EyeOff, Sparkles, Star, Wine, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  signInWithPopup
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Field toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Process States
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Field Errors
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmError, setConfirmError] = useState(false);

  // Mouse parallax state
  const containerRef = useRef<HTMLDivElement>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Disable background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Parallax calculations
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const percentX = (x - centerX) / centerX;
    const percentY = (y - centerY) / centerY;
    setParallax({ x: percentX, y: percentY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setParallax({ x: 0, y: 0 });
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setEmailError(false);
    setPasswordError(false);

    let hasError = false;
    if (!email || !email.includes('@')) {
      setEmailError(true);
      hasError = true;
    }
    if (!password || password.length < 8) {
      setPasswordError(true);
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        // Reset states
        setEmail('');
        setPassword('');
        setSuccess(false);
        setLoading(false);
      }, 1000);
    } catch (error: any) {
      setLoading(false);
      console.error("Firebase Login Error:", error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setErrorMsg("Invalid email or password combination.");
      } else {
        setErrorMsg(error.message || "An unexpected error occurred during login.");
      }
    }
  };

  // Register handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setEmailError(false);
    setPasswordError(false);
    setConfirmError(false);

    let hasError = false;
    if (!email || !email.includes('@')) {
      setEmailError(true);
      hasError = true;
    }
    if (!password || password.length < 8) {
      setPasswordError(true);
      hasError = true;
    }
    if (password !== confirmPassword) {
      setConfirmError(true);
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: name || email.split('@')[0]
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
        // Reset states
        setEmail('');
        setPassword('');
        setName('');
        setConfirmPassword('');
        setSuccess(false);
        setLoading(false);
      }, 1000);
    } catch (error: any) {
      setLoading(false);
      console.error("Firebase Registration Error:", error);
      if (error.code === 'auth/email-already-in-use') {
        setErrorMsg("This email address is already registered.");
      } else {
        setErrorMsg(error.message || "An error occurred during account creation.");
      }
    }
  };

  // Google social login
  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    try {
      await signInWithPopup(auth, googleProvider);
      onClose();
    } catch (error: any) {
      console.error("Google login failed:", error);
      if (error.code !== 'auth/popup-closed-by-user') {
        setErrorMsg("Failed to sign in with Google. Please try again.");
      }
    }
  };

  // Custom animations definitions
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.05
      }
    },
    exit: { 
      opacity: 0, 
      y: 20,
      transition: { duration: 0.4, ease: "easeIn" }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-8">
      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-[1280px] bg-surface-container-lowest rounded-2xl shadow-[0_12px_50px_rgba(0,0,0,0.25)] flex flex-col md:flex-row overflow-hidden relative min-h-[720px] border border-outline-variant/30"
      >
        
        {/* ============ FORM SECTION ============ */}
        <section className="w-full md:w-1/2 p-6 md:p-12 flex flex-col relative z-10 bg-surface-container-lowest panel-transition order-2 md:order-1 min-h-[500px] md:min-h-full">
          
          <header className="flex justify-between items-center w-full mb-8 md:mb-16 mt-2 md:mt-0">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>
              <span className="font-display text-2xl font-bold text-on-surface uppercase tracking-wider">RASTURA</span>
            </div>
            
            {/* Elegant Close Modal Button */}
            <button 
              onClick={onClose}
              className="p-2 text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-container rounded-full"
              title="Close Page"
            >
              <X size={20} />
            </button>
          </header>

          <AnimatePresence mode="wait">
            {!isRegistering ? (
              /* ===== LOGIN VIEW ===== */
              <motion.div 
                key="login"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="flex-grow flex flex-col justify-center max-w-md mx-auto w-full"
              >
                <div className="text-center mb-8">
                  <h1 className="font-display text-4xl text-on-surface mb-2 uppercase tracking-tight">Welcome Back</h1>
                  <p className="font-body text-xs text-on-surface-variant">Enter your credentials to secure your woodfire dining bookings.</p>
                </div>

                {errorMsg && (
                  <div className="mb-6 p-3 bg-error-container/50 border border-error/30 text-error rounded-lg flex items-start gap-2.5 text-xs animate-shake">
                    <AlertCircle size={15} className="shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form className="space-y-5" onSubmit={handleLogin} noValidate>
                  <div>
                    <label className="block font-body font-bold text-[10px] text-on-surface mb-1.5 uppercase tracking-widest" htmlFor="email">Email</label>
                    <input 
                      className={`w-full h-11 px-4 rounded-lg bg-surface-container-low border ${emailError ? 'border-error ring-1 ring-error' : 'border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary'} outline-none modern-input font-body text-xs text-on-surface transition-all duration-300`} 
                      id="email" 
                      placeholder="guest@example.com" 
                      type="email" 
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError(false);
                      }}
                      required 
                    />
                    {emailError && (
                      <div className="text-error text-[10px] mt-1.5 flex items-center gap-1 font-body">
                        <AlertCircle size={11} /> Please enter a valid email address.
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-body font-bold text-[10px] text-on-surface mb-1.5 uppercase tracking-widest" htmlFor="password">Password</label>
                    <div className="relative">
                      <input 
                        className={`w-full h-11 px-4 rounded-lg bg-surface-container-low border ${passwordError ? 'border-error ring-1 ring-error' : 'border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary'} outline-none modern-input font-body text-xs text-on-surface pr-10 transition-all duration-300`} 
                        id="password" 
                        placeholder="••••••••" 
                        type={showPassword ? "text" : "password"} 
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (passwordError) setPasswordError(false);
                        }}
                        required 
                      />
                      <button 
                        type="button" 
                        aria-label="Toggle password visibility" 
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors p-1.5"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {passwordError && (
                      <div className="text-error text-[10px] mt-1.5 flex items-center gap-1 font-body">
                        <AlertCircle size={11} /> Password must be at least 8 characters.
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer group p-1 -ml-1">
                      <input 
                        className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 transition-colors cursor-pointer" 
                        type="checkbox" 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <span className="font-body text-xs text-on-surface-variant group-hover:text-on-surface transition-colors">Remember Me</span>
                    </label>
                    <button 
                      type="button"
                      className="font-body font-bold text-xs text-primary hover:text-primary-dark transition-colors p-1 -mr-1 uppercase tracking-wider"
                      onClick={() => setErrorMsg("Reset link simulated. Please contact restaurant administration if assistance is required.")}
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <div>
                    <button 
                      className="w-full h-11 bg-primary hover:bg-primary-dark text-on-primary font-display text-sm uppercase tracking-widest rounded-lg transition-all shadow-[0_4px_14px_0_rgba(179,31,8,0.3)] hover:shadow-[0_6px_20px_rgba(179,31,8,0.2)] hover:-translate-y-0.5 transform duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80" 
                      id="login-btn" 
                      type="submit"
                      disabled={loading}
                    >
                      {!loading && !success && <span>Sign In</span>}
                      {loading && <Loader2 className="animate-spin" size={16} />}
                      {success && (
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 size={16} className="text-white" />
                          <span>Success</span>
                        </div>
                      )}
                    </button>
                  </div>

                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-outline-variant"></div>
                    <span className="flex-shrink-0 mx-4 font-body text-xs text-on-surface-variant">Or Sign In With</span>
                    <div className="flex-grow border-t border-outline-variant"></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      className="flex items-center justify-center gap-2 h-11 rounded-lg bg-surface-bright border border-outline-variant hover:bg-surface-container hover:border-primary/30 transition-colors cursor-pointer" 
                      type="button"
                      onClick={handleGoogleLogin}
                    >
                      <img alt="Google Logo" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCg18K0CgfEjxndU5PhdUJDCfZqu9h3frjdJRt7VwuLxqQzISIDET0KVG-6olMb-ARzumfEHe50gWazzjyizc7TQxGx4EjvF3NA0CGuklyfwcUY5glPXQqikFj7w1rt9HrthTJLUEMVLaMgOvwaaf42ckCID2g_JXu61S2P1rS5GV9Zro-_jLAz4CLQ5Zpg969cAlNlfuRCbAiTZ2NRF2wYidEWYHNXn7R-Q3hAhfeBTCzgdCkeoT6Y-7VMaQvO00u1OLGGF7MnX24" />
                      <span className="font-body font-bold text-xs text-on-surface uppercase tracking-wider">Google</span>
                    </button>
                    <button 
                      className="flex items-center justify-center gap-2 h-11 rounded-lg bg-surface-bright border border-outline-variant hover:bg-surface-container hover:border-primary/30 transition-colors cursor-pointer" 
                      type="button"
                      onClick={() => setErrorMsg("Apple authentication requires full production container hosting. Please use Google or Email login.")}
                    >
                      <span className="material-symbols-outlined text-[20px] text-on-surface" style={{ fontVariationSettings: "'FILL' 1" }}>apps</span>
                      <span className="font-body font-bold text-xs text-on-surface uppercase tracking-wider">Apple</span>
                    </button>
                  </div>
                </form>

                <div className="mt-8 text-center pb-8 md:pb-0">
                  <p className="font-body text-xs text-on-surface-variant">
                    Don't Have An Account?{' '}
                    <button 
                      className="text-primary font-bold hover:underline transition-colors p-2 uppercase tracking-wide text-xs" 
                      onClick={() => {
                        setIsRegistering(true);
                        setErrorMsg(null);
                      }}
                    >
                      Register Now
                    </button>
                  </p>
                </div>
              </motion.div>
            ) : (
              /* ===== REGISTER VIEW ===== */
              <motion.div 
                key="register"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="flex-grow flex flex-col justify-center max-w-md mx-auto w-full"
              >
                <div className="text-center mb-6">
                  <h1 className="font-display text-4xl text-on-surface mb-2 uppercase tracking-tight">Create Account</h1>
                  <p className="font-body text-xs text-on-surface-variant">Join Rastura to secure and customize your bookings.</p>
                </div>

                {errorMsg && (
                  <div className="mb-4 p-3 bg-error-container/50 border border-error/30 text-error rounded-lg flex items-start gap-2.5 text-xs animate-shake">
                    <AlertCircle size={15} className="shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form className="space-y-4" onSubmit={handleRegister} noValidate>
                  <div>
                    <label className="block font-body font-bold text-[10px] text-on-surface mb-1 uppercase tracking-widest" htmlFor="reg-name">Full Name</label>
                    <input 
                      className="w-full h-11 px-4 rounded-lg bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none modern-input font-body text-xs text-on-surface transition-all duration-300" 
                      id="reg-name" 
                      placeholder="John Doe" 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required 
                    />
                  </div>

                  <div>
                    <label className="block font-body font-bold text-[10px] text-on-surface mb-1 uppercase tracking-widest" htmlFor="reg-email">Email Address</label>
                    <input 
                      className={`w-full h-11 px-4 rounded-lg bg-surface-container-low border ${emailError ? 'border-error ring-1 ring-error' : 'border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary'} outline-none modern-input font-body text-xs text-on-surface transition-all duration-300`} 
                      id="reg-email" 
                      placeholder="john@example.com" 
                      type="email" 
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError(false);
                      }}
                      required 
                    />
                    {emailError && (
                      <div className="text-error text-[10px] mt-1 flex items-center gap-1 font-body">
                        <AlertCircle size={11} /> Please enter a valid email address.
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-body font-bold text-[10px] text-on-surface mb-1 uppercase tracking-widest" htmlFor="reg-password">Password</label>
                    <div className="relative">
                      <input 
                        className={`w-full h-11 px-4 rounded-lg bg-surface-container-low border ${passwordError ? 'border-error ring-1 ring-error' : 'border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary'} outline-none modern-input font-body text-xs text-on-surface pr-10 transition-all duration-300`} 
                        id="reg-password" 
                        placeholder="••••••••" 
                        type={showRegPassword ? "text" : "password"} 
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (passwordError) setPasswordError(false);
                        }}
                        required 
                      />
                      <button 
                        type="button" 
                        aria-label="Toggle password visibility" 
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors p-1.5"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                      >
                        {showRegPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {passwordError && (
                      <div className="text-error text-[10px] mt-1 flex items-center gap-1 font-body">
                        <AlertCircle size={11} /> Password must be at least 8 characters.
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-body font-bold text-[10px] text-on-surface mb-1 uppercase tracking-widest" htmlFor="reg-confirm">Confirm Password</label>
                    <div className="relative">
                      <input 
                        className={`w-full h-11 px-4 rounded-lg bg-surface-container-low border ${confirmError ? 'border-error ring-1 ring-error' : 'border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary'} outline-none modern-input font-body text-xs text-on-surface pr-10 transition-all duration-300`} 
                        id="reg-confirm" 
                        placeholder="••••••••" 
                        type={showConfirmPassword ? "text" : "password"} 
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (confirmError) setConfirmError(false);
                        }}
                        required 
                      />
                      <button 
                        type="button" 
                        aria-label="Toggle password visibility" 
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors p-1.5"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {confirmError && (
                      <div className="text-error text-[10px] mt-1 flex items-center gap-1 font-body">
                        <AlertCircle size={11} /> Passwords do not match.
                      </div>
                    )}
                  </div>

                  <button 
                    className="w-full h-11 mt-4 bg-primary hover:bg-primary-dark text-on-primary font-display text-sm uppercase tracking-widest rounded-lg transition-all shadow-[0_4px_14px_0_rgba(179,31,8,0.3)] hover:shadow-[0_6px_20px_rgba(179,31,8,0.2)] hover:-translate-y-0.5 transform duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80" 
                    id="register-btn" 
                    type="submit"
                    disabled={loading}
                  >
                    {!loading && !success && <span>Sign Up</span>}
                    {loading && <Loader2 className="animate-spin" size={16} />}
                    {success && (
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 size={16} className="text-white" />
                        <span>Registered!</span>
                      </div>
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center pb-8 md:pb-0">
                  <p className="font-body text-xs text-on-surface-variant">
                    Already Have An Account?{' '}
                    <button 
                      className="text-primary font-bold hover:underline transition-colors p-2 uppercase tracking-wide text-xs" 
                      onClick={() => {
                        setIsRegistering(false);
                        setErrorMsg(null);
                      }}
                    >
                      Back to Login
                    </button>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <footer className="flex justify-between items-center w-full mt-auto pt-8 pb-4 hidden md:flex">
            <p className="font-body text-[11px] text-on-surface-variant/80">Copyright © 2025 Rastura Dining.</p>
            <a className="font-body text-[11px] text-on-surface-variant/80 hover:text-primary underline-offset-4 hover:underline transition-colors" href="#">Privacy Policy</a>
          </footer>
        </section>

        {/* ============ PROMO SECTION ============ */}
        <section 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          className="hidden md:flex w-full md:w-1/2 relative overflow-hidden bg-surface-container-high items-center justify-center min-h-[360px] md:min-h-full order-1 md:order-2 rounded-t-2xl md:rounded-none md:rounded-r-2xl border-l border-outline-variant/20"
        >
          {/* Background image cover with custom interactive scaling/parallax */}
          <div 
            style={{ 
              transform: isHovered 
                ? `scale(1.06) translate(${parallax.x * -12}px, ${parallax.y * -12}px)`
                : 'scale(1.04) translate(0px, 0px)',
              transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80')] will-change-transform"
          >
            <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px]"></div>
          </div>
          
          <div className="relative z-10 w-full max-w-lg flex flex-col h-full justify-center p-8 md:p-12 perspective-[1000px]">
            <div className="text-left mb-4 relative z-20 text-center md:text-left">
              <h2 className="font-display text-[44px] md:text-[56px] leading-[48px] md:leading-[60px] font-bold text-on-primary mb-4 text-shadow-sm uppercase tracking-tight">
                Experience Culinary Excellence.
              </h2>
              <p className="font-body text-sm text-on-primary/95 max-w-md mx-auto md:mx-0 leading-relaxed">
                Secure your hearth-side reservation and immerse your senses in absolute oak-combustion authority.
              </p>
            </div>
            
            <div className="relative w-full aspect-video mt-4 hidden md:block">
              {/* Card 1: Michelin Star Card */}
              <div 
                style={{
                  transform: isHovered
                    ? `translate3d(${parallax.x * 20}px, ${parallax.y * 20}px, 0) rotateX(${parallax.y * -6}deg) rotateY(${parallax.x * 6}deg)`
                    : 'translate3d(0,0,0) rotateX(0) rotateY(0)',
                  transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)'
                }}
                className="absolute top-6 right-8 w-44"
              >
                <div className="glass-card rounded-xl p-5 hover:scale-[1.03] transition-transform duration-300 text-center border-white/20 bg-black/40 backdrop-blur-md shadow-xl">
                  <Star className="text-primary mx-auto mb-2 fill-primary" size={24} />
                  <h3 className="font-display text-lg text-on-primary uppercase tracking-wider mb-0.5">Michelin</h3>
                  <p className="text-[10px] text-on-primary/80 font-body uppercase tracking-wider">Starred Authority</p>
                </div>
              </div>
              
              {/* Card 2: Wine Selection Card */}
              <div 
                style={{
                  transform: isHovered
                    ? `translate3d(${parallax.x * 32}px, ${parallax.y * 32}px, 0) rotateX(${parallax.y * -8}deg) rotateY(${parallax.x * 8}deg)`
                    : 'translate3d(0,0,0) rotateX(0) rotateY(0)',
                  transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)'
                }}
                className="absolute bottom-4 left-8 w-52"
              >
                <div className="glass-card rounded-xl p-5 hover:scale-[1.03] transition-transform duration-300 text-center border-white/20 bg-black/40 backdrop-blur-md shadow-xl">
                  <Wine className="text-primary mx-auto mb-2" size={24} />
                  <h3 className="font-display text-lg text-on-primary uppercase tracking-wider mb-0.5">Curated</h3>
                  <p className="text-[10px] text-on-primary/80 font-body uppercase tracking-wider">Wine & Cellar Stock</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </motion.main>
    </div>
  );
}
