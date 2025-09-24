import React from 'react';

export default function ProgressIndicator({ steps, activeStep }) {
  const progressSteps = steps.map((step, index) => ({
    number: index + 1,
    label: step,
    sublabel: `Step ${index + 1}`
  }));

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem 1rem',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      margin: '0 auto 2rem',
      borderRadius: '16px',
      maxWidth: '1200px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      overflowX: 'auto'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        minWidth: '900px',
        maxWidth: '1100px'
      }}>
        {progressSteps.map((step, idx) => (
          <React.Fragment key={step.number}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem',
              position: 'relative'
            }}>
              {/* Circle indicator with enhanced design */}
              <div style={{
                width: '45px',
                height: '45px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 'bold',
                color: 'white',
                background: idx < activeStep ? 'linear-gradient(135deg, #10b981, #059669)' : 
                           idx === activeStep ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 
                           'linear-gradient(135deg, #94a3b8, #64748b)',
                border: idx === activeStep ? '3px solid #bfdbfe' : 
                        idx < activeStep ? '3px solid #a7f3d0' : '3px solid #e2e8f0',
                boxShadow: idx <= activeStep ? '0 6px 20px rgba(59, 130, 246, 0.3)' : '0 3px 12px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: idx === activeStep ? 'scale(1.05)' : 'scale(1)',
                zIndex: 2
              }}>
                {idx < activeStep ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20,6 9,17 4,12"></polyline>
                  </svg>
                ) : step.number}
              </div>
              
              {/* Labels with enhanced typography */}
              <div style={{
                textAlign: 'center',
                color: idx <= activeStep ? '#1e293b' : '#64748b',
                transition: 'color 0.3s ease',
                maxWidth: '120px'
              }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  marginBottom: '2px',
                  letterSpacing: '0.025em',
                  lineHeight: '1.2'
                }}>
                  {step.label}
                </div>
                <div style={{
                  fontSize: '10px',
                  opacity: 0.7,
                  fontWeight: '500'
                }}>
                  {step.sublabel}
                </div>
              </div>
            </div>
            
            {/* Enhanced connector line */}
            {idx < progressSteps.length - 1 && (
              <div style={{
                flex: 1,
                height: '3px',
                background: idx < activeStep ? 
                  'linear-gradient(90deg, #10b981, #059669)' : 
                  'linear-gradient(90deg, #e2e8f0, #cbd5e1)',
                marginBottom: '3.5rem',
                borderRadius: '2px',
                transition: 'all 0.5s ease',
                position: 'relative',
                zIndex: 1,
                maxWidth: '60px',
                minWidth: '40px'
              }}>
                {/* Animated progress fill */}
                {idx < activeStep && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                    borderRadius: '2px',
                    animation: 'shimmer 2s infinite'
                  }} />
                )}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      
      {/* Add shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}



















