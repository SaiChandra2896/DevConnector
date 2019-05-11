const validator = require("validator");
const isEmpty = require("./isEmpty");

const validateExperienceInput = data => {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : "";
  data.company = !isEmpty(data.company) ? data.company : "";
  data.from = !isEmpty(data.from) ? data.from : "";
  data.location = !isEmpty(data.location) ? data.location : "";

  if (validator.isEmpty(data.title)) {
    errors.title = "Job Title field is required";
  }
  if (validator.isEmpty(data.company)) {
    errors.company = "Company field is required";
  }
  if (validator.isEmpty(data.from)) {
    errors.from = "From date field is required";
  }
  if (validator.isEmpty(data.location)) {
    errors.location = "Location field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validateExperienceInput;
