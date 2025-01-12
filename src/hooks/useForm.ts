import { useState } from 'react';

interface FormField {
  value: string;
  error?: string;
}

interface FormState {
  [key: string]: FormField;
}

const useForm = (initialValues: FormState) => {
  const [formState, setFormState] = useState<FormState>(initialValues);

  const handleChange = (name: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        value,
        error: '', // Clear error on change
      },
    }));
  };

  const validate = (validators: { [key: string]: (value: string) => string | undefined }) => {
    let isValid = true;
    const newFormState = { ...formState };

    for (const key in validators) {
      const error = validators[key](newFormState[key].value);
      if (error) {
        isValid = false;
        newFormState[key].error = error;
      }
    }

    setFormState(newFormState);
    return isValid;
  };

  const resetForm = () => {
    setFormState(initialValues);
  };

  return {
    formState,
    handleChange,
    validate,
    resetForm,
  };
};

export default useForm;