// src/components/MacroRing.jsx
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const COLORS = {
  protein: '#00ff88',
  carbs:   '#00d4ff',
  fat:     '#8b5cf6',
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0]
    return (
      <div style={{
        background: '#0d0f1a',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 10,
        padding: '8px 12px',
        fontFamily: 'Outfit, sans-serif',
        fontSize: '0.82rem',
        color: '#eef0f8',
      }}>
        <strong>{name}</strong>: {value}g
      </div>
    )
  }
  return null
}

export default function MacroRing({ macros, consumed = null, size = 180 }) {
  const { p = 0, c = 0, f = 0 } = macros || {}

  const data = [
    { name: 'Protein', value: p, color: COLORS.protein },
    { name: 'Carbs',   value: c, color: COLORS.carbs },
    { name: 'Fat',     value: f, color: COLORS.fat },
  ]

  const totalCal = Math.round(p * 4 + c * 4 + f * 9)

  return (
    <div className="macro-ring-container">
      <div style={{ width: size, height: size, position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={size * 0.3}
              outerRadius={size * 0.44}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#eef0f8', lineHeight: 1 }}>
            {totalCal}
          </div>
          <div style={{ fontSize: '0.65rem', color: '#8892aa', fontWeight: 500, marginTop: 2 }}>
            kcal
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="macro-legend">
        {data.map(({ name, value, color }) => {
          const consumed_val = consumed
            ? name === 'Protein' ? consumed.p : name === 'Carbs' ? consumed.c : consumed.f
            : null
          const pct = value > 0 ? Math.min(100, Math.round(((consumed_val ?? 0) / value) * 100)) : 0
          return (
            <div key={name}>
              <div className="macro-legend-item" style={{ marginBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div className="macro-legend-dot" style={{ background: color }} />
                  <span style={{ fontSize: '0.82rem', color: '#8892aa' }}>{name}</span>
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#eef0f8' }}>
                  {consumed !== null ? `${consumed_val ?? 0}g / ` : ''}{value}g
                </span>
              </div>
              {consumed !== null && (
                <div className="progress-bar-wrap" style={{ marginBottom: 6 }}>
                  <div
                    className={`progress-bar${pct > 100 ? ' over' : ''}`}
                    style={{ width: `${pct}%`, background: pct > 100 ? '#ff4d6d' : color }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
