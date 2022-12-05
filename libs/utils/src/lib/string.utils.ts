export const zeroPad = (number: number) => {
  return number <= 9999 ? `000${number}`.slice(-2) : number;
}
