import React, { useState } from 'react';
import { CarFront } from "lucide-react"
import { Utensils } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const DAYS_OF_WEEK = [
  "Friday",    
  "Monday",    
  "Tuesday",   
  "Wednesday", 
  "Thursday",  
  "Friday",    
  "Friday"     
];

export default function Cafeteria() {
  const [activeTab, setActiveTab] = useState('meals');
  const navigate = useNavigate();

  // Idk if this works tbh
  const [selectedDay, setSelectedDay] = useState(() => {
    const currentDayIndex = new Date().getDay();
    return DAYS_OF_WEEK[currentDayIndex];
  });

  const menuData = {
    meals: {
      Monday: {
        title: "Pirate King's Meat",
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
        color:"text-ramen border-ramen bg-ramen/5"
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

  const currentDish = menuData[activeTab][selectedDay] || menuData[activeTab]['Monday'];

  return (
    <section className="py-24 max-w-7xl mx-auto px-6 space-y-6 bg-background font-sans">
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
          <button 
            onClick={() => navigate('/cafeteria')}
            className="text-xs font-bold uppercase tracking-widest bg-primary text-primary-foreground px-4 py-2 rounded-full hover:shadow-xl hover:bg-primary/20 hover:border-primary/30"
          > Finish Editing
          </button>
        </div>

        <div className="bg-muted p-1 rounded-xl flex gap-1 border border-border">
          <button
            onClick={() => { setActiveTab('meals'); setSelectedDay(DAYS_OF_WEEK[new Date().getDay()]); }}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'meals' 
                ? 'bg-card text-primary shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          > Meals
          </button>
          <button
            onClick={() => { setActiveTab('desserts'); setSelectedDay(DAYS_OF_WEEK[new Date().getDay()]); }}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'desserts' 
                ? 'bg-card text-primary shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          > Desserts
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        


        {/* Right thingy*/}
        <div className="md:col-span-5 flex flex-col gap-3">
          {Object.keys(menuData[activeTab]).map((day) => {
            const dayDish = menuData[activeTab][day];
            const isSelected = selectedDay === day;

            return (
              <div
                key={day}
                onMouseEnter={() => setSelectedDay(day)}
                className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer hover:shadow-xl hover:bg-primary/20 hover:border-primary/30 flex items-center justify-between gap-4 ${
                  isSelected
                    ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02] translate-x-1'
                    : 'bg-card text-card-foreground border-border hover:shadow-xl hover:bg-primary/20 hover:border-primary/30'
                }`}
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
                    <span className={`text-xs font-bold block ${isSelected ? 'text-primary-foreground/80' : 'text-primary'}`}>
                      {day}
                    </span>
                    <strong className="text-sm block truncate tracking-tight">{dayDish.title}</strong>
                  </div>
                </div>
                
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md hidden sm:inline-block ${
                  isSelected ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  <CarFront className="w-6 h-6 text-primary" />
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}