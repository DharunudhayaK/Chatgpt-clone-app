const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const validateEmail = (value) => {
  const isValid = emailRegex.test(value);
  return { value, isValid };
};

const validatePassword = (value) => {
  const isValid = passwordRegex.test(value);
  return { value, isValid };
};

export { validateEmail, validatePassword };
