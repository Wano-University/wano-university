import React, { useState, useEffect } from 'react';
import { Trash2, Pencil, Plus, PlusCircle, Check, X, Shield, ShieldAlert, CalendarDays, MapPin, Bike, Tag, Scooter } from "lucide-react";
import { getAllMobilityResources, registerMobilityResource, updateMobilityStatus, deleteMobilityResource } from '../lib/mobilityResource.js';
import { createReservation } from '../lib/reservation.js';
import { ReservationCalendarForm } from '../components/ReservationCalendarForm.jsx';

const user = JSON.parse(localStorage.getItem('user') || '{}');
export default function Bikes() {
  const [mobilityPool, setMobilityPool]           = useState({});
  const [modalState, setModalState]               = useState(false);
  const [isAdmin, setIsAdmin]                     = useState(false);

  const [reservationTarget, setReservationTarget] = useState(null);
  const [bookingForm, setBookingForm]             = useState({ date: '', startTime: '', endTime: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const catalogData = await getAllMobilityResources();
      const sortedPool  = {};
      catalogData.forEach(item => {
        if (item.type === 'BICYCLE' || item.type === 'SCOOTER') {
          sortedPool[item.id] = item;
        }
      });
      setMobilityPool(sortedPool);
    } catch (error) {
      console.error("Failed to load mobility resources:", error);
    }
  };

  const handleSaveResource = async (payload, editId) => {
    try {
      let savedItem;
      if (editId) {
        savedItem = await updateMobilityStatus(editId, payload.status);
        setMobilityPool(prev => ({
          ...prev,
          [savedItem.id]: { ...prev[savedItem.id], ...savedItem },
        }));
      } else {
        savedItem = await registerMobilityResource(payload);
        setMobilityPool(prev => ({ ...prev, [savedItem.id]: savedItem }));
      }
      setModalState(false);
    } catch (error) {
      alert(error.message || "Failed to save mobility resource.");
    }
  };

  const handleReservationSubmit = async (e, resourceId) => {
    e.preventDefault();
    try {
      const startDateTime = `${bookingForm.date}T${bookingForm.startTime}:00`;
      const endDateTime   = `${bookingForm.date}T${bookingForm.endTime}:00`;
      console.log("Attempting to reserve Resource ID:", resourceId);

      await createReservation({
        mobilityrRsourceId: resourceId,
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

  const handleDeleteResource = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Remove this vehicle?")) return;
    try {
      await deleteMobilityResource(id);
      const updatedPool = { ...mobilityPool };
      delete updatedPool[id];
      setMobilityPool(updatedPool);
    } catch (error) {
      alert("Failed to delete vehicle.");
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
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-border pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl text-primary flex gap-1">
            <Bike className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-2xl font-bold text-primary tracking-tight">Mobility Resources</h4>
            <h2 className="text-xs text-muted-foreground">Book a bicycle or scooter for your commute!</h2>
          </div>
        </div>

{isAdmin && (
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
        
      {isAdmin && (
        <div className="flex items-center justify-end">
          <button
            onClick={() => setModalState(true)}
            className="text-sm font-bold bg-primary text-primary-foreground px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Register New Vehicle
          </button>
        </div>
      )}

      <div className="flex flex-col gap-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {Object.keys(mobilityPool).length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground bg-muted/20 rounded-2xl border border-dashed border-border">
              <Bike className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p>No bicycles or scooters registered yet.</p>
              {isAdmin && <p className="text-sm mt-1">Click the "Register New Vehicle" button to add one!</p>}
            </div>
          ) : (
            Object.keys(mobilityPool).map((poolKey) => {
              const item  = mobilityPool[poolKey];
              const isFree = item.status === 'FREE';

              return (
                <div
                  key={poolKey}
                  className="p-4 border rounded-2xl flex flex-row items-center gap-4 transition-all relative overflow-hidden bg-card text-foreground border-border"
                >
                  {!isFree && (
                    <div className="absolute top-0 right-0 bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-1 rounded-bl-lg z-10 uppercase tracking-wider">
                      {item.status.replace('_', ' ')}
                    </div>
                  )}
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    {item.type === 'SCOOTER' ? <Scooter className="w-6 h-6" /> : <Bike className="w-6 h-6" />}
                  </div>

                  <div className="flex-1 flex flex-col justify-center min-w-0">
                    <div className="flex items-baseline gap-2">
                      <h5 className="text-lg font-black truncate capitalize">{item.type.toLowerCase()}</h5>
                      <p className="text-xs text-muted-foreground truncate border border-border px-1.5 py-0.5 rounded-md font-mono">
                        {item.identifier}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 opacity-70 text-[10px] font-bold uppercase tracking-wide mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {item.location || 'Location Unassigned'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {isAdmin ? (
                      <div className="flex gap-4">
                        <button
                          onClick={() => setModalState(item)}
                          className="px-4 py-2 flex items-center gap-1.5 bg-background/50 hover:bg-muted text-foreground border border-border rounded-lg transition-colors cursor-pointer text-xs font-bold"
                        >
                          <Pencil className="w-3.5 h-3.5" /> Update Status
                        </button>
                        <button
                          onClick={(e) => handleDeleteResource(e, item.id)}
                          className="px-4 py-2 flex items-center gap-1.5 bg-background/50 hover:bg-foreground/30 text-foreground border border-border rounded-lg transition-colors cursor-pointer text-xs font-bold"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    ) : (
                      <button
                        disabled={!isFree}
                        onClick={() => openReservationModal(item)}
                        className="px-6 py-2 flex items-center gap-1.5 bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors cursor-pointer text-xs font-bold"
                      >
                        <CalendarDays className="w-3.5 h-3.5" /> Reserve
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Vehicle create/edit modal */}
      {modalState !== false && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4">
          <ResourceForm
            onClose={() => setModalState(false)}
            onSave={handleSaveResource}
            initialData={modalState !== true ? modalState : null}
          />
        </div>
      )}

      {/* Reservation modal */}
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
              <h3 className="text-xl font-black tracking-tight text-primary">Book Vehicle</h3>
              <p className="text-sm font-semibold truncate mt-1 capitalize">
                {reservationTarget.type.toLowerCase()} — {reservationTarget.identifier}
              </p>
            </div>

            <ReservationCalendarForm
              key={reservationTarget.id}
              entityId={reservationTarget.id}
              isAvailable={reservationTarget.status === 'FREE'}
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

function ResourceForm({ onClose, onSave, initialData }) {
  const isEditing = !!initialData;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    if (isEditing) {
      onSave({ status: formData.get('status') }, initialData.id);
      return;
    }

    onSave({
      type:       formData.get('type'),
      identifier: formData.get('identifier'),
      location:   formData.get('location'),
      status:     formData.get('status'),
    }, null);
  };

  return (
    <div className="bg-card text-card-foreground w-full max-w-lg p-6 rounded-3xl shadow-2xl border border-border flex flex-col relative font-sans max-h-[90vh] overflow-y-auto z-50">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 text-primary mb-1">
            <PlusCircle className="w-5 h-5" />
            <h3 className="text-xl font-black tracking-tight">
              {isEditing ? 'Update Status' : 'Register New'} Vehicle
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            {isEditing
              ? 'Change the availability status of this vehicle.'
              : 'Add a new bicycle or scooter to the fleet.'}
          </p>
        </div>
        <button
          onClick={onClose}
          type="button"
          className="p-1.5 rounded-xl bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isEditing && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-primary flex items-center gap-1.5">
                  <Bike className="w-3.5 h-3.5" /> Vehicle Type:
                </label>
                <select
                  name="type"
                  required
                  className="w-full bg-muted/40 border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all text-foreground cursor-pointer"
                >
                  <option value="BICYCLE">Bicycle</option>
                  <option value="SCOOTER">Scooter</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-primary flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" /> Identifier:
                </label>
                <input
                  name="identifier"
                  type="text"
                  required
                  className="w-full bg-muted/40 border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all text-foreground"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-primary flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Location Name:
              </label>
              <input
                name="location"
                type="text"
                className="w-full bg-muted/40 border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all text-foreground"
              />
            </div>
          </>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-primary flex items-center gap-1.5">
            Current Status:
          </label>
          <select
            name="status"
            defaultValue={initialData?.status || "FREE"}
            className="w-full bg-muted/40 border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all text-foreground cursor-pointer"
          >
            <option value="FREE">ACTIVE</option>
            <option value="INACTIVE">MAINTENANCE</option>
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 bg-muted hover:bg-muted/80 text-foreground font-semibold rounded-xl text-sm transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" /> {isEditing ? 'Update Status' : 'Register Vehicle'}
          </button>
        </div>
      </form>
    </div>
  );
}
