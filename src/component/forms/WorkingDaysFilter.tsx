export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
export type Weekday = (typeof WEEKDAYS)[number];

// Presets are expressed as the days that are OFF.
export const OFF_DAY_PRESETS: { label: string; off: Weekday[] }[] = [
  { label: "Sat–Sun off", off: ["Sat", "Sun"] },
  { label: "Open 7 days", off: [] },
];

interface Props {
  // value/onChange work in terms of WORKING days (what the API expects).
  value: string[];
  onChange: (days: string[]) => void;
  label?: string;
  compact?: boolean;
}

const sameSet = (a: string[], b: string[]) =>
  a.length === b.length && a.every((d) => b.includes(d));

const WorkingDaysFilter = ({ value, onChange, label = "Off days", compact }: Props) => {
  const offDays = WEEKDAYS.filter((d) => !value.includes(d));

  // Clicking a day toggles whether it is an off day.
  const toggleDay = (day: string) => {
    onChange(
      value.includes(day) ? value.filter((d) => d !== day) : [...value, day],
    );
  };

  const applyOffPreset = (off: Weekday[]) => {
    onChange(WEEKDAYS.filter((d) => !off.includes(d)));
  };

  return (
    <div className={compact ? "" : "space-y-2"}>
      <div className="flex flex-wrap items-center gap-2">
        {!compact && label && (
          <span className="text-sm text-base-content/60">{label}:</span>
        )}
        <div className="join">
          {WEEKDAYS.map((day) => {
            const isOff = offDays.includes(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                title={isOff ? `${day} is an off day` : `${day} is a working day`}
                className={`btn join-item btn-xs ${
                  isOff ? "btn-error text-white" : "btn-ghost border-base-300"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
        {OFF_DAY_PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => applyOffPreset(preset.off)}
            className={`badge badge-sm cursor-pointer ${
              sameSet(offDays, preset.off) ? "badge-primary" : "badge-ghost"
            }`}
          >
            {preset.label}
          </button>
        ))}
        <span className="text-base-content/40">Click manually for off day</span>
        <span className="text-base-content/40">·</span>
        <span className="font-medium text-base-content/70">
          {offDays.length === 0
            ? "No off day selected"
            : offDays.length === 1
              ? `Off: ${offDays[0]}`
              : `Off: ${offDays.join(", ")}`}
        </span>
      </div>
    </div>
  );
};

export default WorkingDaysFilter;
