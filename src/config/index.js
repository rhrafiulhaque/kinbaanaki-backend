const dotenv = require('dotenv')
const path = require('path')
dotenv.config({ path: path.join(process.cwd(), '.env') })

module.exports = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    bycrpt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    jwt: {
        jwt_secret: 'Hello Bangladesh',
        jwt_expires: '1d'
    }
}
