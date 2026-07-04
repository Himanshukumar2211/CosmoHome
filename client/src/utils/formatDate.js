export const formatDate = (value, options = {}) =>
  value ? new Intl.DateTimeFormat('en-IN', options).format(new Date(value)) : '';
