import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, MapPin, Sparkles, AlertCircle, ArrowRight, Lock, LogIn } from 'lucide-react';
import { Reservation } from '../types';

interface ReservationFormProps {
  onAddReservation: (reservation: Omit<Reservation, 'id' | 'status' | 'createdAt'>) => void;
  user: any;
  onSignIn: () => void;
}

export default function ReservationForm({ onAddReservation, user, onSignIn }: ReservationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '18:00',
    guests: '2',
    seatingPreference: 'main',
    notes: '',
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successReservation, setSuccessReservation] = useState<any | null>(null);

  // Auto-fill user profile info when they log in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.displayName || '',
        email: prev.email || user.email || '',
      }));
    }
  }, [user]);

  const seatingOptions = [
    { value: 'main', label: "Main Dining Hall (Industrial-Classic)" },
    { value: 'chefs-counter', label: "Chef's Counter (Oak Fire View)" },
    { value: 'patio', label: "The Conservatory (Glass Patio)" },
    { value: 'vault', label: "The Iron Vault (Private Lounge)" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // If somehow bypasses UI, intercept and request sign-in
    if (!user) {
      onSignIn();
      return;
    }

    const { name, email, phone, date, time, guests, seatingPreference } = formData;

    // Validation
    if (!name.trim()) return setFormError('Full Name is required');
    if (!email.trim() || !email.includes('@')) return setFormError('A valid email address is required');
    if (!phone.trim() || phone.trim().length < 7) return setFormError('A valid phone number is required');
    if (!date) return setFormError('Please select a reservation date');
    if (!time) return setFormError('Please select a reservation time');

    // Prevent past dates
    const selectedDate = new Date(`${date}T00:00:00`);
    const today = new Date();
    today.setHours(0,0,0,0);
    if (selectedDate < today) {
      return setFormError('Reservations cannot be made for past dates');
    }

    setIsSubmitting(true);

    // Simulate elite submission experience
    setTimeout(() => {
      onAddReservation({
        name,
        email,
        phone,
        date,
        time,
        guests,
        seatingPreference,
        notes: formData.notes
      });
      
      const randomTable = Math.floor(Math.random() * 24) + 1;
      setSuccessReservation({
        ...formData,
        table: randomTable,
        code: `RST-${Math.floor(1000 + Math.random() * 9000)}`
      });

      setFormData({
        name: user?.displayName || '',
        email: user?.email || '',
        phone: '',
        date: '',
        time: '18:00',
        guests: '2',
        seatingPreference: 'main',
        notes: '',
      });

      setIsSubmitting(false);
    }, 1200);
  };

  const handleCloseSuccess = () => {
    setSuccessReservation(null);
  };

  return (
    <div className="relative rounded-xl overflow-hidden">
      {/* 🔒 Glassmorphic Auth Blockade Overlay */}
      {!user && (
        <div className="absolute inset-0 z-20 backdrop-blur-[7px] bg-background/40 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
          <div className="glass-panel p-8 sm:p-10 max-w-md w-full border border-primary/20 shadow-2xl flex flex-col items-center gap-6 rounded-xl">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary animate-pulse-gentle">
              <Lock size={24} />
            </div>
            
            <div className="flex flex-col gap-2">
              <h3 className="font-display text-2xl uppercase tracking-tight text-on-surface">
                Exclusive Secure Booking
              </h3>
              <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                Rastura uses cloud auth to log and safeguard your bookings. To reserve a table, please sign in or create an account first.
              </p>
            </div>

            <button
              onClick={onSignIn}
              type="button"
              className="w-full py-3.5 glass-button-primary font-display uppercase tracking-widest text-xs font-semibold flex items-center justify-center gap-2 rounded-lg cursor-pointer"
            >
              <LogIn size={13} />
              <span>Sign In / Create Account</span>
            </button>
            
            <span className="text-[10px] text-secondary font-mono uppercase tracking-widest">
              ● Secure Firebase Auth Enabled
            </span>
          </div>
        </div>
      )}

      {successReservation ? (
        <div 
          id="reservation-success-card"
          className="glass-panel border border-primary/40 p-6 sm:p-10 text-center animate-in fade-in duration-300 shadow-xl rounded-xl"
        >
          <div className="mx-auto w-16 h-16 bg-primary/10 flex items-center justify-center text-primary mb-6 rounded-full">
            <Sparkles size={32} />
          </div>
          
          <h3 className="font-display text-3xl sm:text-4xl text-on-surface uppercase tracking-tight mb-2">
            Table Confirmed
          </h3>
          <p className="font-body text-sm text-on-surface-variant max-w-md mx-auto mb-6">
            Your table reservation has been securely logged into our brigade system. An elegant receipt has been dispatched to {successReservation.email}.
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto bg-white/40 backdrop-blur-sm border border-outline-variant p-5 text-left mb-8 rounded-lg">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase font-label-bold text-secondary tracking-wider">Reservation Code</span>
              <span className="font-display text-lg text-primary">{successReservation.code}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase font-label-bold text-secondary tracking-wider">Assigned Table</span>
              <span className="font-display text-lg text-on-surface">Table {successReservation.table}</span>
            </div>
            <div className="flex flex-col gap-0.5 border-t border-outline-variant/50 pt-2">
              <span className="text-[10px] uppercase font-label-bold text-secondary tracking-wider">Date & Time</span>
              <span className="font-body text-sm font-semibold text-on-surface">{successReservation.date} @ {successReservation.time}</span>
            </div>
            <div className="flex flex-col gap-0.5 border-t border-outline-variant/50 pt-2">
              <span className="text-[10px] uppercase font-label-bold text-secondary tracking-wider">Party Size</span>
              <span className="font-body text-sm font-semibold text-on-surface">{successReservation.guests} Diners</span>
            </div>
            <div className="col-span-2 flex flex-col gap-0.5 border-t border-outline-variant/50 pt-2">
              <span className="text-[10px] uppercase font-label-bold text-secondary tracking-wider">Saloon Location</span>
              <span className="font-body text-sm font-semibold text-on-surface">
                {seatingOptions.find(o => o.value === successReservation.seatingPreference)?.label || successReservation.seatingPreference}
              </span>
            </div>
          </div>

          <button
            id="book-another-btn"
            onClick={handleCloseSuccess}
            className="px-6 py-3.5 glass-button font-display uppercase tracking-widest text-xs rounded-lg font-semibold"
          >
            Create Another Reservation
          </button>
        </div>
      ) : (
        <form 
          id="table-booking-form"
          onSubmit={handleSubmit} 
          className="glass-panel border border-outline-variant/40 p-6 sm:p-10 shadow-lg flex flex-col gap-6 rounded-xl"
        >
          <div className="border-b border-outline-variant/40 pb-4">
            <h3 className="font-display text-2xl uppercase tracking-tight text-on-surface flex items-center gap-2">
              <span>Table Reservation</span>
              {user && (
                <span className="text-[10px] px-2.5 py-1 bg-emerald-500/10 text-emerald-600 rounded-full font-mono uppercase tracking-wider font-semibold">
                  Authenticated
                </span>
              )}
            </h3>
            <p className="font-body text-xs text-on-surface-variant">
              Please secure your date and salon location. For large groups (+12), call the restaurant directly.
            </p>
          </div>

          {formError && (
            <div className="flex items-center gap-2 bg-primary/10 border-l-4 border-primary p-3 text-sm text-primary rounded-r">
              <AlertCircle size={16} className="shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="fullname" className="text-[10px] font-label-bold uppercase text-on-surface tracking-wider">
                Full Name *
              </label>
              <input
                id="fullname"
                type="text"
                required
                placeholder="e.g. Evelyn Carter"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white/40 backdrop-blur-sm border border-outline-variant/40 text-on-surface font-body text-sm rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white transition-all duration-300 shadow-sm"
              />
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-[10px] font-label-bold uppercase text-on-surface tracking-wider">
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="e.g. evelyn@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-white/40 backdrop-blur-sm border border-outline-variant/40 text-on-surface font-body text-sm rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white transition-all duration-300 shadow-sm"
              />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className="text-[10px] font-label-bold uppercase text-on-surface tracking-wider">
                Phone Number *
              </label>
              <input
                id="phone"
                type="tel"
                required
                placeholder="e.g. +1 (555) 019-2834"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-white/40 backdrop-blur-sm border border-outline-variant/40 text-on-surface font-body text-sm rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white transition-all duration-300 shadow-sm"
              />
            </div>

            {/* Party Size */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="party-size" className="text-[10px] font-label-bold uppercase text-on-surface tracking-wider">
                Party Size *
              </label>
              <div className="relative">
                <Users className="absolute left-3.5 top-3 text-secondary" size={16} />
                <select
                  id="party-size"
                  value={formData.guests}
                  onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-white/40 backdrop-blur-sm border border-outline-variant/40 text-on-surface font-body text-sm rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white transition-all duration-300 appearance-none cursor-pointer shadow-sm"
                >
                  <option value="1">1 Diner</option>
                  <option value="2">2 Diners</option>
                  <option value="4">4 Diners</option>
                  <option value="6">6 Diners</option>
                  <option value="8">8 Diners</option>
                  <option value="10">10 Diners</option>
                  <option value="12">12 Diners (Private Seating)</option>
                </select>
              </div>
            </div>

            {/* Date */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="date" className="text-[10px] font-label-bold uppercase text-on-surface tracking-wider">
                Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-3 text-secondary" size={16} />
                <input
                  id="date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-white/40 backdrop-blur-sm border border-outline-variant/40 text-on-surface font-body text-sm rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white transition-all duration-300 shadow-sm"
                />
              </div>
            </div>

            {/* Preferred Time */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="time" className="text-[10px] font-label-bold uppercase text-on-surface tracking-wider">
                Preferred Time *
              </label>
              <div className="relative">
                <Clock className="absolute left-3.5 top-3 text-secondary" size={16} />
                <select
                  id="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-white/40 backdrop-blur-sm border border-outline-variant/40 text-on-surface font-body text-sm rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white transition-all duration-300 appearance-none cursor-pointer shadow-sm"
                >
                  <optgroup label="Early Seating">
                    <option value="17:00">17:00 (5:00 PM)</option>
                    <option value="17:30">17:30 (5:30 PM)</option>
                    <option value="18:00">18:00 (6:00 PM)</option>
                  </optgroup>
                  <optgroup label="Prime Seating">
                    <option value="18:30">18:30 (6:30 PM)</option>
                    <option value="19:00">19:00 (7:00 PM)</option>
                    <option value="19:30">19:30 (7:30 PM)</option>
                    <option value="20:00">20:00 (8:00 PM)</option>
                    <option value="20:30">20:30 (8:30 PM)</option>
                  </optgroup>
                  <optgroup label="Late Seating">
                    <option value="21:00">21:00 (9:00 PM)</option>
                    <option value="21:30">21:30 (9:30 PM)</option>
                    <option value="22:00">22:00 (10:00 PM)</option>
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Seating Salon Preference */}
            <div className="col-span-1 md:col-span-2 flex flex-col gap-1.5">
              <label htmlFor="salon" className="text-[10px] font-label-bold uppercase text-on-surface tracking-wider">
                Preferred Salon Location
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {seatingOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    id={`salon-${option.value}`}
                    onClick={() => setFormData({ ...formData, seatingPreference: option.value })}
                    className={`px-4 py-3 border text-left font-body text-xs flex items-center gap-2.5 transition-all duration-300 cursor-pointer rounded-lg ${
                      formData.seatingPreference === option.value
                        ? 'border-primary bg-primary/10 text-primary font-semibold shadow-sm'
                        : 'border-outline-variant/40 bg-white/20 text-on-surface hover:border-outline hover:bg-white/40'
                    }`}
                  >
                    <MapPin size={14} className={formData.seatingPreference === option.value ? 'text-primary animate-bounce' : 'text-secondary'} />
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Special Dietary / Occasion Notes */}
            <div className="col-span-1 md:col-span-2 flex flex-col gap-1.5">
              <label htmlFor="notes" className="text-[10px] font-label-bold uppercase text-on-surface tracking-wider">
                Special Requests or Dietary Requirements
              </label>
              <textarea
                id="notes"
                rows={3}
                placeholder="e.g., Severe peanut allergy, celebrating our 10th anniversary, prefer a booth..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-3 bg-white/40 backdrop-blur-sm border border-outline-variant/40 text-on-surface font-body text-sm rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white transition-all duration-300 resize-none shadow-sm"
              ></textarea>
            </div>
          </div>

          {/* Form CTA Button */}
          <div className="border-t border-outline-variant/40 pt-5 mt-2 flex justify-end">
            <button
              id="submit-booking-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-4 bg-primary text-on-primary font-display uppercase tracking-widest text-xs font-bold hover:bg-primary-dark transition-all duration-300 flex items-center justify-center gap-2 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-primary/35"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin rounded-full"></div>
                  Verifying Salon Availability...
                </>
              ) : (
                <>
                  Confirm Reservation Table
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
