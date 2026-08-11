const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Reservation = require('./models/Reservation');
const Payment = require('./models/Payment');
const Review = require('./models/Review');

const menuItems = [
  // --- BIRYANI VARIETIES ---
  {
    id: 'hyderabadi-chicken-biryani',
    name: 'Hyderabadi Chicken Dum Biryani',
    category: 'Biryani',
    cuisine: 'Indian',
    price: 389,
    halfPrice: 249,
    isVeg: false,
    spiceLevel: '🌶️🌶️ Spicy',
    rating: 4.9,
    prepTime: '25 mins',
    description: 'Authentic slow-cooked dum biryani with marinated tender chicken, aromatic long-grain basmati, saffron, fried onions, and boiled egg served with salan and raita.',
    image: '/assets/hyderabadi-biryani.png'
  },
  {
    id: 'mutton-dum-biryani',
    name: 'Royal Mutton Dum Biryani',
    category: 'Biryani',
    cuisine: 'Indian',
    price: 499,
    halfPrice: 329,
    isVeg: false,
    spiceLevel: '🌶️🌶️ Spicy',
    rating: 4.9,
    prepTime: '30 mins',
    description: 'Succulent baby goat meat infused with whole spices and layered with fragrant basmati rice in traditional sealed handi pot.',
    image: '/assets/hyderabadi-biryani.png'
  },
  {
    id: 'thalassery-chicken-biryani',
    name: 'Thalassery Chicken Biryani',
    category: 'Biryani',
    cuisine: 'Indian',
    price: 369,
    halfPrice: 239,
    isVeg: false,
    spiceLevel: '🌶️ Medium',
    rating: 4.8,
    prepTime: '20 mins',
    description: 'Malabar special biryani prepared with aromatic kaima rice, pure ghee, roasted cashews, raisins, and delicate Kerala spices.',
    image: '/assets/hyderabadi-biryani.png'
  },
  {
    id: 'lucknowi-chicken-biryani',
    name: 'Lucknowi Dum Biryani (Awadhi)',
    category: 'Biryani',
    cuisine: 'Indian',
    price: 379,
    halfPrice: 249,
    isVeg: false,
    spiceLevel: '🌶️ Mild',
    rating: 4.8,
    prepTime: '25 mins',
    description: 'Subtle and aromatic Awadhi style dum biryani cooked in kewra water, rose essence, and delicate whole spices.',
    image: '/assets/hyderabadi-biryani.png'
  },
  {
    id: 'paneer-tikka-biryani',
    name: 'Paneer Tikka Dum Biryani',
    category: 'Biryani',
    cuisine: 'Indian',
    price: 329,
    halfPrice: 219,
    isVeg: true,
    spiceLevel: '🌶️🌶️ Medium',
    rating: 4.7,
    prepTime: '20 mins',
    description: 'Char-grilled smoky paneer tikka cubes cooked in rich gravy and layered with fragrant basmati dum rice.',
    image: '/assets/paneer-butter-masala.png'
  },
  {
    id: 'egg-special-biryani',
    name: 'Special Masala Egg Biryani',
    category: 'Biryani',
    cuisine: 'Indian',
    price: 289,
    halfPrice: 189,
    isVeg: false,
    spiceLevel: '🌶️🌶️ Medium',
    rating: 4.6,
    prepTime: '18 mins',
    description: 'Golden shallow fried spiced eggs tossed in caramelized onion basmati rice with freshly ground biryani spices.',
    image: '/assets/hyderabadi-biryani.png'
  },

  // --- MANDHI VARIETIES ---
  {
    id: 'alfaham-chicken-mandhi',
    name: 'Al Faham Chicken Mandhi',
    category: 'Mandhi',
    cuisine: 'Arabian',
    price: 449,
    halfPrice: 289,
    isVeg: false,
    spiceLevel: '🌶️🌶️ Medium Spicy',
    rating: 4.9,
    prepTime: '25 mins',
    description: 'Signature Arabian charcoal grilled Al Faham chicken quarter served on fragrant long-grain Mandhi rice with spicy salsa, toum garlic sauce, and fried almonds.',
    image: '/assets/alfaham-mandhi.png'
  },
  {
    id: 'peri-peri-mandhi',
    name: 'Spicy Peri Peri Chicken Mandhi',
    category: 'Mandhi',
    cuisine: 'Arabian',
    price: 469,
    halfPrice: 299,
    isVeg: false,
    spiceLevel: '🌶️🌶️🌶️ Fiery Hot',
    rating: 4.9,
    prepTime: '25 mins',
    description: 'Tangy red peri peri glazed flame-grilled chicken paired with aromatic buttered mandhi rice and pickled chillies.',
    image: '/assets/alfaham-mandhi.png'
  },
  {
    id: 'mutton-lamb-mandhi',
    name: 'Juicy Mutton Lamb Ribs Mandhi',
    category: 'Mandhi',
    cuisine: 'Arabian',
    price: 599,
    halfPrice: 389,
    isVeg: false,
    spiceLevel: '🌶️ Mild',
    rating: 5.0,
    prepTime: '35 mins',
    description: 'Melt-in-your-mouth slow roasted lamb ribs seasoned with authentic Yemeni spices over fragrant saffron mandhi rice.',
    image: '/assets/alfaham-mandhi.png'
  },
  {
    id: 'crispy-fish-mandhi',
    name: 'Crispy Grilled Fish Mandhi',
    category: 'Mandhi',
    cuisine: 'Arabian',
    price: 529,
    halfPrice: 349,
    isVeg: false,
    spiceLevel: '🌶️🌶️ Medium',
    rating: 4.8,
    prepTime: '25 mins',
    description: 'Fresh kingfish fillet marinated in Arabian zaatar and lemon pepper grilled crisp over smokey mandhi basmati.',
    image: '/assets/alfaham-mandhi.png'
  },
  {
    id: 'paneer-veggie-mandhi',
    name: 'Royal Paneer & Veggie Mandhi',
    category: 'Mandhi',
    cuisine: 'Arabian',
    price: 369,
    halfPrice: 239,
    isVeg: true,
    spiceLevel: '🌶️ Mild',
    rating: 4.7,
    prepTime: '20 mins',
    description: 'Charcoal grilled herb paneer kebabs and roasted Mediterranean vegetables served over butter rice with garlic salsa.',
    image: '/assets/alfaham-mandhi.png'
  },

  // --- OTHER CATEGORY ITEMS ---
  {
    id: 'royal-butter-chicken',
    name: 'Royal Butter Chicken',
    category: 'Indian',
    cuisine: 'Indian',
    price: 399,
    isVeg: false,
    spiceLevel: '🌶️ Mild',
    rating: 4.9,
    prepTime: '20 mins',
    description: 'Creamy tomato curry with tender chicken, infused with rich butter and aromatic Indian spices.',
    image: '/assets/royal-butter-chicken.png'
  },
  {
    id: 'paneer-butter-masala',
    name: 'Paneer Butter Masala',
    category: 'Indian',
    cuisine: 'Indian',
    price: 369,
    isVeg: true,
    spiceLevel: '🌶️ Mild',
    rating: 4.7,
    prepTime: '20 mins',
    description: 'Silky tomato-cashew gravy with fresh cottage cheese cubes and fragrant spices.',
    image: '/assets/paneer-butter-masala.png'
  },
  {
    id: 'chilli-paneer',
    name: 'Chilli Paneer',
    category: 'Chinese',
    cuisine: 'Chinese',
    price: 329,
    isVeg: true,
    spiceLevel: '🌶️🌶️ Medium',
    rating: 4.8,
    prepTime: '15 mins',
    description: 'Stir-fried paneer and peppers in a fiery garlic soy glaze with fresh spring onions.',
    image: '/assets/chilli-paneer.png'
  },
  {
    id: 'veg-fried-rice',
    name: 'Veg Fried Rice',
    category: 'Chinese',
    cuisine: 'Chinese',
    price: 259,
    isVeg: true,
    spiceLevel: '🌶️ Mild',
    rating: 4.6,
    prepTime: '15 mins',
    description: 'Wok-fried rice loaded with crisp garden vegetables and delicate soy aroma.',
    image: '/assets/veg-fried-rice.png'
  },
  {
    id: 'truffle-mushroom-risotto',
    name: 'Truffle Mushroom Risotto',
    category: 'Western',
    cuisine: 'Western',
    price: 449,
    isVeg: true,
    spiceLevel: 'Mild',
    rating: 4.9,
    prepTime: '25 mins',
    description: 'Rich arborio rice with wild woodland mushrooms, shaved parmesan, and black truffle oil.',
    image: '/assets/truffle-mushroom-risotto.png'
  },
  {
    id: 'chocolate-mousse',
    name: 'Chocolate Mousse',
    category: 'Dessert',
    cuisine: 'Dessert',
    price: 199,
    isVeg: true,
    spiceLevel: 'Sweet',
    rating: 5.0,
    prepTime: '10 mins',
    description: 'Smooth dark Belgian chocolate mousse topped with mint leaf and cocoa dust.',
    image: '/assets/chocolate-mousse.png'
  },

  // --- LOCAL SOUTH INDIAN SPECIALS ---
  {
    id: 'nadan-fish-fry',
    name: 'Nadan Seer Fish Tava Fry',
    category: 'Local',
    cuisine: 'South Indian',
    price: 299,
    isVeg: false,
    spiceLevel: '🌶️🌶️ Medium Spicy',
    rating: 4.9,
    prepTime: '20 mins',
    description: 'Fresh seer fish steak marinated in Kerala red chilli masala, turmeric, curry leaves, and shallow tava fried in pure coconut oil.',
    image: '/assets/local-dishes.png'
  },
  {
    id: 'idli-sambar-chutney',
    name: 'Hot Steamed Idli Set (3 Pcs)',
    category: 'Local',
    cuisine: 'South Indian',
    price: 129,
    isVeg: true,
    spiceLevel: '🌶️ Mild',
    rating: 4.8,
    prepTime: '10 mins',
    description: 'Soft steaming white rice idlis served with hot drumstick vegetable sambar, red tomato chutney, coconut chutney, and mint chutney.',
    image: '/assets/local-dishes.png'
  },
  {
    id: 'ghee-roast-dosa',
    name: 'Crispy Ghee Roast Dosa',
    category: 'Local',
    cuisine: 'South Indian',
    price: 169,
    isVeg: true,
    spiceLevel: '🌶️ Mild',
    rating: 4.9,
    prepTime: '15 mins',
    description: 'Golden extra-crispy paper dosa roasted with pure desi cow ghee, served with hot sambar and trio of chutneys.',
    image: '/assets/local-dishes.png'
  },
  {
    id: 'medu-vada-set',
    name: 'Crunchy Medu Vada (2 Pcs)',
    category: 'Local',
    cuisine: 'South Indian',
    price: 99,
    isVeg: true,
    spiceLevel: '🌶️ Mild',
    rating: 4.7,
    prepTime: '12 mins',
    description: 'Golden fried lentil donuts seasoned with black pepper, fresh ginger, curry leaves, served with hot sambar & coconut chutney.',
    image: '/assets/local-dishes.png'
  },
  {
    id: 'kerala-porotta-chicken',
    name: 'Malabar Porotta (2 Pcs) & Chicken Roast',
    category: 'Local',
    cuisine: 'South Indian',
    price: 249,
    isVeg: false,
    spiceLevel: '🌶️🌶️ Medium Spicy',
    rating: 4.9,
    prepTime: '20 mins',
    description: 'Flaky layered Kerala porottas paired with spicy semi-gravy Kerala chicken roast infused with roasted coconut and spices.',
    image: '/assets/local-dishes.png'
  },
  {
    id: 'appam-veg-stew',
    name: 'Soft Appam (2 Pcs) & Creamy Veg Stew',
    category: 'Local',
    cuisine: 'South Indian',
    price: 189,
    isVeg: true,
    spiceLevel: '🌶️ Mild',
    rating: 4.8,
    prepTime: '15 mins',
    description: 'Lacy soft bowl appams served with comforting coconut milk vegetable stew cooked with whole spices, carrots, and green peas.',
    image: '/assets/local-dishes.png'
  },

  // --- TEA, COFFEE & CHAYA (WITH CUSTOMIZATION OPTIONS) ---
  {
    id: 'nadan-strong-chaya',
    name: 'Nadan Strong Milk Chaya (Kerala Tea)',
    category: 'Beverages',
    cuisine: 'Beverages',
    price: 40,
    isVeg: true,
    spiceLevel: 'Aromatic',
    rating: 5.0,
    prepTime: '8 mins',
    description: 'Authentic high-poured Kerala milk tea brewed strong with crushed cardamom and fresh tea leaves.',
    isCustomizableBeverage: true,
    image: '/assets/kerala-chaya.png'
  },
  {
    id: 'filter-coffee',
    name: 'South Indian Filter Coffee (Kappi)',
    category: 'Beverages',
    cuisine: 'Beverages',
    price: 50,
    isVeg: true,
    spiceLevel: 'Rich Brew',
    rating: 5.0,
    prepTime: '8 mins',
    description: 'Traditional decoction filter coffee frothed with boiled milk in classic stainless steel dabara set.',
    isCustomizableBeverage: true,
    image: '/assets/kerala-chaya.png'
  },
  {
    id: 'inji-elaichi-chaya',
    name: 'Fresh Ginger Elaichi Tea (Inji Chaya)',
    category: 'Beverages',
    cuisine: 'Beverages',
    price: 45,
    isVeg: true,
    spiceLevel: 'Ginger Spiced',
    rating: 4.9,
    prepTime: '8 mins',
    description: 'Invigorating hot tea infused with freshly grated root ginger and green cardamom.',
    isCustomizableBeverage: true,
    image: '/assets/kerala-chaya.png'
  },
  {
    id: 'lemon-sulaimani',
    name: 'Lemon Mint Sulaimani Black Tea',
    category: 'Beverages',
    cuisine: 'Beverages',
    price: 35,
    isVeg: true,
    spiceLevel: 'Refreshing Citrus',
    rating: 4.8,
    prepTime: '5 mins',
    description: 'Malabar special spiced black tea infused with fresh lemon juice, crushed mint, and clove.',
    isCustomizableBeverage: true,
    image: '/assets/kerala-chaya.png'
  },
  {
    id: 'espresso-americano',
    name: 'Dark Roasted Espresso / Americano',
    category: 'Beverages',
    cuisine: 'Beverages',
    price: 90,
    isVeg: true,
    spiceLevel: 'Dark Roast',
    rating: 4.7,
    prepTime: '7 mins',
    description: 'Rich freshly pulled double shot arabica espresso topped with smooth crema.',
    isCustomizableBeverage: true,
    image: '/assets/kerala-chaya.png'
  },
  {
    id: 'cold-coffee-icecream',
    name: 'Creamy Cold Coffee with Vanilla Ice Cream',
    category: 'Beverages',
    cuisine: 'Beverages',
    price: 149,
    isVeg: true,
    spiceLevel: 'Chilled Sweet',
    rating: 4.9,
    prepTime: '10 mins',
    description: 'Chilled blended espresso with cold milk, cocoa drizzle, and a scoop of rich vanilla bean ice cream.',
    isCustomizableBeverage: true,
    image: '/assets/kerala-chaya.png'
  },

  // --- FRESH JUICES & SHAKES ---
  {
    id: 'kulukki-sarbath',
    name: 'Mint Lime Kulukki Sarbath',
    category: 'Juices',
    cuisine: 'Juices',
    price: 60,
    isVeg: true,
    spiceLevel: 'Tangy Sweet',
    rating: 4.9,
    prepTime: '5 mins',
    description: 'Famous Kerala shaken kulukki sarbath with fresh green lime, mint, chia seeds, and a hint of green chilli.',
    image: '/assets/fresh-juices.png'
  },
  {
    id: 'elaneer-tender-coconut',
    name: 'Chilled Fresh Tender Coconut Water (Elaneer)',
    category: 'Juices',
    cuisine: 'Juices',
    price: 70,
    isVeg: true,
    spiceLevel: 'Naturally Hydrating',
    rating: 5.0,
    prepTime: '5 mins',
    description: '100% natural chilled tender coconut water served with tender coconut pulp.',
    image: '/assets/fresh-juices.png'
  },
  {
    id: 'avil-milk-shake',
    name: 'Malabar Royal Avil Milk Shake',
    category: 'Juices',
    cuisine: 'Juices',
    price: 120,
    isVeg: true,
    spiceLevel: 'Sweet Crunch',
    rating: 4.9,
    prepTime: '10 mins',
    description: 'Traditional Malabar street drink blended with mashed banana, cold milk, roasted rice flakes (avil), cashews, and ice cream.',
    image: '/assets/fresh-juices.png'
  },
  {
    id: 'watermelon-juice',
    name: 'Fresh Chilled Watermelon Juice',
    category: 'Juices',
    cuisine: 'Juices',
    price: 80,
    isVeg: true,
    spiceLevel: 'Sweet Fresh',
    rating: 4.8,
    prepTime: '5 mins',
    description: 'Pure freshly cold-pressed red watermelon juice served over crushed ice with mint garnish.',
    image: '/assets/fresh-juices.png'
  },
  {
    id: 'mango-milkshake',
    name: 'Alphonso Mango Milkshake with Ice Cream',
    category: 'Juices',
    cuisine: 'Juices',
    price: 130,
    isVeg: true,
    spiceLevel: 'Sweet Mango',
    rating: 4.9,
    prepTime: '8 mins',
    description: 'Thick Alphonso mango pulp blended with whole milk and topped with vanilla ice cream and pistachios.',
    image: '/assets/fresh-juices.png'
  },
  {
    id: 'royal-fruit-falooda',
    name: 'Royal Special Mixed Fruit Falooda',
    category: 'Juices',
    cuisine: 'Juices',
    price: 179,
    isVeg: true,
    spiceLevel: 'Rich Sweet',
    rating: 5.0,
    prepTime: '12 mins',
    description: 'Layered dessert drink with rose syrup, falooda vermicelli, basil seeds, mixed fresh fruits, dry fruits, and double ice cream scoops.',
    image: '/assets/fresh-juices.png'
  },

  // --- ALCOHOL, BAR & SPIRITS (WHISKEY, RUM, VODKA, BRANDY, GIN, BEER) ---
  {
    id: 'jack-daniels-whiskey',
    name: 'Jack Daniel\'s Tennessee Whiskey (Old No. 7)',
    category: 'Alcohol',
    subCategory: 'Whiskey',
    cuisine: 'Alcohol',
    price: 420,
    isVeg: true,
    isCustomizableAlcohol: true,
    spiceLevel: '🥃 40% ABV',
    rating: 5.0,
    prepTime: 'Instant Serve',
    description: 'World-famous charcoal-mellowed Tennessee whiskey with smooth caramel, oak, and vanilla notes. Served with ice, water or soda.',
    image: '/assets/jack-daniels.png'
  },
  {
    id: 'old-monk-dark-rum',
    name: 'Old Monk XXX Very Old Vatted Dark Rum',
    category: 'Alcohol',
    subCategory: 'Rum',
    cuisine: 'Alcohol',
    price: 120,
    isVeg: true,
    isCustomizableAlcohol: true,
    spiceLevel: '🍹 42.8% ABV',
    rating: 5.0,
    prepTime: 'Instant Serve',
    description: 'The iconic legendary Indian dark rum aged 7 years in oak vats. Rich molasses aroma with distinct vanilla, chocolate, and caramel notes.',
    image: '/assets/old-monk.png'
  },
  {
    id: 'bacardi-white-rum',
    name: 'Bacardi Carta Blanca Superior White Rum',
    category: 'Alcohol',
    subCategory: 'Rum',
    cuisine: 'Alcohol',
    price: 220,
    isVeg: true,
    isCustomizableAlcohol: true,
    spiceLevel: '🍹 40% ABV',
    rating: 4.8,
    prepTime: 'Instant Serve',
    description: 'World-renowned light white rum with subtle almond and floral aromas. Ideal neat, with cola, or in mojitos.',
    image: '/assets/bacardi.png'
  },
  {
    id: 'magic-moments-vodka',
    name: 'Magic Moments Remix Premium Grain Vodka',
    category: 'Alcohol',
    subCategory: 'Vodka',
    cuisine: 'Alcohol',
    price: 140,
    isVeg: true,
    isCustomizableAlcohol: true,
    spiceLevel: '🍸 37.5% ABV',
    rating: 4.8,
    prepTime: 'Instant Serve',
    description: 'India\'s favorite triple-distilled grain vodka. Ultra-smooth finish with clean crisp mouthfeel.',
    image: '/assets/magic-moments.png'
  },
  {
    id: 'honey-bee-brandy',
    name: 'Honey Bee Premium Fine Grape Brandy',
    category: 'Alcohol',
    subCategory: 'Brandy',
    cuisine: 'Alcohol',
    price: 130,
    isVeg: true,
    isCustomizableAlcohol: true,
    spiceLevel: '🍷 42.8% ABV',
    rating: 4.8,
    prepTime: 'Instant Serve',
    description: 'Rich and smooth Indian fine grape brandy with warm honey undertones and delicate oak aging.',
    image: '/assets/honey-bee.png'
  },

  // --- POPULAR & LOCAL WHISKEY BRANDS ---
  {
    id: 'royal-challenge-whiskey',
    name: 'Royal Challenge Premium Grain Whiskey',
    category: 'Alcohol',
    subCategory: 'Whiskey',
    cuisine: 'Alcohol',
    price: 160,
    isVeg: true,
    isCustomizableAlcohol: true,
    spiceLevel: '🥃 42.8% ABV',
    rating: 4.7,
    prepTime: 'Instant Serve',
    description: 'Popular Indian blended whiskey combining scotch malts and rich Indian grain spirits. Smooth and easy sipping.',
    image: '/assets/jack-daniels.png'
  },
  {
    id: 'signature-premier-whiskey',
    name: 'Signature Premier Rare Grain Whiskey',
    category: 'Alcohol',
    subCategory: 'Whiskey',
    cuisine: 'Alcohol',
    price: 190,
    isVeg: true,
    isCustomizableAlcohol: true,
    spiceLevel: '🥃 42.8% ABV',
    rating: 4.8,
    prepTime: 'Instant Serve',
    description: 'Masterfully crafted blend of imported Scotch malts and aged Indian grain spirits with subtle peaty finish.',
    image: '/assets/jack-daniels.png'
  },
  {
    id: 'mcdowells-no1-whiskey',
    name: 'McDowell\'s No.1 Reserve Whiskey',
    category: 'Alcohol',
    subCategory: 'Whiskey',
    cuisine: 'Alcohol',
    price: 140,
    isVeg: true,
    isCustomizableAlcohol: true,
    spiceLevel: '🥃 42.8% ABV',
    rating: 4.6,
    prepTime: 'Instant Serve',
    description: 'Classic popular Indian whiskey with smooth oak aroma and rich woody character.',
    image: '/assets/jack-daniels.png'
  },
  {
    id: 'amrut-single-malt',
    name: 'Amrut Indian Single Malt Whiskey',
    category: 'Alcohol',
    subCategory: 'Whiskey',
    cuisine: 'Alcohol',
    price: 550,
    isVeg: true,
    isCustomizableAlcohol: true,
    spiceLevel: '🥃 46% ABV',
    rating: 4.9,
    prepTime: 'Instant Serve',
    description: 'Award-winning world-class Indian single malt whiskey crafted from Himalayan barley with notes of bourbon oak, licorice, and toffee.',
    image: '/assets/jack-daniels.png'
  },

  // --- POPULAR & LOCAL RUMS ---
  {
    id: 'captain-morgan-spiced-rum',
    name: 'Captain Morgan Original Spiced Gold Rum',
    category: 'Alcohol',
    subCategory: 'Rum',
    cuisine: 'Alcohol',
    price: 210,
    isVeg: true,
    isCustomizableAlcohol: true,
    spiceLevel: '🍹 35% ABV',
    rating: 4.8,
    prepTime: 'Instant Serve',
    description: 'Smooth spiced Caribbean rum infused with natural spices and real vanilla flavors.',
    image: '/assets/bacardi.png'
  },

  // --- POPULAR VODKA & GIN BRANDS ---
  {
    id: 'absolut-swedish-vodka',
    name: 'Absolut Swedish Premium Vodka',
    category: 'Alcohol',
    subCategory: 'Vodka',
    cuisine: 'Alcohol',
    price: 380,
    isVeg: true,
    isCustomizableAlcohol: true,
    spiceLevel: '🍸 40% ABV',
    rating: 4.9,
    prepTime: 'Instant Serve',
    description: 'Pure Swedish vodka distilled from winter wheat. Rich, full-bodied, and complex yet smooth.',
    image: '/assets/magic-moments.png'
  },
  {
    id: 'smirnoff-triple-vodka',
    name: 'Smirnoff No. 21 Triple Distilled Vodka',
    category: 'Alcohol',
    subCategory: 'Vodka',
    cuisine: 'Alcohol',
    price: 220,
    isVeg: true,
    isCustomizableAlcohol: true,
    spiceLevel: '🍸 40% ABV',
    rating: 4.7,
    prepTime: 'Instant Serve',
    description: '10-times filtered vodka for maximum clarity and pure smooth taste.',
    image: '/assets/magic-moments.png'
  },
  {
    id: 'blue-riband-gin',
    name: 'Blue Riband Duet London Dry Gin',
    category: 'Alcohol',
    subCategory: 'Gin',
    cuisine: 'Alcohol',
    price: 130,
    isVeg: true,
    isCustomizableAlcohol: true,
    spiceLevel: '🍸 42.8% ABV',
    rating: 4.6,
    prepTime: 'Instant Serve',
    description: 'Classic popular Indian London dry gin distilled with juniper berries, coriander, and citrus peel.',
    image: '/assets/magic-moments.png'
  },
  {
    id: 'bombay-sapphire-gin',
    name: 'Bombay Sapphire Premium London Dry Gin',
    category: 'Alcohol',
    subCategory: 'Gin',
    cuisine: 'Alcohol',
    price: 390,
    isVeg: true,
    isCustomizableAlcohol: true,
    spiceLevel: '🍸 47% ABV',
    rating: 4.9,
    prepTime: 'Instant Serve',
    description: 'Vapour-infused premium gin with 10 exotic botanicals giving bright juniper, citrus, and pepper spice notes.',
    image: '/assets/magic-moments.png'
  },

  // --- BRANDY ---
  {
    id: 'morpheus-xo-brandy',
    name: 'Morpheus XO Premium French Brandy',
    category: 'Alcohol',
    subCategory: 'Brandy',
    cuisine: 'Alcohol',
    price: 240,
    isVeg: true,
    isCustomizableAlcohol: true,
    spiceLevel: '🍷 42.8% ABV',
    rating: 4.9,
    prepTime: 'Instant Serve',
    description: 'Exotic French grape brandy aged in oak casks. Complex velvety texture with dark fruit and caramel aromas.',
    image: '/assets/honey-bee.png'
  },
  {
    id: 'mansion-house-brandy',
    name: 'Mansion House French Grape Brandy',
    category: 'Alcohol',
    subCategory: 'Brandy',
    cuisine: 'Alcohol',
    price: 180,
    isVeg: true,
    isCustomizableAlcohol: true,
    spiceLevel: '🍷 42.8% ABV',
    rating: 4.7,
    prepTime: 'Instant Serve',
    description: 'Popular smooth blended brandy with rich golden amber color and gentle woody character.',
    image: '/assets/honey-bee.png'
  },

  // --- BEER ---
  {
    id: 'kingfisher-premium-beer',
    name: 'Kingfisher Premium Lager Pint (330ml)',
    category: 'Alcohol',
    subCategory: 'Beer',
    cuisine: 'Alcohol',
    price: 190,
    isVeg: true,
    isCustomizableAlcohol: true,
    isBeer: true,
    spiceLevel: '🍺 4.8% ABV',
    rating: 4.8,
    prepTime: 'Chilled Bottle',
    description: 'The King of Good Times! Crisp malt lager brewed from finest malted barley and hops.',
    image: '/assets/beers.png'
  },
  {
    id: 'bira-91-white-beer',
    name: 'Bira 91 White Craft Wheat Pint (330ml)',
    category: 'Alcohol',
    subCategory: 'Beer',
    cuisine: 'Alcohol',
    price: 240,
    isVeg: true,
    isCustomizableAlcohol: true,
    isBeer: true,
    spiceLevel: '🍺 4.7% ABV',
    rating: 4.9,
    prepTime: 'Chilled Bottle',
    description: 'Delicious Belgian style wheat beer brewed with orange peel and coriander seeds. Low bitterness and refreshing citrus aroma.',
    image: '/assets/beers.png'
  },
  {
    id: 'heineken-lager-beer',
    name: 'Heineken Premium Dutch Lager Pint (330ml)',
    category: 'Alcohol',
    subCategory: 'Beer',
    cuisine: 'Alcohol',
    price: 260,
    isVeg: true,
    isCustomizableAlcohol: true,
    isBeer: true,
    spiceLevel: '🍺 5.0% ABV',
    rating: 4.8,
    prepTime: 'Chilled Bottle',
    description: '100% pure malt Dutch lager brewed with unique A-yeast for iconic balanced bitter flavor.',
    image: '/assets/beers.png'
  },
  {
    id: 'british-empire-strong-beer',
    name: 'British Empire Ultra Strong Beer (650ml Bottle)',
    category: 'Alcohol',
    subCategory: 'Beer',
    cuisine: 'Alcohol',
    price: 260,
    isVeg: true,
    isCustomizableAlcohol: true,
    isBeer: true,
    spiceLevel: '🍺 8% ABV Strong',
    rating: 4.7,
    prepTime: 'Chilled Bottle',
    description: 'Popular high-strength malt lager brewed for robust taste and bold punchy finish.',
    image: '/assets/beers.png'
  }
];

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/restaurant';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB.'))
  .catch((error) => console.error('MongoDB connection error:', error));

app.get('/api/menu', (req, res) => {
  const { category, cuisine } = req.query;
  let filtered = menuItems;
  if (category) {
    const catLower = category.toLowerCase();
    
    // Category aliases mapping
    if (['beverages', 'tea_coffee', 'tea', 'coffee', 'chaya'].includes(catLower)) {
      filtered = filtered.filter((item) => item.category === 'Beverages');
    } else if (['juices', 'juice', 'shakes'].includes(catLower)) {
      filtered = filtered.filter((item) => item.category === 'Juices');
    } else if (['local', 'south_indian', 'local_dishes'].includes(catLower)) {
      filtered = filtered.filter((item) => item.category === 'Local');
    } else if (['alcohol', 'bar', 'spirits'].includes(catLower)) {
      filtered = filtered.filter((item) => item.category === 'Alcohol' || item.cuisine === 'Alcohol');
    } else if (['whiskey', 'rum', 'vodka', 'brandy', 'gin', 'beer'].includes(catLower)) {
      filtered = filtered.filter((item) => 
        (item.subCategory && item.subCategory.toLowerCase() === catLower) ||
        (item.category && item.category.toLowerCase() === catLower)
      );
    } else {
      filtered = filtered.filter((item) => 
        (item.category && item.category.toLowerCase() === catLower) ||
        (item.cuisine && item.cuisine.toLowerCase() === catLower)
      );
    }
  }
  if (cuisine) {
    const cuisLower = cuisine.toLowerCase();
    filtered = filtered.filter((item) => item.cuisine && item.cuisine.toLowerCase() === cuisLower);
  }
  res.json(filtered);
});

app.get('/api/menu/:id', (req, res) => {
  const menuItem = menuItems.find((item) => item.id === req.params.id);
  if (!menuItem) {
    return res.status(404).json({ error: 'Menu item not found.' });
  }
  res.json(menuItem);
});

app.get('/api/reservations', async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: 'Unable to load reservations.' });
  }
});

app.post('/api/reservations', async (req, res) => {
  try {
    const reservation = new Reservation(req.body);
    const saved = await reservation.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: 'Invalid reservation data.' });
  }
});

app.delete('/api/reservations/:id', async (req, res) => {
  try {
    await Reservation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Reservation canceled.' });
  } catch (error) {
    res.status(400).json({ error: 'Unable to delete reservation.' });
  }
});

// Payments API Endpoints (Database Storage)
app.get('/api/payments', async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Unable to load payment records.' });
  }
});

app.post('/api/payments', async (req, res) => {
  try {
    const payment = new Payment(req.body);
    const saved = await payment.save();
    console.log(`Payment saved to MongoDB: ${saved.invoiceId} (${saved.paymentMethod}) - ₹${saved.totalAmount}`);
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: 'Invalid payment data.', details: error.message });
  }
});

app.get('/api/payments/:invoiceId', async (req, res) => {
  try {
    const payment = await Payment.findOne({ invoiceId: req.params.invoiceId });
    if (!payment) {
      return res.status(404).json({ error: 'Payment record not found.' });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching payment record.' });
  }
});

// Reviews API Endpoints (MongoDB Storage)
const sampleSeedReviews = [
  {
    name: 'Rahul Sharma',
    rating: 5,
    recommendedDish: 'Hyderabadi Chicken Dum Biryani',
    comment: 'Absolute perfection! The dum biryani was rich, aromatic, and cooked to perfection. Loved the ambient dark lounge setting as well.',
    createdAt: new Date('2026-08-01')
  },
  {
    name: 'Ananya Verma',
    rating: 5,
    recommendedDish: 'Al Faham Chicken Mandhi',
    comment: 'The Al Faham Mandhi is unbelievable! Soft tender chicken with fragrant saffron rice and creamy garlic toum dip. Must visit place!',
    createdAt: new Date('2026-08-05')
  },
  {
    name: 'Vikram Menon',
    rating: 4,
    recommendedDish: 'Truffle Mushroom Risotto',
    comment: 'Top-tier gourmet Western cuisine in Marthandam! Extremely creamy truffle risotto and prompt service.',
    createdAt: new Date('2026-08-08')
  }
];

app.get('/api/reviews', async (req, res) => {
  try {
    let reviews = await Review.find().sort({ createdAt: -1 });
    // If database is empty, seed initial sample reviews
    if (reviews.length === 0) {
      reviews = await Review.insertMany(sampleSeedReviews);
    }
    res.json(reviews);
  } catch (error) {
    // Fallback if MongoDB is offline
    res.json(sampleSeedReviews);
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const { name, rating, recommendedDish, comment } = req.body;
    if (!name || !rating || !comment) {
      return res.status(400).json({ error: 'Name, rating, and review text are required.' });
    }

    const review = new Review({
      name,
      rating: Number(rating),
      recommendedDish: recommendedDish || 'Hyderabadi Chicken Dum Biryani',
      comment
    });

    const saved = await review.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: 'Failed to submit review.', details: error.message });
  }
});

app.get('/checkout', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'checkout.html'));
});

app.get('/reservations', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'reservations.html'));
});

app.get('/category', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'category.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
