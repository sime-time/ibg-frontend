export function phoneAutoFormat(phoneInput: string) {
  // remove all non-numeric characters
  const numericInput: string = phoneInput.replace(/[^0-9]/g, "");
  let formatted: string = "";

  // apply formatting rules (###) ###-####
  if (numericInput.length > 0) {
    formatted = "(" + numericInput.substring(0, 3);
  }
  if (numericInput.length > 3) {
    formatted += ") " + numericInput.substring(3, 6);
  }
  if (numericInput.length > 6) {
    formatted += "-" + numericInput.substring(6, 10);
  }
  return formatted;
}
