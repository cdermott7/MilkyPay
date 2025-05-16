// Frontend type declarations

// Declare missing module types
declare module 'cors';
declare module 'express';
declare module 'twilio';
declare module 'dotenv';

// Explicitly mark backend modules as external
declare module './routes' {
  const routes: any;
  export default routes;
}

declare module './controllers/*' {
  export const anyController: any;
}