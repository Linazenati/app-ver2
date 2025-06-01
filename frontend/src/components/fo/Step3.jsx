import React from 'react';

const Step3 = ({ data, onChange, error }) => (
  <div>
    <h5>Informations supplémentaires</h5>
    <ul>
      <li>📄 Tous les documents doivent être en format PDF ou JPEG.</li>
      <li>✍️ Les certificats doivent être signés et datés.</li>
      <li>🆔 Joindre une copie de votre pièce d'identité valide.</li>
    </ul>

    <div className="form-check mb-3">
      <input
        className="form-check-input"
        type="checkbox"
        name="accepteConditions"
        id="accepteConditions"
        checked={data.accepteConditions}
        onChange={onChange}
      />
      <label className="form-check-label" htmlFor="accepteConditions">
        J'accepte les conditions d'utilisation et les règles associées.
      </label>
      {error && <div className="text-danger mt-1">Vous devez accepter les conditions pour continuer.</div>}
    </div>
  </div>
);

export default Step3;