import bcrypt from 'bcryptjs';

export const hashFunction = (
    {
        payload='',
        saltRounds =+process.env.SALT_ROUND
    }
) => {
  if (payload == '') {
    return false;
  }
  const hashedpayload = bcrypt.hashSync(payload,saltRounds);
  return hashedpayload;
}

export const compareFunction = (
    {
        payload='',
        Referenceddata = ''
    }) =>{
        if (payload == '') {
            return false;
        }
        const match = bcrypt.compareSync(payload,Referenceddata);
        return match;
    }
