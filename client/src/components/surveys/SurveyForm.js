import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { Link } from "react-router-dom";
import SurveyField from "./SurveyField";
import validateEmails from "../../utils/validateEmails";
import formFields from "./formFields";

class SurveyForm extends Component {
  renderFields() {
    return formFields.map(fieldProps => {
      // The "name" property of the Field object is the name of the key where
      // the value entered in will be stored in the Redux store
      return (
        <Field
          key={fieldProps.name}
          component={SurveyField}
          type="text"
          {...fieldProps}
        />
      );
    });
  }

  render() {
    return (
      <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
        {this.renderFields()}
        <Link to="/surveys" className="red btn-flat white-text">
          Cancel
        </Link>
        <button type="submit" className="teal btn-flat right white-text">
          Next
          <i className="material-icons right">chevron_right</i>
        </button>
      </form>
    );
  }
}

// Recieves an object containing all values received from the fields
// in the form. An "errors" object is returned from this function. If "errors"
// is not empty, reduxForm will detect that and handleSubmit() will not be
// called (i.e. the form values will not be submitted)
function validate(values) {
  const errors = {};

  errors.recipients = validateEmails(values.recipients || "");

  formFields.forEach(({ name }) => {
    if(!values[name]) {
      errors[name] = "You must provide a value for this field";
    }
  });

  return errors;
}

// reduxForm() acts like the connect() helper from the redux library.
// It also provides a handleSubmit() function (which is passed as a prop) to the component.
// The form name "surveyForm" is specified so redux forms know what to
// name the form it in the redux store
export default reduxForm({
  validate: validate,
  form: "surveyForm",
  destroyOnUnmount: false
})(SurveyForm);
