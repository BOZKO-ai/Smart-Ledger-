/**
 * Form Field Validation rules for Bookkeeping inputs.
 */
export function validateTransaction(data: {
  description: string;
  amount: number;
  category: string;
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.description || data.description.trim() === "") {
    errors.description = "Description is required.";
  }

  if (isNaN(data.amount) || data.amount <= 0) {
    errors.amount = "Amount must be a positive number.";
  }

  if (!data.category || data.category.trim() === "") {
    errors.category = "Category must be chosen.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
