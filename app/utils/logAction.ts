export const logAction = (action: string, details?: Record<string, any>) => {
  console.log(`[LOG] Action: ${action}`, details || {});
};
