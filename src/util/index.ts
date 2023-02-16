/**
 * Simple wrapper for executing functions. I think it looks nicer than using IIFEs.
 */
export function run(fn: () => Promise<any>) {
  fn();
}
