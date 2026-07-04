export const useFormError = () => ({
  getFieldError: (errors, field) => errors?.[field]?.message || '',
});
