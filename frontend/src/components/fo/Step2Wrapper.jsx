import React from 'react';
import Step2 from './Step2';

const Step2Wrapper = ({ participants, onChange }) => {
  return (
    <div>
      {participants.map((data, index) => (
        <div key={index} className="border p-3 mb-4 rounded shadow-sm">
          <h5 className="mb-3">Participant {index + 1}</h5>
          <Step2 data={data} onChange={(e) => onChange(index, e)} />
        </div>
      ))}
    </div>
  );
};

export default Step2Wrapper;
