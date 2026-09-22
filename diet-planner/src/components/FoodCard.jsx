// src/components/FoodCard.jsx

export default function FoodCard({ food, onAdd }) {
  return (
    <div className="card" style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div>
          <h4 style={{ marginBottom: '0.15rem' }}>{food.name}</h4>
          <span className="text-xs text-muted">{food.cuisine} cuisine</span>
        </div>
        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {food.tags.slice(0, 2).map(tag => (
            <span key={tag} className={`badge badge-${tag === 'vegan' ? 'green' : tag === 'veg' ? 'cyan' : tag === 'nonveg' ? 'orange' : 'purple'}`}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>
        {[
          { label: 'kcal', value: food.per100.kcal, color: '#eef0f8' },
          { label: 'Protein', value: `${food.per100.p}g`, color: '#00ff88' },
          { label: 'Carbs', value: `${food.per100.c}g`, color: '#00d4ff' },
          { label: 'Fat', value: `${food.per100.f}g`, color: '#8b5cf6' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ textAlign: 'center', padding: '0.4rem', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color }}>{value}</div>
            <div style={{ fontSize: '0.65rem', color: '#4a5370', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: '0.7rem', color: '#4a5370', marginBottom: '0.75rem' }}>per 100g</div>

      {onAdd && (
        <button onClick={() => onAdd(food)} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
          + Add to Log
        </button>
      )}
    </div>
  )
}
