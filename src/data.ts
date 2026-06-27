import { MenuItem } from './types';

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // Appetizers
  {
    id: 'app-1',
    name: 'Wagyu Carpaccio',
    category: 'appetizer',
    price: 28,
    description: 'Thinly sliced premium beef, shaved black truffle, aged parmesan, cold-pressed olive oil, micro arugula.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAR-1SX3hDZ_pDsHGe_SBX6D3tDMOo2l0p1MB2d2eQoobLJHY00VUOIYzVYU42YQTKoyJyzgUOzUVF5Qof4ftbMDpqREFS_J6Aff8cXOZpSCBIgw_PSur_aLb8SNNyVx9Zv-1DeRSpAhH-dpIQOnYu69zrtnHYAx8y6LIPTXMjsOclJgRH5xVEDoObj6CgaCBB_NvFVvAyCghLyforVva-lHQamCeJqTPIjGU55XG214EHb1M4MwxsMbhjmIgLHRp97lbfe4pwadg',
    tags: ['Gluten-Free'],
    details: 'Our A5 grade Japanese Wagyu is hand-sliced precisely to 1.5mm, dressed with cold-pressed Tuscan olive oil. Topped with rare Umbrian black summer truffles and 36-month aged Parmigiano-Reggiano.',
    flavorProfile: ['Rich', 'Earthy', 'Savory', 'Umami']
  },
  {
    id: 'app-2',
    name: 'Charred Octopus',
    category: 'appetizer',
    price: 24,
    description: 'Wood-fired Spanish octopus, smoked paprika romesco, confit fingerling potatoes, preserved lemon.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAkwuJN8n3bru_GWJYn56NmnLWZDEk86sAMZhWUOTCwdAzKobKs4Vb7gj8E6wicW5MaLtfq0synXRZV4K_okT2D-ilsYA6CKERgM5WfcQTsTHb4vTYm2GJw3RkI6RHYJWwFkjOux34zPTsjCefFffOnOQeLEASqFeSAlQhKWsmJNg8_1dbbCFR6NjSl4b1lve4Lu0iLkaThVPP7BTNGZPdOn-lUFZi-I-u3WLgJ03F-FZHmJMU5OGQDM0nsOOBvzdkdESvweUHZQ',
    tags: ['Dairy-Free'],
    details: 'Wild-caught Spanish octopus tenderized through a 24-hour slow braise, then flash-seared over direct oak fire for a perfectly crisp, smoky exterior. Served over a rich, nut-infused traditional Catalan romesco sauce.',
    flavorProfile: ['Smoky', 'Savory', 'Tangy', 'Tender']
  },
  {
    id: 'app-3',
    name: 'Heirloom Burrata',
    category: 'appetizer',
    price: 21,
    description: 'Hand-tied burrata, local heirloom tomatoes, aged balsamic reduction, torn basil, sourdough crisps.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9Qo_GbOa4vdcKRQU0xmzCYumgBtCFXk4ptzwXG_5lhTYKZNeybi0zU7u2VpLLIMTC_A-S08Y5LBeTAxoiSCOWtV2F_qQhoK_7daSxBe3KY1ZBT_ud2rq-2l68s9oQTcRGdn8p5I3hrJCaKW6pqsvE3E5GsPYR2N445AYVZ8drUCuZ7wvKX0IIR_TLF_6I-lCVja2Qu3Vy9xWAgU5DQJ155PZTQcv6PjwO1UXwWfmNLz53j_yr2cfFOGF7So6M1t-xDINuOpbPgA',
    tags: ['Vegetarian'],
    details: 'Freshly delivered artisanal burrata with a creamy stracciatella core, paired with local heritage heirloom tomatoes of varying sweetness. Accentuated with 25-year barrel-aged Modena balsamic and micro-basil oil.',
    flavorProfile: ['Creamy', 'Fresh', 'Sweet', 'Herbaceous']
  },

  // Mains
  {
    id: 'main-1',
    name: 'Dry-Aged Ribeye',
    category: 'main',
    price: 65,
    description: '45-day dry-aged bone-in ribeye, bone marrow butter, roasted garlic, blistered shishito peppers.',
    details: 'Prime bone-in ribeye aged on-site for deep concentration of flavor. Grilled over hickory wood-fire, rested with compound bone marrow butter, and accompanied by whole sweet garlic confit and high-char shishitos.',
    flavorProfile: ['Robust', 'Intense', 'Garlicky', 'Buttery'],
    tags: ['Gluten-Free']
  },
  {
    id: 'main-2',
    name: 'Pan-Seared Halibut',
    category: 'main',
    price: 42,
    description: 'Wild-caught Alaskan halibut, sunchoke purée, wild mushroom fricassee, brown butter caper sauce.',
    details: 'Delicate wild halibut fillet pan-roasted to a golden crust, seated on a silky sunchoke (Jerusalem artichoke) cream. Finished with a sauté of seasonal chanterelles and a sharp, rich lemon brown butter caper reduction.',
    flavorProfile: ['Delicate', 'Nutty', 'Citrusy', 'Savory'],
    tags: []
  },
  {
    id: 'main-3',
    name: 'Duck Breast',
    category: 'main',
    price: 46,
    description: 'Crispy skin duck breast, parsnip fondants, blackberry gastrique, toasted hazelnut crumble.',
    details: 'Pekin duck breast scored and slow-rendered for a paper-thin, crispy skin, served medium-rare. Complemented by butter-braised parsnips, a bittersweet blackberry-vinegar reduction, and roasted hazelnuts.',
    flavorProfile: ['Gamey', 'Sweet', 'Tart', 'Crunchy'],
    tags: ['Gluten-Free']
  },
  {
    id: 'main-4',
    name: 'Truffle Risotto',
    category: 'main',
    price: 38,
    description: 'Acquerello carnaroli rice, foraged mushrooms, black truffle shavings, 24-month parmigiano-reggiano.',
    details: 'Acquerello Carnaroli rice (aged 1 year) slowly stirred with double-strength forest mushroom stock. folded with hand-foraged wild mushrooms, whipped cultured butter, and generous fresh black truffle shavings.',
    flavorProfile: ['Creamy', 'Earthy', 'Rich', 'Umami'],
    tags: ['Vegetarian', 'Gluten-Free']
  },

  // Cocktails
  {
    id: 'drink-1',
    name: 'The Rastura Old Fashioned',
    category: 'cocktail',
    price: 24,
    description: 'Brown butter washed bourbon, smoked maple syrup, angostura bitters, flamed orange peel.',
    details: 'Our signature spirit. Small-batch Kentucky bourbon slowly infused with caramelized butter lipids, strained, then sweetened with wood-smoked Vermont maple syrup. Stirred over a single, hand-carved ice sphere.',
    flavorProfile: ['Spirit-forward', 'Smoky', 'Buttery', 'Citrus Accent']
  },
  {
    id: 'drink-2',
    name: 'Citrus & Smoke',
    category: 'cocktail',
    price: 22,
    description: 'Mezcal, yuzu liqueur, fresh lime, agave, charred rosemary.',
    details: 'Single-village artisanal mezcal paired with rare Japanese yuzu juice for a bright, floral, citrus acidity. Sweetened with organic agave nectar and served with a sprig of rosemary torched tableside.',
    flavorProfile: ['Smoky', 'Tangy', 'Herbaceous', 'Refreshing']
  },
  {
    id: 'drink-3',
    name: 'Velvet Espresso',
    category: 'cocktail',
    price: 20,
    description: 'Vodka, cold brew espresso, coffee liqueur, vanilla saline, tonka bean dust.',
    details: 'Triple-distilled vodka shaken vigorously with cold-extracted single-origin Ethiopian espresso. Layered with artisanal coffee liqueur, smoothed with vanilla-infused saline, and finished with freshly grated tonka bean.',
    flavorProfile: ['Rich', 'Caffeinated', 'Sweet', 'Smooth']
  },

  // Wines White
  {
    id: 'wine-w1',
    name: 'Chablis Grand Cru, Vaudésir 2018',
    category: 'wine-white',
    price: 38,
    description: 'Domaine William Fèvre, Burgundy, France',
    subText: 'Crisp, Mineral, Citrus',
    details: 'An extraordinary white Burgundy showing razor-sharp minerality, crisp green apple, lemon curd, and crushed chalk notes. Perfectly paired with our Charred Octopus or Pan-Seared Halibut.',
    flavorProfile: ['Mineral', 'Bone-dry', 'Crisp', 'High-acidity']
  },
  {
    id: 'wine-w2',
    name: 'Sauvignon Blanc, Te Koko 2020',
    category: 'wine-white',
    price: 26,
    description: 'Cloudy Bay, Marlborough, New Zealand',
    subText: 'Aromatic, Tropical, Complex',
    details: 'An unconventional Marlborough Sauvignon Blanc barrel-fermented with wild yeasts. Reveals layers of white peach, beeswax, toasted brioche, and vibrant passionfruit notes. Excellent with Heirloom Burrata.',
    flavorProfile: ['Tropical', 'Oak-influenced', 'Herbaceous', 'Complex']
  },

  // Wines Red
  {
    id: 'wine-r1',
    name: 'Pinot Noir, Russian River Valley 2021',
    category: 'wine-red',
    price: 32,
    description: 'Kosta Browne, California, USA',
    subText: 'Elegant, Red Fruit, Earthy',
    details: 'A critically-acclaimed California Pinot Noir with lush cherry, dark raspberry, and forest floor tones. Boasts silky tannins and an elegant, lingering toasted oak finish. Exceptional with the Duck Breast.',
    flavorProfile: ['Elegant', 'Fruity', 'Earthy', 'Silky']
  },
  {
    id: 'wine-r2',
    name: 'Barolo DOCG 2017',
    category: 'wine-red',
    price: 45,
    description: 'Pio Cesare, Piedmont, Italy',
    subText: 'Powerful, Tannic, Dark Cherry',
    details: 'The "King of Wines" made from pure Nebbiolo grapes. Powerful, dense, and structured with notes of leather, dried rose petals, dark cherry, and tar. Aged in French oak. Absolute pairing for the Dry-Aged Ribeye.',
    flavorProfile: ['Bold', 'Highly Tannic', 'Leathery', 'Savoury']
  }
];

export const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    name: 'Evelyn Carter',
    rating: 5,
    text: 'An exceptional dining experience. The Wagyu Carpaccio is a absolute masterpiece of flavors. The rustic, high-contrast industrial atmosphere combined with chef-driven culinary perfection makes Rastura our favorite night out.',
    date: 'June 15, 2026',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClEPz8jad8cVbl6st8xTRHo8lEWiw82eUtjfVMqSSRxq7JzX3xbmkLiIxaf61Iac2IOYC5-q-SMSHxOBlBmloEinI8G_-ovxNeEpTLFrJemO7aceC2LSOgt6NMNCQJ8s0CSvnX9uRu2ZFt-5y5kgNBmPkLHRyM0EfqDMLWt_HQAiIiHUX5qrZg9nSHkqgr6Stl1_c4e5ilsZJwyNmjrIPanZFiRe8PAvVa9V-8Q8BhtrVLzwdz5A2dQZmg0ECnBO773NrguSu2rQ'
  },
  {
    id: 'rev-2',
    name: 'Julian Hayes',
    rating: 5,
    text: 'Every bite tells a story. Marcus Vance and his brigade operate like a fine-tuned engine. Sitting by the open kitchen is like watching live theater. The Old Fashioned is the best in the city, period.',
    date: 'May 28, 2026',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0VRRWseHRs-qVpkwt7gCip-5_VFm5OoonRkWp9NZ-O7MEWrevHTPSuRNP3EnoO1C8vq53VmAopGmLkxC9T_YDJYjRTnHUE6InMAj9Yqi5AisMorLwb37bG23MYmlO-8liDlY-sukcccLibQpRu2xpq3LNVu5icHQxubUOyoWFbY_M91DzrlE1K6c-cjyKgjKChe840c1BOMIsD-AZ6AhnNfXxxfbCq3cVpnnbDbhHo40U-PKFntJ3iuJ6a_Z_qV_6KlJSF6ydaA'
  },
  {
    id: 'rev-3',
    name: 'Eleanor & Arthur Vance',
    rating: 5,
    text: 'Exceptional hospitality. True elegance in a converted warehouse setting. The charred octopus was exceptionally tender, and the wine list is expertly curated. A genuine credit to the city’s culinary scene.',
    date: 'April 12, 2026',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiuiizpyhtW0JE871F1uMKcSO8DmMbZ6ToI9r3Lji6iI4KriQMlgwc06Z1wnqp2124hid76M-mdeLeB3gnU17NW_FRdVqd2_GoREKi0rIHddOscPMk7zhd5rZthJJP3VfUKRqdV4CmoE5bLh7l9wWrug0TMRBngVWW8eUkNvrK6c5GEV6mDseYE_LGMWUBDqNWVob8-xIHF2OXZiE72vWjX7bIWVkzwvLk7bMkzm6_lNrPG4EJpA0l2PTXoYAp13o0mD36x0r3gQ'
  }
];
