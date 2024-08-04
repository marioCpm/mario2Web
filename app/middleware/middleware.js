import { NextResponse } from 'next/server';
import { getToken, getUser } from '@auth0/nextjs-auth0';

export async function middleware(request) {
  try {
    console.log("wiwiwiwiwiwiwiwiwiw middlewere")
    const session = getToken(request);
    if (!session || !session.accessToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const user = await getUser(request, session.accessToken);
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const userB64 = Buffer.from(JSON.stringify(user)).toString('base64');
    const response = NextResponse.next();
    response.headers.set('aui', userB64);
    console.log(userB64)

    return response;
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
