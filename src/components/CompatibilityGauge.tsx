interface CompatibilityGaugeProps {
  value: number; // 0-100
  size?: number;
}

function getColor(value: number): { stroke: string; text: string; label: string } {
  if (value >= 80) return { stroke: '#7C8B6F', text: 'text-sage-600', label: 'Match parfait' };
  if (value >= 60) return { stroke: '#D4A657', text: 'text-gold', label: 'Bon potentiel' };
  if (value >= 40) return { stroke: '#C1694F', text: 'text-clay-600', label: 'Mitigé' };
  return { stroke: '#A8543C', text: 'text-clay-700', label: 'Risqué pour toi' };
}

export default function CompatibilityGauge({ value, size = 168 }: CompatibilityGaugeProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const { stroke, text, label } = getColor(clamped);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#EDE4D8"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 900ms cubic-bezier(0.22,1,0.36,1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-serif text-4xl font-semibold text-ink">{clamped}%</span>
        </div>
      </div>
      <span className={`text-sm font-medium ${text}`}>{label}</span>
    </div>
  );
}
