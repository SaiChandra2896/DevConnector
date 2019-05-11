const validator = require("validator");
const isEmpty = require("./isEmpty");

const validateEducationInput = data => {
  let errors = {};

  data.college = !isEmpty(data.college) ? data.college : "";
  data.degree = !isEmpty(data.degree) ? data.degree : "";
  data.fieldofStudy = !isEmpty(data.fieldofStudy) ? data.fieldofStudy : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  if (validator.isEmpty(data.college)) {
    errors.college = "College field is required";
  }
  if (validator.isEmpty(data.degree)) {
    errors.degree = "Degree field is required";
  }
  if (validator.isEmpty(data.from)) {
    errors.from = "From date field is required";
  }
  if (validator.isEmpty(data.fieldofStudy)) {
    errors.fieldofStudy = "FieldofStudy field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validateEducationInput;
