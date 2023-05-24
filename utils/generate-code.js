//generate random 6-digit number and make it string
const generateCode = () => String(Math.floor(100000 + Math.random() * 900000)); 

export default generateCode