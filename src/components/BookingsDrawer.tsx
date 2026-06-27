import React, { useState } from 'react';
import { X, Calendar, Clock, Users, MapPin, Trash2, ShieldAlert, Sparkles, AlertCircle, LogIn, CloudLightning } from 'lucide-react';
import { Reservation } from '../types';

interface BookingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  reservations: Reservation[];
  onCancelReservation: (id: string) => void;
  user: any;
  onSignIn: () => void;
}

export default function BookingsDrawer({ isOpen, onClose, reservations, onCancelReservation, user, onSignIn }: BookingsDrawerProps) {
  if (!isOpen) return null;

  const seatingNames: { [key: string]: string } = {
    'main': "Main Dining Hall",
    'chefs-counter': "Chef's Counter",
    'patio': "The Conservatory",
    'vault': "The Iron Vault"
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div 
          id="bookings-drawer-panel"
          className="w-screen max-w-md bg-surface border-l border-outline/30 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300"
        >
          {/* Header */}
          <div className="p-6 border-b border-outline-variant flex items-center justify-between bg-surface-container">
            <div>
              <h2 className="font-display text-2xl uppercase tracking-tight text-on-surface">
                My Table Bookings
              </h2>
              <p className="font-body text-xs text-on-surface-variant">
                Live dashboard of your reserved salons
              </p>
            </div>
            <button 
              id="close-bookings-drawer-btn"
              onClick={onClose}
              className="bg-inverse-surface text-background p-2 hover:bg-primary hover:text-on-primary transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Google Cloud Backup Promotion */}
          {!user ? (
            <div className="mx-6 mt-6 p-5 glass-panel border border-primary/20 flex flex-col gap-3.5 rounded-xl">
              <div className="flex items-start gap-2.5">
                <Sparkles size={16} className="text-primary shrink-0 mt-0.5 animate-pulse" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[11px] font-label-bold uppercase text-primary tracking-wider font-semibold">Cloud Storage Backup</span>
                  <p className="text-[10px] text-on-surface-variant leading-relaxed">
                    Sign in with Google to secure your table bookings to our cloud Firestore database. Access and view active reservations from any device.
                  </p>
                </div>
              </div>
              <button
                onClick={onSignIn}
                className="w-full py-2.5 glass-button-primary text-xs font-label-bold uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer rounded-lg"
              >
                <LogIn size={12} />
                <span>Sign In with Google</span>
              </button>
            </div>
          ) : (
            <div className="mx-6 mt-6 px-4 py-2.5 bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-between rounded-lg">
              <span className="text-[10px] font-mono text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shrink-0"></span>
                Securely Synced with Cloud
              </span>
              <span className="text-[9px] text-on-surface-variant font-body">
                Account: <span className="font-semibold text-on-surface">{user.displayName?.split(' ')[0]}</span>
              </span>
            </div>
          )}

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
            {reservations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                <div className="w-12 h-12 bg-surface-container-high rounded-none flex items-center justify-center text-secondary">
                  <Calendar size={24} />
                </div>
                <div>
                  <h4 className="font-display text-lg uppercase text-on-surface">No Reservations Found</h4>
                  <p className="font-body text-xs text-on-surface-variant max-w-xs mx-auto mt-1">
                    You do not have any active table bookings registered in this browser session. Secure a slot below!
                  </p>
                </div>
              </div>
            ) : (
              reservations.map((res, idx) => (
                <div 
                  key={res.id} 
                  id={`reservation-item-${res.id}`}
                  className="glass-card border border-outline-variant/50 p-5 shadow-sm relative flex flex-col gap-4 animate-in fade-in duration-200 rounded-xl"
                >
                  {/* Cancel button / Status Badge */}
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 font-display text-[9px] uppercase tracking-wider rounded-full ${
                      res.status === 'confirmed' 
                        ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-semibold' 
                        : 'bg-primary/10 text-primary border border-primary/20'
                    }`}>
                      {res.status}
                    </span>
                    
                    {res.status !== 'cancelled' && (
                      <button
                        id={`cancel-reservation-${res.id}`}
                        onClick={() => onCancelReservation(res.id)}
                        className="text-secondary hover:text-primary p-1.5 hover:bg-primary/5 transition-colors cursor-pointer rounded-full"
                        title="Cancel table booking"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>

                  {/* Core details */}
                  <div className="flex flex-col gap-2">
                    <h3 className="font-display text-lg uppercase text-on-surface tracking-wide">
                      {res.name}
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-y-2.5 gap-x-2 text-xs text-on-surface-variant font-body">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-primary" />
                        <span>{res.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={13} className="text-primary" />
                        <span>{res.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users size={13} className="text-primary" />
                        <span>{res.guests} Diners</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={13} className="text-primary" />
                        <span className="truncate">{seatingNames[res.seatingPreference] || res.seatingPreference}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact info / notes */}
                  <div className="border-t border-outline-variant/30 pt-3.5 flex flex-col gap-1 text-[11px] text-on-surface-variant font-body">
                    <div><span className="font-semibold text-on-surface">Phone:</span> {res.phone}</div>
                    <div><span className="font-semibold text-on-surface">Email:</span> {res.email}</div>
                    {res.notes && (
                      <div className="mt-1.5 p-2 bg-white/40 border-l-2 border-primary/50 text-[10px] rounded-r">
                        <span className="font-semibold text-on-surface">Notes:</span> "{res.notes}"
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer warning */}
          <div className="p-6 bg-surface-container border-t border-outline-variant flex items-start gap-3">
            <AlertCircle className="text-primary mt-0.5 shrink-0" size={16} />
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-label-bold uppercase text-on-surface tracking-wider">Late Policy</span>
              <p className="text-[10px] text-on-surface-variant leading-relaxed">
                Tables are held precisely for 15 minutes past the reserved seating hour. Please contact our front desk if running late to protect your reservation slot.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
