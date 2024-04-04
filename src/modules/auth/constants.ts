import { SetMetadata } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();

export const jwtConstants = {
  secret: process.env.JWT_SECRET,
};

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// PASSAR PARA O MODULE PARA TORNAR TUDO PROTEGIDO
// providers: [
//   {
//     provide: APP_GUARD,
//     useClass: AuthGuard,
//   },
// ],
