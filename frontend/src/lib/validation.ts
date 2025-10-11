export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
  custom?: (value: unknown) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export class FormValidator {
  // Validate a single field
  static validateField(value: unknown, rules: ValidationRule): string | null {
    const strValue = String(value || "").trim();

    // Required check
    if (rules.required && (!value || strValue === "")) {
      return "This field is required";
    }

    // Skip other validations if field is empty and not required
    if (!rules.required && strValue === "") {
      return null;
    }

    // String length validations
    if (rules.minLength && strValue.length < rules.minLength) {
      return `Must be at least ${rules.minLength} characters long`;
    }

    if (rules.maxLength && strValue.length > rules.maxLength) {
      return `Must be no more than ${rules.maxLength} characters long`;
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(strValue)) {
      return "Invalid format";
    }

    // Numeric validations
    if (typeof value === "number" || !isNaN(Number(strValue))) {
      const numValue = Number(strValue);

      if (rules.min !== undefined && numValue < rules.min) {
        return `Must be at least ${rules.min}`;
      }

      if (rules.max !== undefined && numValue > rules.max) {
        return `Must be no more than ${rules.max}`;
      }
    }

    // Custom validation
    if (rules.custom) {
      const customError = rules.custom(value);
      if (customError) {
        return customError;
      }
    }

    return null;
  }

  // Validate an entire form
  static validateForm(
    data: Record<string, unknown>,
    rules: Record<string, ValidationRule>
  ): ValidationResult {
    const errors: Record<string, string> = {};

    Object.keys(rules).forEach((fieldName) => {
      const fieldValue = data[fieldName];
      const fieldRules = rules[fieldName];
      const error = this.validateField(fieldValue, fieldRules);

      if (error) {
        errors[fieldName] = error;
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}

// Common validation patterns
export const ValidationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  zipCode: /^\d{5}(-\d{4})?$/,
  url: /^https?:\/\/.+/,
  alphaNumeric: /^[a-zA-Z0-9]+$/,
  numbersOnly: /^\d+$/,
  lettersOnly: /^[a-zA-Z\s]+$/,
};

// Pre-defined validation rules for common fields
export const CommonValidationRules = {
  email: {
    required: true,
    pattern: ValidationPatterns.email,
    maxLength: 254,
    custom: (value: unknown) => {
      const email = String(value || "").toLowerCase();
      if (email && !ValidationPatterns.email.test(email)) {
        return "Please enter a valid email address";
      }
      return null;
    },
  },

  password: {
    required: true,
    minLength: 8,
    maxLength: 128,
    custom: (value: unknown) => {
      const password = String(value || "");
      if (password && !ValidationPatterns.password.test(password)) {
        return "Password must contain at least 8 characters with uppercase, lowercase, and number";
      }
      return null;
    },
  },

  confirmPassword: (originalPassword: string) => ({
    required: true,
    custom: (value: unknown) => {
      if (String(value || "") !== originalPassword) {
        return "Passwords do not match";
      }
      return null;
    },
  }),

  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: ValidationPatterns.lettersOnly,
    custom: (value: unknown) => {
      const name = String(value || "").trim();
      if (name && !ValidationPatterns.lettersOnly.test(name)) {
        return "Name can only contain letters and spaces";
      }
      return null;
    },
  },

  phone: {
    required: true,
    pattern: ValidationPatterns.phone,
    custom: (value: unknown) => {
      const phone = String(value || "").replace(/\D/g, "");
      if (phone && (phone.length < 10 || phone.length > 15)) {
        return "Please enter a valid phone number";
      }
      return null;
    },
  },

  address: {
    required: true,
    minLength: 5,
    maxLength: 200,
  },

  city: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: ValidationPatterns.lettersOnly,
  },

  zipCode: {
    required: true,
    pattern: ValidationPatterns.zipCode,
    custom: (value: unknown) => {
      const zip = String(value || "");
      if (zip && !ValidationPatterns.zipCode.test(zip)) {
        return "Please enter a valid ZIP code (e.g., 12345 or 12345-6789)";
      }
      return null;
    },
  },

  price: {
    required: true,
    min: 0.01,
    max: 999999.99,
    custom: (value: unknown) => {
      const price = Number(value);
      if (isNaN(price) || price <= 0) {
        return "Please enter a valid price greater than 0";
      }
      return null;
    },
  },

  quantity: {
    required: true,
    min: 1,
    max: 999999,
    custom: (value: unknown) => {
      const qty = Number(value);
      if (!Number.isInteger(qty) || qty < 1) {
        return "Quantity must be a positive whole number";
      }
      return null;
    },
  },

  productName: {
    required: true,
    minLength: 3,
    maxLength: 100,
  },

  description: {
    required: true,
    minLength: 10,
    maxLength: 1000,
  },

  category: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
};

// Validation rule sets for common forms
export const FormValidationRules = {
  // User registration
  register: {
    firstName: CommonValidationRules.name,
    lastName: CommonValidationRules.name,
    email: CommonValidationRules.email,
    password: CommonValidationRules.password,
    confirmPassword: CommonValidationRules.confirmPassword(""), // Will be set dynamically
  },

  // User login
  login: {
    email: CommonValidationRules.email,
    password: { required: true, minLength: 1 }, // Less strict for login
  },

  // User profile update
  profile: {
    firstName: CommonValidationRules.name,
    lastName: CommonValidationRules.name,
    email: CommonValidationRules.email,
    phone: { ...CommonValidationRules.phone, required: false },
  },

  // Address form
  address: {
    street: CommonValidationRules.address,
    city: CommonValidationRules.city,
    state: {
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    zipCode: CommonValidationRules.zipCode,
    country: {
      required: true,
      minLength: 2,
      maxLength: 50,
    },
  },

  // Product creation/update
  product: {
    name: CommonValidationRules.productName,
    description: CommonValidationRules.description,
    price: CommonValidationRules.price,
    category: CommonValidationRules.category,
    stock: CommonValidationRules.quantity,
  },

  // Checkout form
  checkout: {
    firstName: CommonValidationRules.name,
    lastName: CommonValidationRules.name,
    email: CommonValidationRules.email,
    phone: CommonValidationRules.phone,
    street: CommonValidationRules.address,
    city: CommonValidationRules.city,
    state: {
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    zipCode: CommonValidationRules.zipCode,
    country: {
      required: true,
      minLength: 2,
      maxLength: 50,
    },
  },
};

// Helper function to create dynamic validation rules
export const createValidationRules = (
  baseRules: Record<string, ValidationRule>,
  overrides: Record<string, Partial<ValidationRule>> = {}
) => {
  const rules = { ...baseRules };

  Object.keys(overrides).forEach((fieldName) => {
    if (rules[fieldName]) {
      rules[fieldName] = { ...rules[fieldName], ...overrides[fieldName] };
    } else {
      rules[fieldName] = overrides[fieldName] as ValidationRule;
    }
  });

  return rules;
};

// React hook for form validation
export const useFormValidation = (
  initialRules: Record<string, ValidationRule>
) => {
  const validateField = (fieldName: string, value: unknown) => {
    const rules = initialRules[fieldName];
    if (!rules) return null;

    return FormValidator.validateField(value, rules);
  };

  const validateForm = (data: Record<string, unknown>) => {
    return FormValidator.validateForm(data, initialRules);
  };

  const validateFields = (
    data: Record<string, unknown>,
    fieldNames: string[]
  ) => {
    const filteredRules: Record<string, ValidationRule> = {};
    fieldNames.forEach((fieldName) => {
      if (initialRules[fieldName]) {
        filteredRules[fieldName] = initialRules[fieldName];
      }
    });

    return FormValidator.validateForm(data, filteredRules);
  };

  return {
    validateField,
    validateForm,
    validateFields,
    rules: initialRules,
  };
};
