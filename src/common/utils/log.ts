export function logEvent(log: string, ...rest: unknown[]): void {
  console.info(`Event: ${log}`, ...rest);
}

export function logDebug(log: string, ...rest: unknown[]): void {
  console.log(`DEBUG: ${log}`, ...rest);
}
