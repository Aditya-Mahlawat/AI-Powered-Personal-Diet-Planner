// src/components/ProgressChart.jsx
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend,
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#0d0f1a',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 10,
        padding: '10px 14px',
        fontFamily: 'Outfit, sans-serif',
        fontSize: '0.82rem',
        color: '#eef0f8',
      }}>
        <div style={{ marginBottom: 6, color: '#8892aa', fontWeight: 600 }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ color: p.color, display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: p.color }} />
            <span>{p.name}: {p.value} kcal</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function ProgressChart({ data, target }) {
  if (!data || data.length === 0) {
    return (
      <div className="empty-state" style={{ padding: '2rem 1rem' }}>
        <div style={{ fontSize: '2rem', opacity: 0.3 }}>📈</div>
        <p style={{ fontSize: '0.85rem' }}>No intake data yet. Start logging meals to see trends.</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: '#4a5370', fontFamily: 'Outfit' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#4a5370', fontFamily: 'Outfit' }}
          axisLine={false}
          tickLine={false}
          domain={['auto', 'auto']}
        />
        <Tooltip content={<CustomTooltip />} />
        {target && (
          <ReferenceLine
            y={target}
            stroke="rgba(0,255,136,0.3)"
            strokeDasharray="6 3"
            label={{ value: 'Target', position: 'insideTopRight', fill: '#00ff88', fontSize: 10 }}
          />
        )}
        <Line
          type="monotone"
          dataKey="kcal"
          name="Calories"
          stroke="#00ff88"
          strokeWidth={2.5}
          dot={{ fill: '#00ff88', strokeWidth: 0, r: 4 }}
          activeDot={{ r: 6, fill: '#00ff88', strokeWidth: 2, stroke: '#07080f' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
