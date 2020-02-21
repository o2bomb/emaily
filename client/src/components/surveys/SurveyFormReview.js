import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import formFields from "./formFields";
import * as actions from "../../actions";

const SurveyFormReview = ({ onCancel, formValues, submitSurvey, history }) => {
  const renderFields = formFields.map(fieldProps => {
    return (
      <div key={fieldProps.name}>
        <label>{fieldProps.label}</label>
        <div>{formValues[fieldProps.name]}</div>
      </div>
    );
  });

  return (
    <div>
      <h5>Please confirm your entries</h5>
      <div>{renderFields}</div>
      <button className="teal btn-flat white-text" onClick={onCancel}>
        Back
        <i className="material-icons right">chevron_left</i>
      </button>
      <button
        className="green btn-flat white-text right"
        onClick={() => submitSurvey(formValues, history)}
      >
        Send Survey
        <i className="material-icons right">email</i>
      </button>
    </div>
  );
};

// Takes Redux state and transforms it into props
// passed to this component (console.log(state) to find out more)
function mapStateToProps(state) {
  return {
    formValues: state.form.surveyForm.values
  };
}

// withRouter passes a "history" prop to this component. The history object is 
// passed into the submitSurvey() action creator so that it can navigate to the
// /surveys route when a survey has been created
export default connect(mapStateToProps, actions)(withRouter(SurveyFormReview));
