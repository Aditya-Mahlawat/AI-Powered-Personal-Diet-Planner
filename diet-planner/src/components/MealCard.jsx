// src/components/MealCard.jsx

const FOOD_EMOJIS = {
  oats: '🌾', brown_rice: '🍚', white_rice: '🍚', quinoa: '🌱',
  whole_wheat_bread: '🍞', chapati: '🫓', upma_semolina: '🥣',
  paneer: '🧀', tofu: '🟦', lentils_dal: '🫘', chickpeas_chole: '🫘',
  rajma: '🫘', moong_dal: '🫘', greek_yogurt: '🥛', cottage_cheese: '🥛',
  milk: '🥛', egg: '🥚', chicken_breast: '🍗', tuna: '🐟',
  salmon: '🐠', mutton: '🥩', spinach: '🥬', broccoli: '🥦',
  carrot: '🥕', sweet_potato: '🍠', tomato: '🍅', cucumber: '🥒',
  apple: '🍎', banana: '🍌', mango: '🥭', orange: '🍊', berries: '🫐',
  almonds: '🌰', walnuts: '🌰', peanut_butter: '🥜', avocado: '🥑',
  olive_oil: '🫙', idli: '🍥', dosa: '🫔', sambar: '🍲',
  dal_makhani: '🫕',
}

export default function MealCard({ item, onRemove }) {
  const emoji = FOOD_EMOJIS[item.foodId] || '🍽'

  return (
    <div className="meal-card">
      <div className="meal-icon">{emoji}</div>

      <div className="meal-info">
        <div className="meal-name">{item.name}</div>
        <div className="meal-grams">{item.grams}g</div>
        <div className="meal-macros">
          <span style={{ color: '#00ff88' }}>P {item.p}g</span>
          <span style={{ color: '#00d4ff' }}>C {item.c}g</span>
          <span style={{ color: '#8b5cf6' }}>F {item.f}g</span>
        </div>
      </div>

      <div className="meal-kcal">{item.kcal} <span style={{ fontSize: '0.7rem', fontWeight: 400, color: '#8892aa' }}>kcal</span></div>

      {onRemove && (
        <button
          onClick={() => onRemove(item.foodId)}
          className="btn btn-ghost btn-sm"
          style={{ padding: '0.3rem 0.5rem', fontSize: '0.85rem' }}
          title="Remove"
        >
          ✕
        </button>
      )}
    </div>
  )
}
