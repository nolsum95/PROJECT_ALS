import React from 'react';
import '../../../css/progress-indicator.css';

export default function ProgressIndicator({ steps, activeStep }) {
  return (
    <div className="als-progress-root">
      {steps.map((label, idx) => (
        <div
          key={label}
          className={`als-progress-step${idx === activeStep ? ' active' : ''}${idx < activeStep ? ' completed' : ''}`}
        >
          <span className="als-progress-label">{label}</span>
          {idx < steps.length - 1 && <span className="als-progress-arrow">›</span>}
        </div>
      ))}
    </div>
  );
}



















