import React, { useMemo } from 'react';
import { Search, Flame, Sparkles, Filter, Check } from 'lucide-react';
import { MenuItem, MenuItemCategory } from '../types';
import { INITIAL_MENU_ITEMS } from '../data';

interface MenuSectionProps {
  onItemSelect: (item: MenuItem) => void;
  selectedCategory: 'all' | 'appetizer' | 'main' | 'drinks';
  setSelectedCategory: (cat: 'all' | 'appetizer' | 'main' | 'drinks') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedDiets: string[];
  setSelectedDiets: (diets: string[]) => void;
  sommelierActive: boolean;
  setSommelierActive: (active: boolean) => void;
}

export default function MenuSection({
  onItemSelect,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  selectedDiets,
  setSelectedDiets,
  sommelierActive,
  setSommelierActive
}: MenuSectionProps) {
  const diets = ['Gluten-Free', 'Dairy-Free', 'Vegetarian'];

  // Handle diet filter toggles
  const toggleDiet = (diet: string) => {
    if (selectedDiets.includes(diet)) {
      setSelectedDiets(selectedDiets.filter(d => d !== diet));
    } else {
      setSelectedDiets([...selectedDiets, diet]);
    }
  };

  // Filter items based on category, search, and diets
  const filteredItems = useMemo(() => {
    return INITIAL_MENU_ITEMS.filter(item => {
      // Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'drinks') {
          // Drinks includes cocktails and wines
          if (!item.category.startsWith('wine') && item.category !== 'cocktail') return false;
        } else {
          if (item.category !== selectedCategory) return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesDetails = item.details?.toLowerCase().includes(query) || false;
        if (!matchesName && !matchesDesc && !matchesDetails) return false;
      }

      // Dietary tag filters
      if (selectedDiets.length > 0) {
        const itemTags = item.tags || [];
        const matchesAllSelected = selectedDiets.every(diet => itemTags.includes(diet));
        if (!matchesAllSelected) return false;
      }

      return true;
    });
  }, [selectedCategory, searchQuery, selectedDiets]);

  // Separate categorized items for structural display
  const appetizers = useMemo(() => filteredItems.filter(item => item.category === 'appetizer'), [filteredItems]);
  const mains = useMemo(() => filteredItems.filter(item => item.category === 'main'), [filteredItems]);
  const cocktails = useMemo(() => filteredItems.filter(item => item.category === 'cocktail'), [filteredItems]);
  const whiteWines = useMemo(() => filteredItems.filter(item => item.category === 'wine-white'), [filteredItems]);
  const redWines = useMemo(() => filteredItems.filter(item => item.category === 'wine-red'), [filteredItems]);

  return (
    <div className="flex flex-col gap-10">
      {/* Filters & Search Control Bar */}
      <div className="bg-surface-container border border-outline/20 p-5 md:p-6 shadow-sm flex flex-col md:flex-row gap-5 items-center justify-between">
        
        {/* Category Selector Tabs */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {(['all', 'appetizer', 'main', 'drinks'] as const).map(cat => (
            <button
              key={cat}
              id={`cat-btn-${cat}`}
              onClick={() => {
                setSelectedCategory(cat);
              }}
              className={`px-5 py-2.5 font-display text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-primary text-on-primary font-bold'
                  : 'bg-surface hover:bg-surface-container-high border border-outline-variant text-on-surface'
              }`}
            >
              {cat === 'all' ? 'Full Menu' : cat === 'drinks' ? 'Cocktails & Wines' : `${cat}s`}
            </button>
          ))}
        </div>

        {/* Search & Dietary Filters */}
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto md:flex-1 justify-end max-w-2xl">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3.5 top-3.5 text-secondary" size={16} />
            <input
              type="text"
              id="menu-search-input"
              placeholder="Search dishes, profiles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-surface border border-outline/30 text-on-surface font-body text-xs rounded-none focus:outline-none focus:border-primary transition-colors placeholder:text-secondary"
            />
          </div>

          {/* Diet & Sommelier Controls */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[10px] font-label-bold uppercase text-secondary tracking-wider mr-1 hidden sm:inline">Dietary:</span>
            {diets.map(diet => {
              const isSelected = selectedDiets.includes(diet);
              return (
                <button
                  key={diet}
                  id={`diet-filter-${diet.toLowerCase().replace(' ', '-')}`}
                  onClick={() => toggleDiet(diet)}
                  className={`px-3 py-2 border text-[10px] font-label-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'border-primary bg-primary/5 text-primary font-semibold'
                      : 'border-outline-variant bg-surface text-on-surface hover:border-outline'
                  }`}
                >
                  {isSelected && <Check size={10} className="text-primary" />}
                  {diet}
                </button>
              );
            })}

            {/* Sommelier Assistant Toggle */}
            <div className="w-[1px] h-6 bg-outline-variant mx-1 hidden sm:block"></div>
            <button
              type="button"
              id="sommelier-pairing-toggle"
              onClick={() => setSommelierActive(!sommelierActive)}
              className={`px-3 py-2 border text-[10px] font-label-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                sommelierActive
                  ? 'border-primary bg-primary/10 text-primary font-bold'
                  : 'border-outline-variant bg-surface text-secondary hover:border-outline'
              }`}
              title="Toggle interactive dish and wine pairing recommendations"
            >
              <Sparkles size={11} className={sommelierActive ? "text-primary animate-pulse" : "text-secondary"} />
              Sommelier Guide: {sommelierActive ? 'Active' : 'Muted'}
            </button>
          </div>
        </div>
      </div>

      {/* Grid Layouts depending on results */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20 border border-outline-variant bg-surface-container-low">
          <p className="font-display text-xl uppercase text-secondary mb-2">No culinary items found</p>
          <p className="font-body text-xs text-on-surface-variant max-w-sm mx-auto">
            Try resetting your search query or removing dietary filters to explore our full seasonal menu.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDiets([]);
              setSelectedCategory('all');
            }}
            className="mt-5 px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-on-primary font-display text-[10px] uppercase tracking-widest transition-colors cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-16">
          {/* 1. Appetizers Section (Bento Cards with Images) */}
          {appetizers.length > 0 && (
            <div id="appetizers-container" className="flex flex-col gap-6">
              <div className="border-b border-primary pb-2 flex items-center justify-between">
                <h3 className="font-display text-2xl uppercase tracking-tight text-on-surface">Appetizers</h3>
                <span className="font-mono text-xs text-secondary-fixed bg-inverse-surface px-2.5 py-0.5 rounded-none">{appetizers.length} items</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {appetizers.map(item => (
                  <div 
                    key={item.id}
                    id={`menu-item-${item.id}`}
                    onClick={() => onItemSelect(item)}
                    className="group bg-surface-container-lowest border border-outline/20 overflow-hidden card-hover flex flex-col justify-between cursor-pointer"
                  >
                    <div>
                      {item.image && (
                        <div className="h-56 relative overflow-hidden bg-surface-container-high">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 right-3 flex gap-1.5">
                            {item.tags?.map(t => (
                              <span key={t} className="bg-black/80 backdrop-blur-xs text-primary font-display text-[9px] uppercase tracking-wider px-2 py-0.5">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="p-5 flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                          <h4 className="font-display text-xl uppercase tracking-tight text-on-surface group-hover:text-primary transition-colors">
                            {item.name}
                          </h4>
                          <span className="font-display text-lg text-primary ml-4">${item.price}</span>
                        </div>
                        <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                          {item.description}
                        </p>
                        {sommelierActive && (
                          <div className="mt-3 p-3 bg-surface border border-outline-variant/60 text-[11px] font-body text-on-surface-variant flex items-center justify-between gap-2">
                            <span className="flex items-center gap-1 shrink-0 text-[9px] uppercase font-label-bold text-primary">
                              <Sparkles size={11} className="text-primary animate-pulse" />
                              Pairing
                            </span>
                            <span className="truncate italic text-right font-medium text-on-surface">
                              {item.id === 'app-1' ? 'Barolo DOCG 2017' : item.id === 'app-2' ? 'Chablis Grand Cru' : 'Sauvignon Blanc'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-1 border-t border-outline-variant/30 flex justify-between items-center text-[10px] text-secondary font-label-bold uppercase">
                      <span>View Details</span>
                      <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Main Courses (Traditional leader dotted lines) */}
          {mains.length > 0 && (
            <div id="mains-container" className="flex flex-col gap-6">
              <div className="border-b border-primary pb-2 flex items-center justify-between">
                <h3 className="font-display text-2xl uppercase tracking-tight text-on-surface">Main Courses</h3>
                <span className="font-mono text-xs text-secondary-fixed bg-inverse-surface px-2.5 py-0.5 rounded-none">{mains.length} items</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8 bg-surface-container p-6 sm:p-8 border border-outline/10">
                {mains.map(item => (
                  <div 
                    key={item.id}
                    id={`menu-item-${item.id}`}
                    onClick={() => onItemSelect(item)}
                    className="group flex flex-col gap-1.5 cursor-pointer hover:bg-surface-container-lowest/50 p-2 -m-2 transition-colors duration-300"
                  >
                    <div className="flex justify-between items-end">
                      <span className="font-display text-lg uppercase tracking-wide text-on-surface group-hover:text-primary transition-colors flex items-center gap-2">
                        {item.name}
                        {item.tags?.includes('Vegetarian') && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block" title="Vegetarian"></span>}
                      </span>
                      <span className="leader-line"></span>
                      <span className="font-display text-lg text-primary">${item.price}</span>
                    </div>
                    <div className="flex justify-between items-start gap-4">
                      <p className="font-body text-xs text-on-surface-variant leading-relaxed flex-1">
                        {item.description}
                      </p>
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex gap-1.5 mt-0.5">
                          {item.tags.map(tag => (
                            <span key={tag} className="px-1.5 py-0.5 bg-outline/10 text-on-surface-variant text-[8px] font-label-bold uppercase">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {sommelierActive && (
                      <div className="mt-2 text-[11px] font-body text-on-surface-variant/85 flex items-center gap-1.5 bg-primary/5 px-2.5 py-1.5 border-l border-primary">
                        <Sparkles size={11} className="text-primary shrink-0" />
                        <span className="text-[9px] uppercase font-label-bold text-primary shrink-0">Sommelier Pairing:</span>
                        <span className="italic font-medium text-on-surface">
                          {item.id === 'main-1' ? 'Barolo DOCG 2017' : item.id === 'main-2' ? 'Chablis Grand Cru, Vaudésir 2018' : item.id === 'main-3' ? 'Pinot Noir, Russian River Valley 2021' : 'Aged Cabernet Sauvignon'}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Drinks & Signature Cocktails (Dotted leader lines) */}
          {(cocktails.length > 0 || whiteWines.length > 0 || redWines.length > 0) && (
            <div id="drinks-container" className="flex flex-col gap-10">
              {/* Cocktails section */}
              {cocktails.length > 0 && (
                <div className="flex flex-col gap-6">
                  <div className="border-b border-primary pb-2 flex items-center justify-between">
                    <h3 className="font-display text-2xl uppercase tracking-tight text-on-surface">Signature Cocktails</h3>
                    <span className="font-mono text-xs text-secondary-fixed bg-inverse-surface px-2.5 py-0.5 rounded-none">{cocktails.length} drinks</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {cocktails.map(item => (
                      <div
                        key={item.id}
                        id={`menu-item-${item.id}`}
                        onClick={() => onItemSelect(item)}
                        className="group bg-surface border border-outline-variant p-5 card-hover cursor-pointer flex flex-col justify-between"
                      >
                        <div className="flex flex-col gap-3">
                          <div className="flex justify-between items-start">
                            <h4 className="font-display text-lg uppercase tracking-tight text-on-surface group-hover:text-primary transition-colors">
                              {item.name}
                            </h4>
                            <span className="font-display text-lg text-primary ml-2">${item.price}</span>
                          </div>
                          
                          <div className="leader-line-drinks h-[2px] w-full my-1"></div>
                          
                          <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                            {item.description}
                          </p>
                          {sommelierActive && (
                            <div className="mt-3 p-2 bg-surface-container-low border border-outline-variant/30 text-[10px] font-body text-on-surface-variant flex items-center justify-between gap-1">
                              <span className="text-[9px] uppercase font-label-bold text-primary">Dish Pairing:</span>
                              <span className="italic text-on-surface truncate">
                                {item.id === 'drink-c1' ? 'Wagyu Ribeye Steak' : item.id === 'drink-c2' ? 'Charred Octopus' : 'Heirloom Burrata'}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="mt-4 pt-3 border-t border-outline-variant/30 text-[9px] font-label-bold uppercase text-secondary flex items-center justify-between">
                          <span>Mixology Notes</span>
                          <span className="text-primary group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Wines Grid (White and Red side-by-side) */}
              {(whiteWines.length > 0 || redWines.length > 0) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* White Wines */}
                  {whiteWines.length > 0 && (
                    <div className="flex flex-col gap-6">
                      <div className="border-b border-primary pb-2 flex items-center justify-between">
                        <h4 className="font-display text-xl uppercase tracking-tight text-on-surface">Fine Whites</h4>
                        <span className="font-mono text-[10px] text-secondary">Glass Pour</span>
                      </div>
                      <div className="flex flex-col gap-6 bg-surface-container/30 p-5 border border-outline/10">
                        {whiteWines.map(item => (
                          <div
                            key={item.id}
                            id={`menu-item-${item.id}`}
                            onClick={() => onItemSelect(item)}
                            className="group flex flex-col gap-1 cursor-pointer"
                          >
                            <div className="flex justify-between items-end">
                              <span className="font-display text-sm uppercase tracking-wide text-on-surface group-hover:text-primary transition-colors">
                                {item.name}
                              </span>
                              <span className="leader-line"></span>
                              <span className="font-display text-sm text-primary">${item.price}</span>
                            </div>
                            <div className="flex justify-between text-xs font-body text-on-surface-variant">
                              <span>{item.description}</span>
                              <span className="text-[10px] font-label-bold text-primary italic uppercase">{item.subText}</span>
                            </div>
                            {sommelierActive && (
                              <div className="text-[10px] font-body text-primary italic mt-1 pl-2 border-l border-primary/30 flex items-center gap-1.5">
                                <Sparkles size={9} className="text-primary shrink-0 animate-pulse" />
                                <span>Recommended pairing: {item.id === 'wine-w1' ? 'Oak-Fired Halibut' : 'Heirloom Burrata'}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Red Wines */}
                  {redWines.length > 0 && (
                    <div className="flex flex-col gap-6">
                      <div className="border-b border-primary pb-2 flex items-center justify-between">
                        <h4 className="font-display text-xl uppercase tracking-tight text-on-surface">Reserve Reds</h4>
                        <span className="font-mono text-[10px] text-secondary">Glass Pour</span>
                      </div>
                      <div className="flex flex-col gap-6 bg-surface-container/30 p-5 border border-outline/10">
                        {redWines.map(item => (
                          <div
                            key={item.id}
                            id={`menu-item-${item.id}`}
                            onClick={() => onItemSelect(item)}
                            className="group flex flex-col gap-1 cursor-pointer"
                          >
                            <div className="flex justify-between items-end">
                              <span className="font-display text-sm uppercase tracking-wide text-on-surface group-hover:text-primary transition-colors">
                                {item.name}
                              </span>
                              <span className="leader-line"></span>
                              <span className="font-display text-sm text-primary">${item.price}</span>
                            </div>
                            <div className="flex justify-between text-xs font-body text-on-surface-variant">
                              <span>{item.description}</span>
                              <span className="text-[10px] font-label-bold text-primary italic uppercase">{item.subText}</span>
                            </div>
                            {sommelierActive && (
                              <div className="text-[10px] font-body text-primary italic mt-1 pl-2 border-l border-primary/30 flex items-center gap-1.5">
                                <Sparkles size={9} className="text-primary shrink-0 animate-pulse" />
                                <span>Recommended pairing: {item.id === 'wine-r1' ? 'Pekin Duck Breast' : '35-Day Aged Wagyu'}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
