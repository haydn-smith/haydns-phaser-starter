export function logEvent(log: string, ...rest: unknown[]): void {
  console.info(`Event: ${log}`, ...rest);
}

export function logDebug(log: string, ...rest: unknown[]): void {
  console.log(`Debug: ${log}`, ...rest);
}

export function logWarn(log: string, ...rest: unknown[]): void {
  console.warn(`Warn: ${log}`, ...rest);
}
