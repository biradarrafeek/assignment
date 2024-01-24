import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './RuleForm.css';

const RuleForm = () => {
  const [connectorType, setConnectorType] = useState('and');
  const [expressions, setExpressions] = useState([
    { ruleType: 'Age', operator: '>=', value: '', score: '' },
  ]);
  const [formErrors, setFormErrors] = useState({});
  const [ruleSummary, setRuleSummary] = useState('');
  const [formData, setFormData] = useState({
    connectorType: 'and',
    expressions: [{ ruleType: 'Age', operator: '>=', value: '', score: '' }],
  });
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);

  const ruleTypes = ['Age', 'CreditScore', 'AccountBalance'];
  const operators = ['>', '<', '>=', '<=', '='];

  const handleChangeConnectorType = (e) => {
    setConnectorType(e.target.value);
  };

  const handleChangeExpression = (index, field, value) => {
    const newExpressions = [...expressions];
    newExpressions[index][field] = value;
    setExpressions(newExpressions);
  };

  const handleAddExpression = () => {
    setExpressions([...expressions, { ruleType: 'Age', operator: '>=', value: '', score: '' }]);
  };

  const handleDeleteExpression = (index) => {
    const newExpressions = [...expressions];
    newExpressions.splice(index, 1);
    setExpressions(newExpressions);
  };

  const handleSubmit = () => {
    // Validate the form
    if (validateForm()) {
      // Display rule summary
      const summary = JSON.stringify({ rules: expressions, combinator: connectorType }, null, 2);
      setRuleSummary(summary);
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    expressions.forEach((expression, index) => {
      if (!expression.value || isNaN(expression.value)) {
        errors[`value${index}`] = 'Value must be a number.';
        isValid = false;
      }
      if (!expression.score || isNaN(expression.score)) {
        errors[`score${index}`] = 'Score must be a number.';
        isValid = false;
      }
    });

    setFormErrors(errors);
    return isValid;
  };

  const handleClearForm = () => {
    setShowClearConfirmation(true);
  };

  const confirmClearForm = () => {
    setExpressions([{ ruleType: 'Age', operator: '>=', value: '', score: '' }]);
    setConnectorType('and');
    setRuleSummary('');
    setShowClearConfirmation(false);
  };

  const cancelClearForm = () => {
    setShowClearConfirmation(false);
  };

  return (
    <div className="container mt-5">
      <form>
        <div className="mb-3"> 
          <label htmlFor="connectorType" className="form-label">
            Connector Type:
          </label>
          <select
            className="form-select"
            id="connectorType"
            value={connectorType}
            onChange={handleChangeConnectorType}
          >
            <option value="and">AND</option>
            <option value="or">OR</option>
          </select>
        </div>

        {expressions.map((expression, index) => (
          <div key={index} className="mb-3 border p-3 rounded">
            <label className="form-label">Expression {index + 1}:</label>
            <div className="row">
              <div className="col-md-3">
                <select
                  className={`form-select ${formErrors[`ruleType${index}`] ? 'is-invalid' : ''}`}
                  value={expression.ruleType}
                  onChange={(e) => handleChangeExpression(index, 'ruleType', e.target.value)}
                >
                  {ruleTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <select
                  className={`form-select ${formErrors[`operator${index}`] ? 'is-invalid' : ''}`}
                  value={expression.operator}
                  onChange={(e) => handleChangeExpression(index, 'operator', e.target.value)}
                >
                  {operators.map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <input
                  type="text"
                  className={`form-control ${formErrors[`value${index}`] ? 'is-invalid' : ''}`}
                  placeholder="Value"
                  value={expression.value}
                  onChange={(e) => handleChangeExpression(index, 'value', e.target.value)}
                />
                {formErrors[`value${index}`] && (
                  <div className="invalid-feedback">{formErrors[`value${index}`]}</div>
                )}
              </div>
              <div className="col-md-2">
                <input
                  type="text"
                  className={`form-control ${formErrors[`score${index}`] ? 'is-invalid' : ''}`}
                  placeholder="Score"
                  value={expression.score}
                  onChange={(e) => handleChangeExpression(index, 'score', e.target.value)}
                />
                {formErrors[`score${index}`] && (
                  <div className="invalid-feedback">{formErrors[`score${index}`]}</div>
                )}
              </div>
              <div className="col-md-3 d-flex align-items-end">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleDeleteExpression(index)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="d-flex justify-content-end">
          <button type="button" className="btn btn-primary mt-3" onClick={handleAddExpression}>
            Add Expression
          </button>
        </div>

        <div className="d-flex justify-content-between mt-3">
          <button type="button" className="btn btn-warning" onClick={handleClearForm}>
            Clear Form
          </button>
          <button type="button" className="btn btn-success" onClick={handleSubmit}>
            Submit
          </button>
        </div>

        {ruleSummary && (
          <div className="mt-4">
            <h1>OUTPUT:</h1>
            <pre>{ruleSummary}</pre>
          </div>
        )}

        {/* Clear Confirmation Modal */}
        {showClearConfirmation && (
          <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirmation</h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={cancelClearForm}
                  ></button>
                </div>
                <div className="modal-body">Are you sure you want to clear the form?</div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={cancelClearForm}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary" onClick={confirmClearForm}>
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default RuleForm;
