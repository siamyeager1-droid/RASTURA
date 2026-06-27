import React from 'react';
import { X, Flame, Leaf, Eye, ShieldAlert, Sparkles } from 'lucide-react';
import { MenuItem } from '../types';

interface ItemModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export default function ItemModal({ item, onClose }: ItemModalProps) {
  if (!item) return null;

  const getPairing = (id: string) => {
    switch (id) {
      case 'app-1': return { type: 'Wine Pairing', title: 'Barolo DOCG 2017', desc: 'The intense tannic structure of Nebbiolo balances the rich fattiness of the Wagyu beef perfectly.' };
      case 'app-2': return { type: 'Wine Pairing', title: 'Chablis Grand Cru, Vaudésir 2018', desc: 'High acidity and crushed oyster-shell minerality slice through the buttery richness of the wood-seared octopus.' };
      case 'app-3': return { type: 'Wine Pairing', title: 'Sancerre Sauvignon Blanc', desc: 'Crisp citrus notes cut the creamy richness of the burrata, presenting a refreshing and balanced finish.' };
      case 'main-1': return { type: 'Wine Pairing', title: 'Barolo DOCG 2017', desc: 'The dense dark fruit notes and massive structural framework of aged Nebbiolo elevate the dry-aged Ribeye to monumental levels.' };
      case 'main-2': return { type: 'Wine Pairing', title: 'Chablis Grand Cru', desc: 'Steel-aged Chardonnay enhances the natural brininess of the wild sea bass, with subtle toasted oak adding sweet smoke accents.' };
      case 'main-3': return { type: 'Wine Pairing', title: 'Pinot Noir, Russian River Valley', desc: 'An exceptionally complex red with bright red cherry notes that complement the natural sweetness of wood-fired duck breast.' };
      case 'main-4': return { type: 'Wine Pairing', title: 'Chablis Grand Cru', desc: 'The crisp, flinty minerality of steel-aged Chardonnay balances the wild earthiness of wood-roasted forest mushrooms.' };
      case 'drink-c1': return { type: 'Dish Pairing', title: 'Wagyu Ribeye Steak', desc: 'The oak smoke of this mezcal cocktail mirrors the wood-fired sear, while the citrus cuts through rich marbled beef fats.' };
      case 'drink-c2': return { type: 'Dish Pairing', title: 'Wood-Seared Octopus', desc: 'Grapefruit oils in the paloma accentuate the caramelized sweet-smoke of our charred sea octopus tentacles.' };
      case 'drink-c3': return { type: 'Dish Pairing', title: 'Heirloom Burrata', desc: 'The dry, bubbly champagne base and botanicals cleanse the palate between bites of the rich, creamy cheese.' };
      case 'wine-w1': return { type: 'Dish Pairing', title: 'Oak-Fired Halibut or Pan-Seared Sea Bass', desc: 'Delicate citrus and rich flintiness support high-heat premium white fish.' };
      case 'wine-w2': return { type: 'Dish Pairing', title: 'Heirloom Burrata', desc: 'Crisp, high acidity works in lockstep with fresh olive oils and soft, rich cheeses.' };
      case 'wine-r1': return { type: 'Dish Pairing', title: 'Pekin Duck Breast or Quail', desc: 'Fine, focused tannins match gamey bird skin charred over cured applewood.' };
      case 'wine-r2': return { type: 'Dish Pairing', title: '35-Day Dry-Aged Ribeye', desc: 'Immense, robust tannic volume that stands toe-to-toe with rich fat marbling and oak crust.' };
      default: return null;
    }
  };

  const pairing = getPairing(item.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity duration-300">
      <div 
        id="item-detail-modal"
        className="bg-surface border border-outline/30 w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 relative"
      >
        {/* Close Button */}
        <button 
          id="close-item-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-inverse-surface text-background p-2 hover:bg-primary hover:text-on-primary transition-colors duration-200 cursor-pointer"
          aria-label="Close details"
        >
          <X size={20} />
        </button>

        {/* Hero Image */}
        {item.image && (
          <div className="h-64 sm:h-80 w-full relative overflow-hidden bg-surface-container-highest">
            <img 
              src={item.image} 
              alt={item.name} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
              <div>
                <span className="text-primary font-display uppercase tracking-widest text-xs mb-1 block">
                  {item.category.replace('-', ' ')}
                </span>
                <h2 className="text-white font-display text-3xl sm:text-4xl uppercase tracking-tight">
                  {item.name}
                </h2>
              </div>
            </div>
          </div>
        )}

        <div className="p-6 sm:p-8 flex flex-col gap-6 max-h-[80vh] overflow-y-auto">
          {!item.image && (
            <div>
              <span className="text-primary font-display uppercase tracking-widest text-xs mb-1 block">
                {item.category.replace('-', ' ')}
              </span>
              <h2 className="text-on-surface font-display text-3xl uppercase tracking-tight">
                {item.name}
              </h2>
            </div>
          )}

          {/* Description & Details */}
          <div className="flex flex-col gap-4">
            <p className="text-on-surface font-body text-lg leading-relaxed">
              {item.description}
            </p>
            {item.details && (
              <p className="text-on-surface-variant font-body text-sm leading-relaxed border-l-2 border-primary pl-4 py-1 italic bg-surface-container-lowest/50">
                {item.details}
              </p>
            )}
          </div>

          {/* Tag & Info Section */}
          <div className="flex flex-wrap gap-6 items-center justify-between border-t border-b border-outline-variant py-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-label-bold text-secondary uppercase tracking-wider">Price</span>
              <span className="text-2xl font-display text-primary">${item.price}</span>
            </div>

            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-col gap-1.5 items-start">
                <span className="text-xs font-label-bold text-secondary uppercase tracking-wider">Dietary</span>
                <div className="flex gap-2">
                  {item.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="px-2 py-1 bg-surface-container border border-outline/30 text-[10px] font-label-bold uppercase text-on-surface rounded-none"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {item.flavorProfile && item.flavorProfile.length > 0 && (
              <div className="flex flex-col gap-1.5 items-start">
                <span className="text-xs font-label-bold text-secondary uppercase tracking-wider">Flavor Profile</span>
                <div className="flex flex-wrap gap-1">
                  {item.flavorProfile.map(profile => (
                    <span 
                      key={profile} 
                      className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-label-bold uppercase tracking-wider"
                    >
                      {profile}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sommelier Pairing Recommendation box */}
          {pairing && (
            <div className="flex items-start gap-3 bg-primary/5 p-4 border border-primary/20">
              <Sparkles className="text-primary shrink-0 mt-0.5 animate-pulse" size={18} />
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-label-bold uppercase text-primary tracking-widest">{pairing.type}</span>
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  <span className="text-xs font-label-bold text-on-surface uppercase tracking-wide font-bold">{pairing.title}</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed italic">
                  "{pairing.desc}"
                </p>
              </div>
            </div>
          )}

          {/* Chef's Note / Fine Print */}
          <div className="flex items-start gap-3 bg-surface-container-low p-4 border border-outline-variant">
            <Flame className="text-primary shrink-0 mt-0.5" size={18} />
            <div className="flex flex-col gap-1">
              <h4 className="font-label-bold text-xs uppercase text-on-surface">The Rastura Standard</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                All menu components are freshly harvested, butchered, or crafted daily in-house by Chef Marcus Vance and his brigade using custom oak wood fires and high-heat iron griddles. Please inform your server of any severe food allergies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
