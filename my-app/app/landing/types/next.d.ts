import 'next';

declare module 'next' {
  import { File } from 'multer';

  interface NextApiRequest {
    file?: File; // Single file
    files?: File[]; // Multiple files (if needed)
  }
}