const write = (level, message, meta) => {
  const payload = meta ? ` ${JSON.stringify(meta)}` : '';
  console[level](`[${new Date().toISOString()}] ${message}${payload}`);
};

export const logger = {
  info: (message, meta) => write('info', message, meta),
  warn: (message, meta) => write('warn', message, meta),
  error: (message, meta) => write('error', message, meta),
};
