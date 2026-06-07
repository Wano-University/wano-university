import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Terminal, ChevronRight, BookOpen, Cpu, Wifi, Users, Calendar, Bike, Info } from "lucide-react";
import { useTranslation } from "react-i18next";

const sections = [
  {
    id: "resources",
    label: "Resources",
    icon: Cpu,
    color: "nika",
    commands: [
      {
        title: 'LSSRR',
        syntax: "register [type] : [Space ID], [capacity]",
        examples: [
          "register room : F1_R1, 10",
          "register lab : F2_R3, 5",
        ],
      },
      {
        title: 'LSSGR',
        syntax: "get resources",
        examples: ["get resources"],
      },
      {
        title: 'LSSGRF',
        syntax: "get resources [floor]",
        examples: ["get resources 1", "get resources 2"],
      },
      {
        title: 'LSSGRT',
        syntax: "get resources [type]",
        examples: ["get resources room", "get resources lab"],
      },
    ],
  },
  {
    id: "sensors",
    label: "Sensors",
    icon: Wifi,
    color: "surgeon",
    commands: [
      {
        title: 'LSSRS',
        syntax: "register sensor : [type], [resourceId], [alertLimit], [Space ID]",
        examples: [
          "register sensor : temperature, 3, 36.5, F1_R1",
          "register sensor : occupancy, 5, 10.0, F2_R3",
        ],
      },
      {
        title: 'LSSGAS',
        syntax: "get sensor",
        examples: ["get sensor"],
      },
      {
        title: 'LSSGST',
        syntax: "get sensor [type]",
        examples: [
          "get sensor temperature",
          "get sensor occupancy",
          "get sensor energy",
          "get sensor air_quality",
        ],
      },
      {
        title: 'LSSGSF',
        syntax: "get sensor [FLOOR]",
        examples: ["get sensor FLOOR_1", "get sensor FLOOR_2"],
      },
    ],
  },
  {
    id: "reservations",
    label: "Reservations",
    icon: Calendar,
    color: "fire",
    commands: [
      {
        title: 'LSSCR',
        syntax: "rent [type] : [resourceId], [startHour], [endHour], [date]",
        examples: ["rent room : 3, 09:00, 11:00, 01/06/2025"],
      },
      {
        title: 'LSSGAR',
        syntax: "get reservations",
        examples: ["get reservations"],
      },
      {
        title: 'LSSGRU',
        syntax: "get reservations [userId]",
        examples: ["get reservations 4"],
      },
      {
        title: 'LSSURS',
        syntax: "update reservations [id] [status]",
        examples: [
          "update reservations 1 active",
          "update reservations 1 completed",
          "update reservations 1 canceled",
        ],
      },
    ],
  },
  {
    id: "mobility",
    label: "Mobility",
    icon: Bike,
    color: "tanuki",
    commands: [
      {
        title: 'LSSRMR',
        syntax: 'register mobility : [type], "[identifier]", [Space ID]',
        examples: [
          'register mobility : scooter, "SC-001", F1_R1',
          'register mobility : bicycle, "BC-001", F2_R3',
          'register mobility : parking_spot, "PS-001", F1_R5',
        ],
      },
      {
        title: 'LSSGAMR',
        syntax: "get mobility",
        examples: ["get mobility"],
      },
      {
        title: 'LSSGMT',
        syntax: "get mobility [type]",
        examples: [
          "get mobility scooter",
          "get mobility bicycle",
          "get mobility parking_spot",
        ],
      },
      {
        title: 'LSSUMS',
        syntax: "update mobility [id] [status]",
        examples: [
          "update mobility 1 free",
          "update mobility 1 occupied",
          "update mobility 1 inactive",
        ],
      },
    ],
  },
  {
    id: "users",
    label: "Users",
    icon: Users,
    color: "swordsman",
    commands: [
      {
        title: 'LSSRU',
        syntax: 'register user : "[name]", "[address]", [nif], [email], [login], [password], [type]',
        examples: [
          'register user : "John Doe", "123 Street", 123456789, john@email.com, johndoe, Password1, regular',
          'register user : "Jane Admin", "456 Ave", 987654321, jane@email.com, janeadmin, Password1, admin',
        ],
      },
    ],
  },
];

const notes = [
  { label: 'LSSLblDate', value: "DD/MM/YYYY" },
  { label: 'LSSLblHour', value: "HH:00 or HH:30 only" },
  { label: 'LSSLblSpace', value: "F1_R1 → F1_R83, F2_R1 → F2_R13" },
  { label: 'LSSLblString', value: 'Must be wrapped in double quotes: "like this"' },
  { label: 'LSSLblNIF', value: "Exactly 9 digits" },
  { label: 'LSSLblPass', value: "Min 8 chars, at least one uppercase and one lowercase" },
  { label: 'LSSLblUType', value: "admin, regular" },
  { label: 'LSSLblMType', value: "scooter, bicycle, parking_spot" },
  { label: 'LSSLblMStatus', value: "free, occupied, inactive" },
  { label: 'LSSLblSType', value: "temperature, energy, air_quality, occupancy" },
];

const variables = [
  "myDate = 01/06/2025",
  "myHour = 09:00",
  "myId = 3",
  "rent room : myId, myHour, 11:00, myDate",
];

export default function LssDocs() {
  const [activeSection, setActiveSection] = useState("resources");
  const { t } = useTranslation();

  const current = sections.find((s) => s.id === activeSection);

  return (
    <section className="py-24 max-w-7xl mx-auto px-6 space-y-6 bg-background font-sans relative">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-2xl font-bold text-primary tracking-tight">{t('LSSTitle')}</h4>
          <p className="text-xs text-muted-foreground">{t('LSSDesc')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1 flex flex-col gap-2">
          {sections.map((s) => {
            const Icon = s.icon;
            const isActive = activeSection === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl border text-sm font-semibold transition-all duration-200 text-left
                  ${isActive
                    ? `bg-${s.color} text-white border-${s.color} shadow-lg`
                    : `bg-${s.color}/10 border-${s.color}/30 text-foreground hover:bg-${s.color}/20 hover:border-${s.color}`
                  }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {s.label}
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </button>
            );
          })}

          {/* Variables */}
          <button
            onClick={() => setActiveSection("variables")}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl border text-sm font-semibold transition-all duration-200 text-left
              ${activeSection === "variables"
                ? "bg-primary text-primary-foreground border-primary shadow-lg"
                : "bg-primary/10 border-primary/30 text-foreground hover:bg-primary/20 hover:border-primary"
              }`}
          >
            <Terminal className="w-4 h-4 shrink-0" />
            {t('LSSVariables')}
            {activeSection === "variables" && <ChevronRight className="w-4 h-4 ml-auto" />}
          </button>

          {/* Notes */}
          <button
            onClick={() => setActiveSection("notes")}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl border text-sm font-semibold transition-all duration-200 text-left
              ${activeSection === "notes"
                ? "bg-primary text-primary-foreground border-primary shadow-lg"
                : "bg-primary/10 border-primary/30 text-foreground hover:bg-primary/20 hover:border-primary"
              }`}
          >
            <Info className="w-4 h-4 shrink-0" />
            {t('LSSNotes')}
            {activeSection === "notes" && <ChevronRight className="w-4 h-4 ml-auto" />}
          </button>
        </div>

        {/* Content */}
        <div className="md:col-span-3 flex flex-col gap-4">
          {activeSection === "notes" && (
            <Card className="p-6 rounded-3xl border border-border shadow-xl space-y-4">
              <h3 className="text-lg font-black tracking-tight text-foreground flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" /> {t('LSSNCons')}
              </h3>
              <div className="divide-y divide-border">
                {notes.map((n) => (
                  <div key={n.label} className="flex items-start gap-4 py-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded-full shrink-0 border border-primary/20">
                      {t(n.label)}
                    </span>
                    <code className="text-sm text-foreground/80 font-mono">{n.value}</code>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeSection === "variables" && (
            <Card className="p-6 rounded-3xl border border-border shadow-xl space-y-4">
              <h3 className="text-lg font-black tracking-tight text-foreground flex items-center gap-2">
                <Terminal className="w-5 h-5 text-primary" /> {t('LSSVariables')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('LSSAssign')}
              </p>
              <div className="bg-muted/40 rounded-2xl p-4 border border-border">
                {variables.map((v, i) => (
                  <div key={i} className="flex items-center gap-2 py-1">
                    <span className="text-primary font-bold text-sm">$</span>
                    <code className="text-sm font-mono text-foreground">{v}</code>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {current && current.commands.map((cmd) => (
            <Card key={cmd.title} className="p-6 rounded-3xl border border-border shadow-xl space-y-4">
              <h3 className="text-lg font-black tracking-tight text-foreground">{t(cmd.title)}</h3>

              {/* Syntax */}
              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20 inline-block mb-2">
                  {t('LSSSyntax')}
                </span>
                <div className="bg-muted/40 rounded-2xl px-4 py-3 border border-border">
                  <code className="text-sm font-mono text-foreground">{cmd.syntax}</code>
                </div>
              </div>

              {/* Examples */}
              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20 inline-block mb-2">
                  {t('LSSExamples')}
                </span>
                <div className="bg-muted/40 rounded-2xl px-4 py-3 border border-border space-y-1">
                  {cmd.examples.map((ex, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-primary font-bold text-sm">$</span>
                      <code className="text-sm font-mono text-foreground">{ex}</code>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
