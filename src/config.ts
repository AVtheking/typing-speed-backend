const getConfig = () => {
  const jwtAccessSecret = process.env.JWT_ACCESS_SECRET;

  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

  const jwtResetSecret = process.env.JWT_RESET_SECRET;

  const SMTP_HOST = process.env.SMTP_HOST;

  const EMAIL = process.env.EMAIL;

  const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

  return {
    jwtAccessSecret,
    jwtRefreshSecret,
    jwtResetSecret,
    SMTP_HOST,
    EMAIL,
    EMAIL_PASSWORD,
  };
};

export const Env = getConfig();
