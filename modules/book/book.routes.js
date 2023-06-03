
import { Router } from 'express';
import { errorHandling } from './../../utils/errorhandling.js';
import * as book_controller from './book.controller.js'
import { auth } from './../../middleware/Authintication.js';
import { multerFunction, validationObject } from '../../services/multer.js';
const router = Router()

router.post('/add',multerFunction({filevalidation:validationObject.image,customPath:'books/profile'}).single('image'),errorHandling(book_controller.addBook))
router.post('/issu/:bookId',auth(),errorHandling(book_controller.issueBook))
router.get('/',errorHandling(book_controller.getAllBooks))
router.get('/issued',auth(),errorHandling(book_controller.getIssuedBooks))
router.get('/notreturned',auth(),errorHandling(book_controller.getNotReturnedBooks))
router.get('/:search',auth(),errorHandling(book_controller.searchBooks))
router.patch('/:bookId',auth(),errorHandling(book_controller.returnBook))


export default router