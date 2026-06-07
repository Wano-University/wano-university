import React, { useState, useEffect } from 'react';
import { Pencil, Wrench, Plus, PlusCircle, Palette, Type, Check, X, Trash2, Shield, ShieldAlert, Layers, CalendarDays, Map } from "lucide-react";
import { getAllEquipment, registerEquipment, updateResource, deleteResource } from '../lib/resource.js';
import { createReservation } from '../lib/reservation.js';
import { ReservationCalendarForm } from '../components/ReservationCalendarForm.jsx';
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const THEME_OPTIONS = [
  { id: 'nika',      label: 'Pink' },
  { id: 'surgeon',   label: 'Light blue' },
  { id: 'fire',      label: 'Dark orange' },
  { id: 'ohara',     label: 'Dark purple' },
  { id: 'tanuki',    label: 'Light green' },
  { id: 'meat',      label: 'Red' },
  { id: 'swordsman', label: 'Dark green' },
  { id: 'chef',      label: 'Dark blue' },
  { id: 'navigator', label: 'Light orange' },
  { id: 'ramen',     label: 'Light purple' },
];

export default function EquipmentConfig() {
  const [equipmentPool, setEquipmentPool] = useState({});
  const [modalState, setModalState]       = useState(false);

  const [reservationTarget, setReservationTarget] = useState(null);
  const [bookingForm, setBookingForm]             = useState({ date: '', startTime: '', endTime: '' });
  const { t } = useTranslation();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin =
    user?.type === 'ADMIN' &&
    Array.isArray(user?.permissions) &&
    user.permissions.some(p => {
      if (typeof p === 'string') return p === 'GERIR_EQUIPAMENTOS';
      return p?.permission?.description === 'GERIR_EQUIPAMENTOS' || p?.description === 'GERIR_EQUIPAMENTOS';
    });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const catalogData = await getAllEquipment();
      const sortedPool  = {};
      catalogData.forEach(item => { sortedPool[item.id] = item; });
      setEquipmentPool(sortedPool);
    } catch (error) {
      console.error("Failed to load equipment:", error);
    }
  };

  const handleSaveEquipment = async (payload, editId) => {
    try {
      let savedItem;
      if (editId) {
        savedItem = await updateResource(editId, { ...payload, type: 'EQUIPMENT' });
      } else {
        savedItem = await registerEquipment(payload);
      }
      setEquipmentPool(prev => ({ ...prev, [savedItem.id]: savedItem }));
      setModalState(false);
    } catch (error) {
      alert("Failed to save equipment.");
    }
  };

  const handleDeleteEquipment = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Remove this equipment?")) return;
    try {
      await deleteResource(id);
      const updatedPool = { ...equipmentPool };
      delete updatedPool[id];
      setEquipmentPool(updatedPool);
    } catch (error) {
      alert("Failed to delete equipment.");
    }
  };

  const handleReservationSubmit = async (e, equipmentId) => {
    e.preventDefault();
    try {
      const startDateTime = `${bookingForm.date}T${bookingForm.startTime}:00`;
      const endDateTime   = `${bookingForm.date}T${bookingForm.endTime}:00`;

      await createReservation({
        resourceId: equipmentId,
        startTime:  startDateTime,
        endTime:    endDateTime,
        status:     'ACTIVE',
      });

      alert("Reservation successfully created!");
      closeReservationModal();
      await loadData();
    } catch (error) {
      console.error("Failed to make reservation:", error);
      alert(error.message || "Failed to submit reservation.");
    }
  };

  const openReservationModal = (item) => {
    setBookingForm({ date: '', startTime: '', endTime: '' });
    setReservationTarget(item);
  };

  const closeReservationModal = () => {
    setReservationTarget(null);
    setBookingForm({ date: '', startTime: '', endTime: '' });
  };

  return (
    <section className="py-24 max-w-7xl mx-auto px-6 space-y-6 bg-background font-sans relative">
      <div className="grid grid-cols-3 md:flex-row items-start md:items-center justify-between border-b border-border pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-2xl font-bold text-primary tracking-tight">{t('EquipTitle')}</h4>
            <h2 className="text-xs text-muted-foreground">{t('EquipDesc')}</h2>
          </div>
        </div>
        <div className ="flex justify-center">

          <Link to="/spaces" className="inline-flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 text-muted-foreground text-sm font-medium rounded-xl transition">
            <Map className="w-4 h-4" />
            {t('EquipBtSpace')}
          </Link>
       </div> 
       <div className= "flex justify-end">
          {user?.type === 'ADMIN' && (
          <button 
            onClick={() => setIsAdmin(!isAdmin)}
            className={`text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-full border transition-all flex items-center gap-2 cursor-pointer ${
              isAdmin
                ? 'bg-foreground text-primary-foreground border-foreground/80'
                : 'bg-muted text-muted-foreground border-transparent'
            }`}
          >
            {isAdmin ? <ShieldAlert className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
            {isAdmin ? 'Admin Mode: ON' : 'Admin Mode: OFF'}
          </button>
        )}
        </div>
      </div>

      {isAdmin && (
        <div className="flex items-center justify-end">
          <button
            onClick={() => setModalState(true)}
            className="text-sm font-bold bg-primary text-primary-foreground px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> {t('EquipRegNew')}
          </button>
        </div>
      )}

      <div className="flex flex-col gap-4 w-full">
        {Object.keys(equipmentPool).length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-2xl border border-dashed border-border">
            <Wrench className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <p>{t('EquipcNoReg')}</p>
            {isAdmin && <p className="text-sm mt-1">{t('EquipClick')}</p>}
          </div>
        ) : (
          Object.keys(equipmentPool).map((poolKey) => {
            const item = equipmentPool[poolKey];
            return (
              <div
                key={poolKey}
                className={`p-4 border rounded-2xl flex flex-row items-center gap-4 transition-all relative overflow-hidden ${item.color || 'border-border bg-card text-foreground'}`}
              >
                {!item.isAvailable && (
                  <div className="absolute top-0 right-0 bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-1 rounded-bl-lg z-10 uppercase tracking-wider">
                    {t('EquipUna')}
                  </div>
                )}
                <div className="p-2 rounded-lg bg-current/10">
                  <Wrench className="opacity-50" />
                </div>
                <div className="flex-1 flex flex-col justify-center min-w-0">
                  <div className="flex items-baseline gap-2">
                    <h5 className="text-lg font-black truncate">{item.name}</h5>
                    <p className="text-xs text-muted-foreground truncate">{item.desc}</p>
                  </div>
                  <div className="flex items-center gap-4 opacity-70 text-[10px] font-bold uppercase tracking-wide">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3 h-3" />
                      {item.floor ? item.floor.replace('_', ' ') : 'Unassigned'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {isAdmin ? (
                    <>
                      <button
                        onClick={() => setModalState(item)}
                        className="px-4 py-2 flex items-center gap-1.5 bg-background/50 hover:bg-background text-foreground rounded-lg transition-colors cursor-pointer text-xs font-bold"
                      >
                        <Pencil className="w-3.5 h-3.5" /> {t('EquipEdit')}
                      </button>
                      <button
                        onClick={(e) => handleDeleteEquipment(e, item.id)}
                        className="px-4 py-2 flex items-center gap-1.5 bg-background/50 hover:bg-foreground/30 text-foreground rounded-lg transition-colors cursor-pointer text-xs font-bold"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> {t('EquiptDelete')}
                      </button>
                    </>
                  ) : (
                    <button
                      disabled={!item.isAvailable}
                      onClick={() => openReservationModal(item)}
                      className="px-6 py-2 flex items-center gap-1.5 bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors cursor-pointer text-xs font-bold"
                    >
                      <CalendarDays className="w-3.5 h-3.5" /> {t('EquipReserve')}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {modalState !== false && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4">
          <EquipmentForm
            onClose={() => setModalState(false)}
            onSave={handleSaveEquipment}
            initialData={modalState !== true ? modalState : null}
            t = {t}
          />
        </div>
      )}

      {reservationTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4">
          <div className="bg-card text-card-foreground w-full max-w-sm p-6 rounded-3xl shadow-2xl border border-border relative">
            <button
              onClick={closeReservationModal}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-2">
              <h3 className="text-xl font-black tracking-tight text-primary">{t('EquiptBookEquip')}</h3>
              <p className="text-sm font-semibold truncate mt-1">{reservationTarget.name}</p>
            </div>

            <ReservationCalendarForm
              key={reservationTarget.id}
              entityId={reservationTarget.id}
              isAvailable={reservationTarget.isAvailable}
              bookingForm={bookingForm}
              setBookingForm={setBookingForm}
              onSubmit={handleReservationSubmit}
            />
          </div>
        </div>
      )}
    </section>
  );
}

function EquipmentForm({ onClose, onSave, initialData, t }) {
  const isEditing = !!initialData;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const textColor        = formData.get('selTextColor');
    const borderCol        = formData.get('selBorderColor');
    const bgColor          = formData.get('selBgColor');
    const finalColorString = `text-${textColor} border-${borderCol} bg-${bgColor}/5`;

    const payload = {
      name:        formData.get('name'),
      desc:        formData.get('desc'),
      capacity:    parseInt(formData.get('capacity') || 1, 10),
      floor:       formData.get('floor') === 'NONE' ? null : formData.get('floor'),
      isAvailable: e.target.isAvailable.checked,
      color:       finalColorString,
    };

    onSave(payload, isEditing ? initialData.id : null);
  };

  const getExtractedColors = () => {
    if (!initialData || !initialData.color) return { text: 'meat', border: 'meat', bg: 'meat' };
    const segments = initialData.color.split(' ');
    const text   = segments.find(s => s.startsWith('text-'))?.split('-')[1]              || 'meat';
    const border = segments.find(s => s.startsWith('border-'))?.split('-')[1]            || 'meat';
    const bg     = segments.find(s => s.startsWith('bg-'))?.split('-')[1]?.split('/')[0] || 'meat';
    return { text, border, bg };
  };

  const currentThemeColors = getExtractedColors();

  return (
    <div className="bg-card text-card-foreground w-full max-w-lg p-6 rounded-3xl shadow-2xl border border-border flex flex-col relative font-sans max-h-[90vh] overflow-y-auto z-50">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 text-primary mb-1">
            <PlusCircle className="w-5 h-5" />
            <h3 className="text-xl font-black tracking-tight">
              {isEditing ? 'Edit Existing' : 'Register New'} {t('EquipEquip')}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">{t('EquipManage')}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-xl bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-primary flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5" /> {t('EquipName')}:
          </label>
          <input
            name="name"
            type="text"
            defaultValue={initialData?.name || ""}
            required
            className="w-full bg-muted/40 border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all text-foreground"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-primary flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5" /> {t('EquipEquipDesc')}:
          </label>
          <input
            name="desc"
            type="text"
            defaultValue={initialData?.desc || ""}
            required
            className="w-full bg-muted/40 border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all text-foreground"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-primary flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> {t('EquipFloor')}:
            </label>
            <select
              name="floor"
              defaultValue={initialData?.floor || "NONE"}
              className="w-full bg-muted/40 border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all text-foreground cursor-pointer"
            >
              <option value="NONE">{t('EquipUnassign')}</option>
              <option value="FLOOR_1">{t('EquipFloor1')}</option>
              <option value="FLOOR_2">{t('EquipFloor2')}</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-primary flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5" /> {t('EquipColors')}:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 text-[11px] font-semibold text-muted-foreground">
              {t('EquipBorder')}
              <select
                name="selBorderColor"
                defaultValue={currentThemeColors.border}
                required
                className="w-full bg-muted/40 border border-border rounded-xl px-2 py-2 text-sm focus:outline-none focus:border-primary text-foreground cursor-pointer"
              >
                {THEME_OPTIONS.map(opt => (
                  <option key={`border-${opt.id}`} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1 text-[11px] font-semibold text-muted-foreground">
              {t('EquipBG')}
              <select
                name="selBgColor"
                defaultValue={currentThemeColors.bg}
                required
                className="w-full bg-muted/40 border border-border rounded-xl px-2 py-2 text-sm focus:outline-none focus:border-primary text-foreground cursor-pointer"
              >
                {THEME_OPTIONS.map(opt => (
                  <option key={`bg-${opt.id}`} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-muted/30 border border-border rounded-xl mt-2">
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight">{t('EquipAA')}</span>
            <span className="text-[10px] text-muted-foreground">{t('EquipToggle')}</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              name="isAvailable"
              defaultChecked={isEditing ? initialData.isAvailable : true}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-primary-foreground after:content-[''] after:absolute after:top-0.5 after:inset-s-0.5 after:bg-card after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 bg-muted hover:bg-muted/80 text-foreground font-semibold rounded-xl text-sm transition-all cursor-pointer"
          >
            {t('EquipCancel')}
          </button>
          <button
            type="submit"
            className="flex-1 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" /> {isEditing ? 'Update Entry' : 'Save Entry'}
          </button>
        </div>
      </form>
    </div>
  );
}