import bcrypt from "bcrypt"

const hashPassword = (userPassword) => {
    const saltRound = 10;
    return bcrypt.hash(userPassword, saltRound)
}
  
const comparePassword = (userPassword, hashedPasswod) => {
    return bcrypt.compare(userPassword, hashedPasswod)
}

export { hashPassword, comparePassword }