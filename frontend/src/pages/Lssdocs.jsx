import { useState } from "react";
import { Terminal, ChevronRight, BookOpen, Cpu, Wifi, Users, Calendar, Bike, Info, Layers } from "lucide-react";

const sections = [
  {
   id: "resources",
    label: "Resources",
    icon: Cpu,
    color: "nika",
    commands: [
      {
        title: "Register a Resource",
        syntax: "register [type] : [Space ID], [capacity]",
        examples: [
          "register room : F1_R1, 10",
          "register lab : F2_R3, 5",
        ],
      },
      {
        title: "Get All Resources",
        syntax: "get resources",
        examples: ["get resources"],
      },
      {
        title: "Get Resources by Floor",
        syntax: "get resources [floor]",
        examples: ["get resources 1", "get resources 2"],
      },
      {
        title: "Get Resources by Type",
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
        title: "Register a Sensor",
        syntax: "register sensor : [type], [resourceId], [alertLimit], [Space ID]",
        examples: [
          "register sensor : temperature, 3, 36.5, F1_R1",
          "register sensor : occupancy, 5, 10.0, F2_R3",
        ],
      },
      {
        title: "Get All Sensors",
        syntax: "get sensor",
        examples: ["get sensor"],
      },
      {
        title: "Get Sensors by Type",
        syntax: "get sensor [type]",
        examples: [
          "get sensor temperature",
          "get sensor occupancy",
          "get sensor energy",
          "get sensor air_quality",
        ],
      },
      {
        title: "Get Sensors by Floor",
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
        title: "Create a Reservation",
        syntax: "rent [type] : [resourceId], [startHour], [endHour], [date]",
        examples: ["rent room : 3, 09:00, 11:00, 01/06/2025"],
      },
      {
        title: "Get All Reservations",
        syntax: "get reservations",
        examples: ["get reservations"],
      },
      {
        title: "Get Reservations by User",
        syntax: "get reservations [userId]",
        examples: ["get reservations 4"],
      },
      {
        title: "Update Reservation Status",
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
        title: "Register a Mobility Resource",
        syntax: 'register mobility : [type], "[identifier]", [Space ID]',
        examples: [
          'register mobility : scooter, "SC-001", F1_R1',
          'register mobility : bicycle, "BC-001", F2_R3',
          'register mobility : parking_spot, "PS-001", F1_R5',
        ],
      },
      {
        title: "Get All Mobility Resources",
        syntax: "get mobility",
        examples: ["get mobility"],
      },
      {
        title: "Get Mobility by Type",
        syntax: "get mobility [type]",
        examples: [
          "get mobility scooter",
          "get mobility bicycle",
          "get mobility parking_spot",
        ],
      },
      {
        title: "Update Mobility Status",
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
    commands: [
      {
        title: "Register a User",
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
  { label: "Date format", value: "DD/MM/YYYY" },
  { label: "Hour format", value: "HH:00 or HH:30 only" },
  { label: "Space ID format", value: "F1_R1 → F1_R83, F2_R1 → F2_R13" },
  { label: "Strings", value: 'Must be wrapped in double quotes: "like this"' },
  { label: "NIF", value: "Exactly 9 digits" },
  { label: "Password", value: "Min 8 chars, at least one uppercase and one lowercase" },
  { label: "User types", value: "admin, regular" },
  { label: "Mobility types", value: "scooter, bicycle, parking_spot" },
  { label: "Mobility statuses", value: "free, occupied, inactive" },
  { label: "Sensor types", value: "temperature, energy, air_quality, occupancy" },
];

const variables = [
  "myDate = 01/06/2025",
  "myHour = 09:00",
  "myId = 3",
  "rent room : myId, myHour, 11:00, myDate",
];

function NavBtn({ id, icon: Icon, label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer
        ${isActive
          ? "bg-foreground/80 border-foreground text-primary-foreground shadow-md"
          : "bg-primary-foreground border-muted-foreground/20 text-muted-foreground hover:bg-muted-foreground/10 hover:border-muted-foreground/30"
        }`}
    >
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0
          ${isActive ? "bg-primary-foreground/20" : "bg-muted-foreground/10"}`}
      >
        <Icon size={14} className={isActive ? "text-primary-foreground" : "text-muted-foreground"} />
      </div>
      {label}
    </button>
  );
}

export default function LssDocs() {
  const [activeSection, setActiveSection] = useState("resources");
  const current = sections.find((s) => s.id === activeSection);

  return (
    <section className="py-12 max-w-7xl mx-auto px-6 space-y-6">
     <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-6 border-muted-foreground/20">
      <div className="flex items-center gap-4">
        <div className="p-2.5 bg-primary/10 rounded-xl text-primary shrink-0">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-2xl font-bold text-primary tracking-tight">LSS Language Documentation</h4>
          <h2 className="text-xs text-muted-foreground mt-1">Command reference for the LSS grammar</h2>
        </div>
      </div>
    </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        <div className="md:col-span-1 bg-primary-foreground p-5 rounded-3xl border border-muted-foreground/20 shadow-sm space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-3">
            <Layers size={14} /> Components
          </h2>
          {sections.map((s) => (
            <NavBtn
              key={s.id}
              id={s.id}
              icon={s.icon}
              label={s.label}
              isActive={activeSection === s.id}
              onClick={() => setActiveSection(s.id)}
            />
          ))}
          <NavBtn
            id="variables"
            icon={Terminal}
            label="Variables"
            isActive={activeSection === "variables"}
            onClick={() => setActiveSection("variables")}
          />
          <NavBtn
            id="notes"
            icon={Info}
            label="Notes"
            isActive={activeSection === "notes"}
            onClick={() => setActiveSection("notes")}
          />
        </div>

        <div className="md:col-span-3 space-y-4">
          {activeSection === "notes" && (
            <div className="bg-primary-foreground p-5 rounded-3xl border border-muted-foreground/20 shadow-sm">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-4">
                <Info size={14} /> Notes & Constraints
              </h2>
              <div className="divide-y divide-muted">
                {notes.map((n) => (
                  <div key={n.label} className="flex items-start gap-4 py-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full shrink-0">
                      {n.label}
                    </span>
                    <code className="text-xs text-muted-foreground font-mono">{n.value}</code>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "variables" && (
            <div className="bg-primary-foreground p-5 rounded-3xl border border-muted-foreground/20 shadow-sm">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-3">
                <Terminal size={14} /> Variables
              </h2>
              <p className="text-xs text-muted-foreground mb-3">
                Assign values to variables and reuse them in commands.
              </p>
              <div className="bg-background p-3 rounded-xl border border-muted">
                {variables.map((v, i) => (
                  <div key={i} className="flex items-center gap-2 py-1">
                    <span className="text-primary font-bold text-xs shrink-0">$</span>
                    <code className="text-xs font-mono text-foreground">{v}</code>
                  </div>
                ))}
              </div>
            </div>
          )}

          {current && current.commands.map((cmd) => (
            <div
              key={cmd.title}
              className="bg-primary-foreground p-5 rounded-3xl border border-muted-foreground/20 shadow-sm space-y-3"
            >
              <h3 className="text-sm font-bold text-foreground">{cmd.title}</h3>

              <div>
                <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  Syntax
                </h4>
                <div className="bg-background p-2.5 rounded-xl border border-muted">
                  <code className="text-xs font-mono text-foreground">{cmd.syntax}</code>
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  Examples
                </h4>
                <div className="bg-background p-2.5 rounded-xl border border-muted space-y-1">
                  {cmd.examples.map((ex, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-primary font-bold text-xs shrink-0 mt-0.5">$</span>
                      <code className="text-xs font-mono text-foreground">{ex}</code>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
