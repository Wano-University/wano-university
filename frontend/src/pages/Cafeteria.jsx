import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Utensils, X, Loader2, HelpCircle } from "lucide-react";
import { Link } from 'react-router-dom';
import { getActiveMenu } from '../lib/menu'; 

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const DAYS_OF_WEEK = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"     
];

const getImageUrl = (path) => {
  if (!path) return '';
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const cleanApi = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
  return `${cleanApi}/${cleanPath}`;
};

const getDishThemeStyles = (dish, isSelected) => {
  if (!dish) return 'bg-card text-card-foreground border-border';
  
  const themeKey = dish.color?.toLowerCase().trim() || '';
  const validThemes = ['nika', 'surgeon', 'fire', 'ohara', 'tanuki', 'meat', 'swordsman', 'chef', 'navigator', 'ramen'];
  
  if (validThemes.includes(themeKey)) {
    if (isSelected) {
      return `bg-${themeKey} text-white border-${themeKey} shadow-lg shadow-${themeKey}/20 scale-[1.02] translate-x-1`;
    }
    return `bg-${themeKey}/10 dark:bg-${themeKey}/15 border-${themeKey}/40 text-foreground hover:bg-${themeKey}/20 hover:border-${themeKey}`;
  }

  if (isSelected) {
    return 'bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02] translate-x-1';
  }
  return 'bg-card text-card-foreground border-border hover:shadow-xl hover:bg-primary/5 hover:border-primary/30';
};

export default function Cafeteria() {
  const [activeTab, setActiveTab] = useState('meals');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuData, setMenuData] = useState({ meals: {}, desserts: {} });
  const [isLoading, setIsLoading] = useState(true);

  const [selectedDay, setSelectedDay] = useState(() => {
    const currentDayIndex = new Date().getDay();
    return currentDayIndex === 0 || currentDayIndex === 6 ? "Monday" : DAYS_OF_WEEK[currentDayIndex];
  });

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await getActiveMenu();
        
        const formattedMenu = { meals: {}, desserts: {} };
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
        
        let mealIndex = 0;
        let dessertIndex = 0;

        if (data && Array.isArray(data)) {
          data.forEach(dish => {
            if (dish.dishType === 'DESSERT' && dessertIndex < 5) {
              formattedMenu.desserts[days[dessertIndex]] = dish;
              dessertIndex++;
            } else if (dish.dishType !== 'DESSERT' && mealIndex < 5) {
              formattedMenu.meals[days[mealIndex]] = dish;
              mealIndex++;
            }
          });
        }

        setMenuData(formattedMenu);
      } catch (error) {
        console.error("Error loading cafeteria menu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const currentDish = menuData[activeTab]?.[selectedDay];

  const displayDish = currentDish || {
    title: "No Dish Scheduled",
    subtitle: "Chef is on break",
    desc: "There is nothing scheduled for this slot yet. Check back later!",
    image: null,
    color: "bg-muted/20 border-dashed border-border text-muted-foreground"
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium animate-pulse">Loading today's specials...</p>
      </div>
    );
  }

  return (
    <section className="py-24 max-w-7xl mx-auto px-6 space-y-6 bg-background font-sans relative">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-2xl font-bold text-primary tracking-tight">Grand Line Refectory Menu</h4>
            <h2 className="text-xs text-muted-foreground">Check the plates of the week!</h2>
          </div>
        </div>

        <div className="flex justify-end">
          <Link 
            to="/menuconfig"
            className="text-xs font-bold uppercase tracking-widest bg-primary text-primary-foreground px-4 py-2 rounded-full hover:shadow-xl hover:bg-primary/90 transition-all inline-block"
          >
            Edit menu
          </Link>
        </div>

        <div className="bg-muted p-1 rounded-xl flex gap-1 border border-border">
          <button
            onClick={() => { setActiveTab('meals'); }}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'meals' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          > Meals
          </button>
          <button
            onClick={() => { setActiveTab('desserts'); }}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'desserts' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          > Desserts
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        
        {/* Left thingy */}
        <Card className={`md:col-span-3 p-8 border transition-all duration-300 shadow-xl rounded-4xl flex flex-col md:flex-row items-center gap-8 ${
                   `${displayDish.color} hover:shadow-md`
        }`}>
          <div 
            onClick={() => displayDish.image && setIsModalOpen(true)}
            className={`w-56 h-56 md:w-64 md:h-64 rounded-full overflow-hidden shadow-2xl border-4 border-${displayDish.color} shrink-0 bg-background backdrop-blur-sm transition-transform duration-500 flex items-center justify-center p-2 ${displayDish.image ? 'hover:rotate-12 cursor-pointer' : ''}`}
          >
            {displayDish.image ? (
              <img 
                src={getImageUrl(displayDish.image)} 
                alt={displayDish.title}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <HelpCircle className="w-16 h-16 text-muted-foreground opacity-40" />
            )}
          </div>

          <div className="space-y-3 text-center md:text-left flex-1">
            <span className="text-xs uppercase font-extrabold tracking-widest bg-primary/10 text-primary px-2.5 py-1 rounded-full border border-primary/20 inline-block">
              {selectedDay} {activeTab === 'meals' ? 'Meal' : 'Dessert'}!
            </span>
            <div>
              <h2 className="text-3xl font-black tracking-tight text-foreground">{displayDish.title}</h2>
              <p className="text-sm font-medium text-muted-foreground italic mt-0.5">{displayDish.subtitle}</p>
            </div>
            <p className="text-sm font-medium leading-relaxed text-foreground/80 pt-2 border-t border-border">
              {displayDish.desc}
            </p>
          </div>
        </Card>

        {/* Right thingy */}
        <div className="md:col-span-2 flex flex-col gap-3">
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => {
            const dayDish = menuData[activeTab]?.[day];
            const isSelected = selectedDay === day;
            const isEmpty = !dayDish;

            const displayTitle = dayDish ? dayDish.title : "Empty Slot";
            const displaySubtitle = dayDish ? dayDish.subtitle : "TBD";

            return (
              <div
                key={day}
                onMouseEnter={() => setSelectedDay(day)}
                className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 ${
                  isEmpty 
                    ? 'border-dashed border-border bg-muted/20 text-muted-foreground' 
                    : getDishThemeStyles(dayDish, isSelected)
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className={`w-11 h-11 rounded-full overflow-hidden border shrink-0 flex items-center justify-center p-0.5 ${isEmpty ? 'bg-muted border-dashed border-muted-foreground/30' : 'bg-white border-border'}`}>
                    {dayDish?.image ? (
                      <img 
                        src={getImageUrl(dayDish.image)} 
                        alt="" 
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <HelpCircle className="w-5 h-5 text-muted-foreground opacity-40" />
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <span className={`text-xs font-bold block ${isSelected ? 'text-inherit opacity-80' : 'text-primary'}`}>
                      {day}
                    </span>
                    <strong className="text-sm block truncate tracking-tight text-inherit">
                      {displayTitle}
                    </strong>
                  </div>
                </div>
                
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md hidden sm:inline-block ${
                  isSelected 
                    ? 'bg-primary-foreground/20 text-primary-foreground' 
                    : isEmpty 
                      ? 'bg-transparent text-muted-foreground'
                      : 'bg-muted text-muted-foreground'
                }`}>
                  {(displaySubtitle || '').split(' ')[0] || 'TBD'}
                </span>
              </div>
            );
          })}

          <button 
            onClick={() => !displayDish.image ? null : setIsModalOpen(true)}
            disabled={!displayDish.image}
            className="w-full mt-2 py-4 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-bold rounded-2xl shadow-lg transition-all active:scale-[0.99] cursor-pointer"
          >
            {displayDish.image ? 'BUY TICKETS' : 'NOT AVAILABLE'}
          </button>
        </div>
      </div>

      {/* Ticket purchase */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-muted-foreground/40 backdrop-blur-sm p-4">
          <div className="bg-card text-card-foreground w-full max-w-md p-6 rounded-3xl shadow-2xl relative border-2 border-border">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center space-y-4 pt-4">
              <div className="mx-auto w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20 bg-primary-foreground p-1 flex items-center justify-center">
                {displayDish.image && (
                  <img 
                    src={getImageUrl(displayDish.image)} 
                    alt={displayDish.title}
                    className="w-full h-full object-cover rounded-full"
                  />
                )}
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight text-foreground">{displayDish.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">Confirm your ticket for {selectedDay}'s {activeTab === 'meals' ? 'meal' : 'dessert'}.</p>
              </div>
              
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-full py-3 mt-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-md transition-all active:scale-[0.99]"
              >
                Confirm Purchase
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}