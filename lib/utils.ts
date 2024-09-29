export function formatEther(amount: string) {
  const num = parseFloat(amount);
  const eth = (num / 1e18).toFixed(2);

  return eth;
}
