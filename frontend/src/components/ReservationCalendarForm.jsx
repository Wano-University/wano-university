import React, { useMemo } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarDays, Clock, ArrowRight } from "lucide-react";

const TIME_SLOTS = (() => {
  const slots = [];
  for (let h = 7; h < 21; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
    slots.push(`${String(h).padStart(2, '0')}:30`);
  }
  return slots;
})();

const to12h = (t) => {
  const [h, m] = t.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
};

const formatDate = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export function ReservationCalendarForm({
  entityId,
  isAvailable = true,
  bookingForm,
  setBookingForm,
  onSubmit,
}) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const calDate = bookingForm.date
    ? new Date(bookingForm.date + 'T00:00:00')
    : undefined;

  const endSlots = useMemo(
    () => (bookingForm.startTime ? TIME_SLOTS.filter(t => t > bookingForm.startTime) : []),
    [bookingForm.startTime]
  );

  const onDateSelect = (d) => {
    if (!d) return;
    setBookingForm(prev => ({ ...prev, date: formatDate(d), startTime: '', endTime: '' }));
  };

  const isComplete = Boolean(bookingForm.date && bookingForm.startTime && bookingForm.endTime);

  return (
    <form
      onSubmit={(e) => onSubmit(e, entityId)}
      className="space-y-3 pt-3 border-t border-muted mt-2"
    >
      <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
        <CalendarDays size={14} /> Schedule reservation
      </h4>

      <div className="rounded-xl border border-muted overflow-hidden cursor-pointer bg-background">
        <Calendar
          mode="single"
          selected={calDate}
          onSelect={onDateSelect}
          disabled={(d) => d < today}
          className="mx-auto"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
            <Clock size={10} /> Start
          </p>
          <ScrollArea className="h-32 rounded-lg border cursor-pointer border-muted bg-background">
            <div className="p-1 space-y-0.5">
              {TIME_SLOTS.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() =>
                    setBookingForm(prev => ({ ...prev, startTime: t, endTime: '' }))
                  }
                  className={`w-full text-left text-[11px] px-2.5 py-1.5 rounded-md transition-colors cursor-pointer font-medium ${
                    bookingForm.startTime === t
                      ? 'bg-foreground/80 text-primary-foreground'
                      : 'text-muted-foreground cursor-pointer hover:bg-muted'
                  }`}
                >
                  {to12h(t)}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
            <Clock size={10} /> End
          </p>
          <ScrollArea
            className={`h-32 rounded-lg border border-muted bg-background cursor-pointer transition-opacity ${
              !bookingForm.startTime ? 'opacity-40 pointer-events-none' : ''
            }`}
          >
            <div className="p-1 space-y-0.5">
              {!bookingForm.startTime ? (
                <p className="text-[10px] text-muted-foreground text-center pt-8 px-2 leading-relaxed">
                  Pick a start<br />time first
                </p>
              ) : (
                endSlots.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setBookingForm(prev => ({ ...prev, endTime: t }))}
                    className={`w-full text-left text-[11px] px-2.5 py-1.5 rounded-md cursor-pointer transition-colors font-medium ${
                      bookingForm.endTime === t
                        ? 'bg-foreground/80  text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {to12h(t)}
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {isComplete && (
        <div className="text-[11px] bg-muted/30 border border-muted rounded-lg px-3 py-2 text-muted-foreground flex items-center justify-between gap-2">
          <span className="font-semibold text-foreground">
            {new Date(bookingForm.date + 'T00:00:00').toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
          </span>
          <span className="flex items-center gap-1">
            {to12h(bookingForm.startTime)}
            <ArrowRight size={10} />
            {to12h(bookingForm.endTime)}
          </span>
        </div>
      )}

      <button
        type="submit"
        disabled={!isAvailable || !isComplete}
        className="w-full bg-muted-foreground/60 hover:bg-muted-foreground/80 cursor-pointer text-primary-foreground text-xs font-bold py-2.5 rounded-xl transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isAvailable ? 'Confirm reservation' : 'Unavailable'}
      </button>
    </form>
  );
}
