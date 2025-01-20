// Form validation utilities
export const validate = {
    required: (value) => value?.trim().length > 0,
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    minLength: (value, min) => value?.length >= min,
    maxLength: (value, max) => value?.length <= max
};