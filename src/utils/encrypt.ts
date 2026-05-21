import bcrypt from "bcryptjs";

export const encrypt = async (stringToEncrypt: string, salt: number) => {
  return await bcrypt.hash(stringToEncrypt, salt);
};
