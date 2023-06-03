import multer from 'multer'
import { nanoid } from 'nanoid';
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
const __direname = path.dirname(fileURLToPath(import.meta.url));

export const validationObject = {
    image:['image/png', 'image/jpeg'],
    files:['application/pdf']
}

export const multerFunction = ({filevalidation=validationObject.image,customPath = 'general'} ={}) => {
  
const fullpath = path.join(__direname,`../uploads/${customPath}`);
if (!fs.existsSync(fullpath)) {
    fs.mkdirSync(fullpath,{recursive:true})
}
    const storage = multer.diskStorage({
        distination:(req,file,cb) => {
          cb(null,fullpath)
        },
        filename:(req,file,cb) => {
          const uniquename = nanoid() + '__' + file.originalname;
          cb(null,uniquename)
        }    
    })

    const fileFilter = (req,file,cb) => {
      if (filevalidation.includes(file.mimetype)) {
        cb(null,true)
      }else{
        return cb(new Error('Invalid file type/extension'),false)
      }
    }
    



const uploads = multer({fileFilter,storage})
return uploads
}


export const multerFunctionCoudinary = ({filevalidation=validationObject.image} ={}) => {
  
  
      const storage = multer.diskStorage({})
  
      const fileFilter = (req,file,cb) => {
        if (filevalidation.includes(file.mimetype)) {
          cb(null,true)
        }else{
          return cb(new Error('Invalid file type/extension'),false)
        }
      }
      
  
  
  
  const uploads = multer({fileFilter,storage})
  return uploads
  }
