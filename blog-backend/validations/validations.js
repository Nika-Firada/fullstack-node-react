import { body } from 'express-validator';

export const loginValidation = [
  body('email', 'wrong email').isEmail(),
  body('password', 'password must be more than 5 char').isLength({ min: 5 }),
];

export const registerValidation = [
  body('email', 'wrong email').isEmail(),
  body('password', 'password must be more than 5 char').isLength({ min: 5 }),
  body('fullName', 'write name').isLength({ min: 3 }),
  body('avatarUrl', 'error url').optional().isURL(),
];

export const postCreateValidation = [
  body('title', 'enter title').isLength({ min: 3 }).isString(),
  body('text', 'enter text').isLength({ min: 3 }).isString(),
  body('tags', 'error tags').optional(),
  body('imageUrl', 'error url').optional().isString(),
];
