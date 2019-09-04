import { FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

export const PassValidator: ValidatorFn = (
  control: FormGroup
): ValidationErrors | null => {
  const password = control.get("password").value;
  const retryPassword = control.get("retryPassword").value;
  return password !== retryPassword ? { doNotMatchPasswords: true } : null;
};
