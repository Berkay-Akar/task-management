/**
 * Validates a Turkish ID number (TC Kimlik No)
 * @param tcKimlikNo The Turkish ID number to validate
 * @returns boolean indicating whether the ID is valid
 */
export function validateTCKimlikNo(tcKimlikNo: string): boolean {
  // TC Kimlik No must be 11 digits
  if (!/^\d{11}$/.test(tcKimlikNo)) {
    return false;
  }

  // First digit cannot be 0
  if (tcKimlikNo[0] === "0") {
    return false;
  }

  // Calculate the 10th digit
  let oddSum = 0;
  let evenSum = 0;

  for (let i = 0; i < 9; i += 2) {
    oddSum += parseInt(tcKimlikNo[i]);
  }

  for (let i = 1; i < 8; i += 2) {
    evenSum += parseInt(tcKimlikNo[i]);
  }

  const digit10 = (oddSum * 7 - evenSum) % 10;

  if (digit10 !== parseInt(tcKimlikNo[9])) {
    return false;
  }

  // Calculate the 11th digit
  const sum = oddSum + evenSum + digit10;
  const digit11 = sum % 10;

  return digit11 === parseInt(tcKimlikNo[10]);
}
