import crypto from 'crypto';

// create an MD5 hash of the string and output it in hexadecimal format.
const hashString = (string) => crypto.createHash('md5').update(string).digest('hex')

export default hashString