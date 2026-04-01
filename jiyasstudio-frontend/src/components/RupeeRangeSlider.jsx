import React from 'react';
import './RupeeRangeSlider.css';

const RupeeRangeSlider = ({ min, max, value, onChange }) => {
  return (
    <div className="rupee-range-slider">
      <label className="rupee-range-label">
        <span>Min: ₹{value[0]}</span>
        <span>Max: ₹{value[1]}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        value={value[0]}
        onChange={e => onChange([Number(e.target.value), value[1]])}
        className="rupee-range-input"
        step={100}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={value[1]}
        onChange={e => onChange([value[0], Number(e.target.value)])}
        className="rupee-range-input"
        step={100}
      />
    </div>
  );
};

export default RupeeRangeSlider;
