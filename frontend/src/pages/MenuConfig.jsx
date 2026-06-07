import React, { useState, useEffect } from 'react';
import { Pencil, Utensils, Plus, PlusCircle, Image as ImageIcon, Palette, FileText, Type, Check, X, HelpCircle, Trash2, Save } from "lucide-react";
import { Link } from 'react-router-dom';
import { getAllDishes, createDish, updateDishAPI, deleteDishAPI } from '../lib/dish';
import { getActiveMenu, updateActiveMenu } from '../lib/menu';
import { useTranslation } from "react-i18next";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const THEME_OPTIONS = [
  { id: 'nika', label: 'Pink' },
  { id: 'surgeon', label: 'Light blue' },
  { id: 'fire', label: 'Dark orange' },
  { id: 'ohara', label: 'Dark purple' },
  { id: 'tanuki', label: 'Light green' },
  { id: 'meat', label: 'Red' },
  { id: 'swordsman', label: 'Dark green' },
  { id: 'chef', label: 'Dark blue' },
  { id: 'navigator', label: 'Light orange' },
  { id: 'ramen', label: 'Light purple' }
];

const TAILWIND_GENERATION_SAFELIST = [
  'text-nika', 'border-nika', 'bg-nika/5',
  'text-surgeon', 'border-surgeon', 'bg-surgeon/5',
  'text-fire', 'border-fire', 'bg-fire/5',
  'text-ohara', 'border-ohara', 'bg-ohara/5',
  'text-tanuki', 'border-tanuki', 'bg-tanuki/5',
  'text-meat', 'border-meat', 'bg-meat/5',
  'text-swordsman', 'border-swordsman', 'bg-swordsman/5',
  'text-chef', 'border-chef', 'bg-chef/5',
  'text-navigator', 'border-navigator', 'bg-navigator/5',
  'text-ramen', 'border-ramen', 'bg-ramen/5'
];

const EMPTY_SLOT = {
  title: "Empty Slot",
  subtitle: "Click the pencil to assign a dish",
  image: "",
  color: "text-muted-foreground border-dashed border-border bg-muted/10",
  isEmpty: true
};

const INITIAL_MENU_DATA = {
  meals: {
    Monday: { ...EMPTY_SLOT },
    Tuesday: { ...EMPTY_SLOT },
    Wednesday: { ...EMPTY_SLOT },
    Thursday: { ...EMPTY_SLOT },
    Friday: { ...EMPTY_SLOT }
  },
  desserts: {
    Monday: { ...EMPTY_SLOT },
    Tuesday: { ...EMPTY_SLOT },
    Wednesday: { ...EMPTY_SLOT },
    Thursday: { ...EMPTY_SLOT },
    Friday: { ...EMPTY_SLOT }
  }
};

export default function MenuConfig() {
  const [activeTab, setActiveTab] = useState('meals');
  const [menuData, setMenuData] = useState(INITIAL_MENU_DATA);
  const [dishPool, setDishPool] = useState({ meals: {}, desserts: {} });
  const [editingDay, setEditingDay] = useState(null);
  const [dishModalState, setDishModalState] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const catalogData = await getAllDishes();
      const sortedPool = { meals: {}, desserts: {} };

      catalogData.forEach(dish => {
        const category = dish.dishType === 'DESSERT' ? 'desserts' : 'meals';
        sortedPool[category][dish.id] = dish;
      });
      setDishPool(sortedPool);

      const activeMenuData = await getActiveMenu();
      if (activeMenuData && activeMenuData.schedule && activeMenuData.dishes) {
        let loadedMenuData = JSON.parse(JSON.stringify(INITIAL_MENU_DATA));
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

        days.forEach(day => {
          const dayIds = activeMenuData.schedule[day];
          if (dayIds) {
            if (dayIds.mealId) {
              const mealDish = activeMenuData.dishes.find(d => d.id === dayIds.mealId);
              if (mealDish) loadedMenuData.meals[day] = { ...mealDish, isEmpty: false };
            }
            if (dayIds.dessertId) {
              const dessertDish = activeMenuData.dishes.find(d => d.id === dayIds.dessertId);
              if (dessertDish) loadedMenuData.desserts[day] = { ...dessertDish, isEmpty: false };
            }
          }
        });
        setMenuData(loadedMenuData);
      }
    } catch (error) {
      console.error("Failed to load inventory or active menu data:", error);
    }
  };

  const handleSelectNewDish = (dishDetails) => {
    setMenuData(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [editingDay]: { ...dishDetails, isEmpty: dishDetails.isEmpty || false }
      }
    }));
    setEditingDay(null);
  };

  const handleSaveMenuSchedule = async () => {
    setIsSaving(true);
    try {
      const assignedIds = [];
      const schedule = {};
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

      days.forEach(day => {
        schedule[day] = { mealId: null, dessertId: null };

        const meal = menuData.meals[day];
        if (!meal.isEmpty && meal.id) {
          assignedIds.push(meal.id);
          schedule[day].mealId = meal.id;
        }

        const dessert = menuData.desserts[day];
        if (!dessert.isEmpty && dessert.id) {
          assignedIds.push(dessert.id);
          schedule[day].dessertId = dessert.id;
        }
      });

      const uniqueAssignedIds = [...new Set(assignedIds)];

      await updateActiveMenu(uniqueAssignedIds, schedule);
      alert("Schedule saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to save schedule.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDish = async (formData, editId) => {
    try {
      let savedDish;
      if (editId) {
        savedDish = await updateDishAPI(editId, formData);
      } else {
        savedDish = await createDish(formData);
      }

      const category = savedDish.dishType === 'DESSERT' ? 'desserts' : 'meals';

      setDishPool(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [savedDish.id]: savedDish
        }
      }));

      setDishModalState(false);
      await loadData();
    } catch (error) {
      console.error("Failed to save dish:", error);
      alert("Failed to save dish to database.");
    }
  };

  const handleDeleteDish = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to completely remove this dish from the database?")) return;

    try {
      await deleteDishAPI(id);

      const updatedPool = { ...dishPool };
      delete updatedPool[activeTab][id];
      setDishPool(updatedPool);

      await loadData();
    } catch (error) {
      console.error("Failed to delete dish:", error);
      alert("Failed to delete dish.");
    }
  };

  return (
    <section className="py-24 max-w-7xl mx-auto px-6 space-y-6 bg-background font-sans relative">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-2xl font-bold text-primary tracking-tight">{t('MenuConfigTitle')}</h4>
            <h2 className="text-xs text-muted-foreground">{t('MenuConfigDesc')}</h2>
          </div>
        </div>

        {/* Admin buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleSaveMenuSchedule}
            disabled={isSaving}
            className="text-xs font-bold uppercase tracking-widest bg-secondary text-secondary-foreground px-6 py-2.5 rounded-full hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Schedule'}
          </button>
          <Link
            to="/cafeteria"
            className="text-xs font-bold uppercase tracking-widest bg-primary text-primary-foreground px-6 py-2.5 rounded-full hover:shadow-xl hover:bg-primary/90 transition-all inline-block"
          >
            {t('MenuConfigY')}
          </Link>
        </div>

        {/* Change between tabs */}
        <div className="bg-muted p-1 rounded-xl flex gap-1 border border-border">
          <button
            onClick={() => setActiveTab('meals')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'meals' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground cursor-pointer'}`}
          >
            {t('MenuConfigMeals')}
          </button>
          <button
            onClick={() => setActiveTab('desserts')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'desserts' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground cursor-pointer'}`}
          >
            {t('MenuConfigDesserts')}
          </button>
        </div>
      </div>

      {/* Dish set up */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-5 flex flex-col gap-3">
          {Object.keys(menuData[activeTab]).map((day) => {
            const dayDish = menuData[activeTab][day];
            const isSlotEmpty = dayDish.isEmpty;

            return (
              <div
                key={day}
                className={`p-3.5 rounded-2xl border flex items-center justify-between gap-4 transition-shadow ${isSlotEmpty
                  ? 'border-dashed border-border bg-muted/20 text-muted-foreground'
                  : `${dayDish.color} hover:shadow-md`
                  }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className={`w-11 h-11 rounded-full overflow-hidden border shrink-0 flex items-center justify-center p-0.5 ${isSlotEmpty ? 'border-dashed border-muted-foreground/30 bg-muted/40' : 'border-current bg-primary-foreground'
                    }`}>
                    {dayDish.image ? (
                      <img src={`${API_URL}${dayDish.image}`} alt="" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <HelpCircle className="w-5 h-5 text-muted-foreground opacity-50" />
                    )}
                  </div>

                  <div className="overflow-hidden">
                    <span className="text-xs font-bold block text-muted-foreground">{day}</span>
                    <strong className="text-sm block truncate tracking-tight text-foreground">{dayDish.title}</strong>
                  </div>
                </div>

                <button
                  onClick={() => setEditingDay(day)}
                  className="p-2 rounded-xl transition-all cursor-pointer bg-primary-foreground/80 border border-border text-muted-foreground hover:text-foreground hover:shadow-sm hover:scale-105 active:scale-95"
                  title={`Edit ${day}'s selection`}
                >
                  <Pencil className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Select dish inventory */}
      {editingDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4">
          <div className="bg-card text-card-foreground w-full max-w-lg p-6 rounded-3xl shadow-2xl relative border border-border flex flex-col max-h-[85vh]">
            <div className="mb-4 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-black tracking-tight">{t('MenuConfigDishSelect')} {editingDay}</h3>
                <p className="text-xs text-muted-foreground">{t('MenuConfigAltDishSelect')} {activeTab} {t('MenuConfigAltDishCollect')}</p>
              </div>

              <button
                onClick={() => setDishModalState(null)}
                className="text-xs font-bold uppercase tracking-widest bg-primary text-primary-foreground px-3 py-2 rounded-xl hover:bg-primary/90 transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> {t('MenuConfigNewDish')}
              </button>
            </div>

            <div className="overflow-y-auto space-y-2 pr-1 flex-1">
              <div
                onClick={() => handleSelectNewDish(EMPTY_SLOT)}
                className="p-3 border border-dashed border-border rounded-xl flex items-center gap-4 bg-muted/10 hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive transition-all cursor-pointer text-muted-foreground group"
              >
                <div className="w-12 h-12 rounded-full border border-dashed border-current flex items-center justify-center bg-transparent shrink-0 transition-colors">
                  <X className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-sm font-bold truncate transition-colors">{t('MenuConfigClear')}</h5>
                  <p className="text-xs truncate">{t('MenuConfigLeave')} {editingDay} {t('MenuConfigUnassigned')}</p>
                </div>
              </div>

              {/* Selects dish */}
              {Object.keys(dishPool[activeTab] || {}).map((poolKey) => {
                const catalogItem = dishPool[activeTab][poolKey];
                return (
                  <div
                    key={poolKey}
                    onClick={() => handleSelectNewDish(catalogItem)}
                    className="p-3 border border-border rounded-xl flex items-center justify-between gap-4 bg-muted/30 hover:bg-primary/10 hover:border-foreground/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4 overflow-hidden min-w-0 flex-1">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-border bg-primary-foreground p-0.5 shrink-0">
                        <img src={`${API_URL}${catalogItem.image}`} alt="" className="w-full h-full object-cover rounded-full" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-bold truncate group-hover:text-primary transition-colors">{catalogItem.title}</h5>
                        <p className="text-xs text-muted-foreground truncate">{catalogItem.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex gap-1.5 shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); setDishModalState(catalogItem); }}
                        className="p-1.5 bg-background text-muted-foreground rounded-lg hover:text-primary border border-border transition-colors cursor-pointer"
                        title="Edit dish."
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteDish(e, catalogItem.id)}
                        className="p-1.5 bg-background text-muted-foreground rounded-lg hover:text-destructive border border-border transition-colors cursor-pointer"
                        title="Delete dish permanently."
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {Object.keys(dishPool[activeTab] || {}).length === 0 && (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  {t('MenuConfigNo')} {activeTab} {t('MenuConfigInv')}
                </div>
              )}
            </div>

            <button
              onClick={() => setEditingDay(null)}
              className="w-full mt-4 py-2.5 bg-muted hover:bg-muted/80 text-foreground font-semibold rounded-xl text-sm transition-all cursor-pointer"
            >
              {t('MenuConfigCancel')}
            </button>
          </div>
        </div>
      )}

      {dishModalState !== false && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4">
          <DishForm
            onClose={() => setDishModalState(false)}
            onSave={handleSaveDish}
            activeTab={activeTab}
            initialData={dishModalState !== null ? dishModalState : null}
          />
        </div>
      )}
    </section>
  );
}

function DishForm({ onClose, onSave, activeTab, initialData }) {
  const { t } = useTranslation();
  const isEditing = !!initialData;

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const textColor = formData.get('selTextColor');
    const borderColor = formData.get('selBorderColor');
    const bgColor = formData.get('selBgColor');

    const finalColorString = `text-${textColor} border-${borderColor} bg-${bgColor}/5`;

    formData.delete('selTextColor');
    formData.delete('selBorderColor');
    formData.delete('selBgColor');

    formData.set('color', finalColorString);
    formData.set('dishType', activeTab === 'desserts' ? 'DESSERT' : 'MEAL');
    formData.set('isActive', e.target.isActive.checked ? 'true' : 'false');

    onSave(formData, isEditing ? initialData.id : null);
  };

  const getExtractedColors = () => {
    if (!initialData || !initialData.color) return { text: 'meat', border: 'meat', bg: 'meat' };
    const segments = initialData.color.split(' ');
    const text = segments.find(s => s.startsWith('text-'))?.split('-')[1] || 'meat';
    const border = segments.find(s => s.startsWith('border-'))?.split('-')[1] || 'meat';
    const bg = segments.find(s => s.startsWith('bg-'))?.split('-')[1]?.split('/')[0] || 'meat';
    return { text, border, bg };
  };

  const currentThemeColors = getExtractedColors();

  return (
    <div className="bg-card text-card-foreground w-full max-w-lg p-6 rounded-3xl shadow-2xl border border-border flex flex-col relative font-sans max-h-[90vh] overflow-y-auto z-50">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 text-primary mb-1">
            <PlusCircle className="w-5 h-5" />
            <h3 className="text-xl font-black tracking-tight">{isEditing ? 'Edit Existing' : 'Add New'} {activeTab === 'meals' ? 'Meal' : 'Dessert'}</h3>
          </div>
          <p className="text-xs text-muted-foreground">{t('MenuConfigExpand')} {activeTab} {t('MenuConfigInvPool')}.</p>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-xl bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-primary flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5" /> {t('MenuConfigDishTitle')}:
          </label>
          <input name="title" type="text" defaultValue={initialData?.title || ""} required className="w-full bg-muted/40 border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all" />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-primary flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5" /> {t('MenuConfigDishSubtitle')}:
          </label>
          <input name="subtitle" type="text" defaultValue={initialData?.subtitle || ""} required className="w-full bg-muted/40 border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all" />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-primary flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" /> {t('MenuConfigDishDesc')}:
          </label>
          <textarea name="desc" defaultValue={initialData?.desc || ""} required rows={2} className="w-full bg-muted/40 border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all resize-none" />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-primary flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5" /> {t('MenuConfigDishImg')}:
          </label>
          <input type="file" name="image" accept="image/*" required={!isEditing} className="w-full bg-muted/40 border border-border rounded-xl px-4 py-2 text-sm file:mr-4 file:cursor-pointer file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" />
          {isEditing && <p className="text-[10px] text-muted-foreground px-1 mt-1">{t('MenuConfigDishImgText')}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-primary flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5" /> {t('MenuConfigDishTheme')}:
          </label>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1 text-[11px] font-semibold text-muted-foreground">
              Text
              <select name="selTextColor" defaultValue={currentThemeColors.text} required className="w-full bg-muted/40 border border-border rounded-xl px-2 py-2 text-sm focus:outline-none focus:border-primary text-foreground cursor-pointer">
                {THEME_OPTIONS.map(opt => <option key={`text-${opt.id}`} value={opt.id}>{opt.label}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1 text-[11px] font-semibold text-muted-foreground">
              Border
              <select name="selBorderColor" defaultValue={currentThemeColors.border} required className="w-full bg-muted/40 border border-border rounded-xl px-2 py-2 text-sm focus:outline-none focus:border-primary text-foreground cursor-pointer">
                {THEME_OPTIONS.map(opt => <option key={`border-${opt.id}`} value={opt.id}>{opt.label}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1 text-[11px] font-semibold text-muted-foreground">
              Background
              <select name="selBgColor" defaultValue={currentThemeColors.bg} required className="w-full bg-muted/40 border border-border rounded-xl px-2 py-2 text-sm focus:outline-none focus:border-primary text-foreground cursor-pointer">
                {THEME_OPTIONS.map(opt => <option key={`bg-${opt.id}`} value={opt.id}>{opt.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-muted/30 border border-border rounded-xl mt-2">
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight">{t('MenuConfigActiveAvail')}</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input type="checkbox" name="isActive" defaultChecked={isEditing ? initialData.isActive : true} className="sr-only peer" />
            <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-primary-foreground after:content-[''] after:absolute after:top-0.5 after:inset-s-0.5 after:bg-card after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-muted hover:bg-muted/80 text-foreground font-semibold rounded-xl text-sm transition-all cursor-pointer">
            {t('MenuConfigCancel')}
          </button>
          <button type="submit" className="flex-1 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer">
            <Check className="w-4 h-4" /> {t('MenuConfigSaveEntry')}
          </button>
        </div>
      </form>
    </div>
  );
}
