import React, { useState } from 'react';
import { Pencil, Utensils } from "lucide-react";
import { Link } from 'react-router-dom';

const INITIAL_MENU_DATA = {
  meals: {
    Monday: {
      title: "Pirate King's Meal",
      subtitle: "Captain's Grand Feast",
      desc: "A massive, slow-roasted bone-in cut glazed in a sticky, savory sauce—bold, messy, and made for a true pirate feast.",
      image: "/MondayMeal.png", 
      color: "text-meat border-meat bg-meat/5"
    },
    Tuesday: {
      title: "Oni Giri Steak Platter",
      subtitle: "Warrior's Plate",
      desc: "A hearty cut of grilled protein served with rice and bold garlic-soy flavors—simple, powerful, and built for a swordsman's strength.",
      image: "/TuesdayMeal.png",
      color: "text-swordsman border-swordsman bg-swordsman/5"
    },
    Wednesday: {
      title: "Black Leg Étoile",
      subtitle: "Chef's Lemon Butter Symphony",
      desc: "Delicately seared seafood finished in a light lemon butter sauce—refined, elegant, and crafted with a chef's precision.",
      image: "/WednesdayMeal.png",
      color: "text-chef border-chef bg-chef/5"
    },
    Thursday: {
      title: "Cat Burglar's Citrus Catch",
      subtitle: "Navigator's Tangerine Treasure",
      desc: "Fresh fish marinated in bright citrus with delicate herbs—light, vibrant, and as sharp as a navigator's instincts.",
      image: "/ThursdayMeal.png",
      color: "text-navigator border-navigator bg-navigator/5"
    },
    Friday: {
      title: "Ohara Noir Ramen",
      subtitle: "Archaeologist's Ink",
      desc: "Dark squid ink broth with tender seafood and earthy notes—mysterious, refined, and steeped in hidden history.",
      image: "/FridayMeal.jpg",
      color: "text-ramen border-ramen bg-ramen/5"
    }
  },
  desserts: {
    Monday: {
      title: "Hito Hito no mi: Model Nika",
      subtitle: "Stretchy Sweetness",
      desc: "Elastic sweet rice dough stuffed with fresh purple yam ice cream.",
      image: "/MondayDessert.png",
      color: "text-nika border-nika bg-nika/5"
    },
    Tuesday: {
      title: "Ope Ope no mi: Surgeon of Death",
      subtitle: "Surgeon of Death Sweet",
      desc: "Heart-shaped smooth taro pudding base—cuttingly sweet and precisely layered.",
      image: "/TuesdayDessert.jpg",
      color: "text-surgeon border-surgeon bg-surgeon/5"
    },
    Wednesday: {
      title: "Mera Mera no mi: Fire Fist",
      subtitle: "Spade Captain Treat",
      desc: "A rich, classic custard base topped with a perfectly caramelized, crackling burnt-sugar shell that is torched to fiery perfection.",
      image: "/WednesdayDessert.jpg",
      color: "text-fire border-fire bg-fire/5"
    },
    Thursday: {
      title: "Hana Hana no mi: Devil Child",
      subtitle: "Blooming Pastry",
      desc: "Flaky layers of puff pastry blooming with vibrant strawberry slices and light white chocolate cream—mysterious, elegant, and refined.",
      image: "/ThursdayDessert.jpg",
      color: "text-ohara border-ohara bg-ohara/5"
    },
    Friday: {
      title: "Hito Hito no mi: Tanuki",
      subtitle: "Cotton Candy Delight",
      desc: "Rice cake stuffed with a sweet, fluffy berry marshmallow cream center—built to boost your energy levels.",
      image: "/FridayDessert.png",
      color: "text-tanuki border-tanuki bg-tanuki/5"
    }
  }
};

export default function CafeteriaConfig() {
  const [activeTab, setActiveTab] = useState('meals');
  const [menuData, setMenuData] = useState(INITIAL_MENU_DATA);
  const [editingDay, setEditingDay] = useState(null);

  const handleSelectNewDish = (dishDetails) => {
    setMenuData(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [editingDay]: { ...dishDetails }
      }
    }));
    setEditingDay(null);
  };

  return (
    <section className="py-24 max-w-7xl mx-auto px-6 space-y-6 bg-background font-sans relative">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-2xl font-bold text-primary tracking-tight">Grand Line Refectory Menu</h4>
            <h2 className="text-xs text-muted-foreground">Configure plates of the week.</h2>
          </div>
        </div>

        <div className="flex justify-end">
          <Link 
            to="/cafeteria"
            className="text-xs font-bold uppercase tracking-widest bg-primary text-primary-foreground px-4 py-2 rounded-full hover:shadow-xl hover:bg-primary/20 hover:border-primary/30 inline-block"
          >
            Finish Editing
          </Link>
        </div>

        <div className="bg-muted p-1 rounded-xl flex gap-1 border border-border">
          <button
            onClick={() => setActiveTab('meals')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'meals' 
                ? 'bg-card text-primary shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          > 
            Meals
          </button>
          <button
            onClick={() => setActiveTab('desserts')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'desserts' 
                ? 'bg-card text-primary shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          > 
            Desserts
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-5 flex flex-col gap-3">
          {Object.keys(menuData[activeTab]).map((day) => {
            const dayDish = menuData[activeTab][day];

            return (
              <div
                key={day}
                className="p-3.5 rounded-2xl border border-border bg-card text-card-foreground flex items-center justify-between gap-4 transition-shadow hover:shadow-md"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-11 h-11 rounded-full overflow-hidden border border-border bg-muted flex-shrink-0 flex items-center justify-center p-0.5 bg-white">
                    <img 
                      src={dayDish.image} 
                      alt="" 
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-xs font-bold block text-primary">
                      {day}
                    </span>
                    <strong className="text-sm block truncate tracking-tight">{dayDish.title}</strong>
                  </div>
                </div>
                
                <button
                  onClick={() => setEditingDay(day)}
                  className="p-2 rounded-xl transition-all cursor-pointer bg-muted text-primary border border-border hover:bg-primary/10 hover:scale-105 active:scale-95"
                  title={`Edit ${day}'s selection`}
                >
                  <Pencil className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dish Catalog Picker Modal */}
      {editingDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-card text-card-foreground w-full max-w-lg p-6 rounded-3xl shadow-2xl relative border border-border flex flex-col max-h-[85vh]">
            <div className="mb-4">
              <h3 className="text-xl font-black tracking-tight">Select Dish for {editingDay}</h3>
              <p className="text-xs text-muted-foreground">Choose an alternative dish from the registered {activeTab} pool.</p>
            </div>

            <div className="overflow-y-auto space-y-2 pr-1 flex-1">
              {Object.keys(INITIAL_MENU_DATA[activeTab]).map((poolKey) => {
                const catalogItem = INITIAL_MENU_DATA[activeTab][poolKey];
                return (
                  <div
                    key={poolKey}
                    onClick={() => handleSelectNewDish(catalogItem)}
                    className="p-3 border border-border rounded-xl flex items-center gap-4 bg-muted/30 hover:bg-primary/10 hover:border-primary/30 transition-all cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-border bg-white p-0.5 flex-shrink-0">
                      <img src={catalogItem.image} alt="" className="w-full h-full object-contain rounded-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-bold truncate group-hover:text-primary transition-colors">{catalogItem.title}</h5>
                      <p className="text-xs text-muted-foreground truncate">{catalogItem.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setEditingDay(null)}
              className="w-full mt-4 py-2.5 bg-muted hover:bg-muted/80 text-foreground font-semibold rounded-xl text-sm transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}