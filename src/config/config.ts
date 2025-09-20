export const config = {
  // Bcrypt
  hashSaltRounds: 10,

  // JWT
  jwt: {
    // Đang chưa hiểu env lắm
    accessSecret:  'supper_secret', //|| process.env.JWT_SECRET_ACCESS,
    refreshSecret: 'supper_secret', //|| process.env.JWT_SECRET_REFRESH,
    accessExpire: 60 * 30,        // 30 phút
    refreshExpire: 60 * 60 * 24,  // 1 ngày
  },

  // Database
  db: {
    url: process.env.DATABASE_URL || 'postgresql://user:pass@localhost:5432/db',
  },

  // Mail service (optional, để reset password / notification)
  // Gợi ý nhưng chưa đụng vì ko có tiền =)))
//   mail: {
//     host: process.env.MAIL_HOST || 'smtp.gmail.com',
//     port: Number(process.env.MAIL_PORT) || 587,
//     user: process.env.MAIL_USER || '',
//     pass: process.env.MAIL_PASS || '',
//   },

};
