import { v2 as cloudinary } from 'cloudinary';
 
export async function POST(request: Request) {
  const body = await request.json();
  const { paramsToSign } = body;
 
  const secret = process.env.CLOUDINARY_API_SECRET as string;
  if (!secret) {
    console.error('CLOUDINARY_API_SECRET is not set');
    return Response.json({ message: 'Server configuration error' }, { status: 500 });
  }
  console.log('Signing params with secret length:', secret.length);

  const signature = cloudinary.utils.api_sign_request(paramsToSign, secret);
  
  return Response.json({ signature });
}
