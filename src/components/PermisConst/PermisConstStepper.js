import React, { useState } from 'react';
import { steps } from './stepsConfig';

const PermisConstStepper = () => {
  const [etapeActive, setEtapeActive] = useState(1);

  const afficherContenuEtape = () => {
    switch (etapeActive) {
      case 1:
        return <div>Page Identification</div>;
      case 2:
        return <div>Page Renseignement Architectural</div>;
      case 3:
        return <div>Page Renseignement Technique</div>;
      case 4:
        return <div>Page Pièces Jointes</div>;
      default:
        return <div>Étape non reconnue</div>;
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Stepper Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        {steps.map((step) => (
          <button
            key={step.id}
            onClick={() => setEtapeActive(step.id)}
            style={{
              padding: '12px 24px',
              background: etapeActive === step.id ? '#1976d2' : '#f5f5f5',
              color: etapeActive === step.id ? '#fff' : '#666',
              border: '1px solid #ddd',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '500',
              minWidth: '160px',
              justifyContent: 'center'
            }}
          >
            <span style={{ fontSize: '20px' }}>
              {step.icon}
            </span>
            {step.title}
          </button>
        ))}
      </div>
      
      {/* Contenu de l'étape */}
      <div style={{ 
        border: '1px solid #e0e0e0', 
        borderRadius: '8px', 
        padding: '24px',
        minHeight: '400px'
      }}>
        {afficherContenuEtape()}
      </div>

      {/* Navigation entre les étapes */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginTop: '24px',
        gap: '12px'
      }}>
        <button
          onClick={() => setEtapeActive(prev => Math.max(prev - 1, 1))}
          disabled={etapeActive === 1}
          style={{
            padding: '10px 20px',
            background: etapeActive === 1 ? '#f5f5f5' : '#1976d2',
            color: etapeActive === 1 ? '#999' : '#fff',
            border: '1px solid #ddd',
            borderRadius: '6px',
            cursor: etapeActive === 1 ? 'not-allowed' : 'pointer',
            fontWeight: '500'
          }}
        >
          Précédent
        </button>
        
        <button
          onClick={() => setEtapeActive(prev => Math.min(prev + 1, steps.length))}
          disabled={etapeActive === steps.length}
          style={{
            padding: '10px 20px',
            background: etapeActive === steps.length ? '#f5f5f5' : '#1976d2',
            color: etapeActive === steps.length ? '#999' : '#fff',
            border: '1px solid #ddd',
            borderRadius: '6px',
            cursor: etapeActive === steps.length ? 'not-allowed' : 'pointer',
            fontWeight: '500'
          }}
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default PermisConstStepper;