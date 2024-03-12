import { NextResponse } from 'next/server'
import { endPointApi } from './helper/endPointApi';
const { API_TOKEN } = endPointApi;
export async function middleware(request) {
     let object = request.cookies.get('token');
     const res = await fetch(`${process.env.API}/${API_TOKEN}`,
          {
               method: 'POST',
               headers: {
                    "Authorization": `Bearer${object?.value}`
               }
          });
     const data = await res.json();
     const { pathname } = request.nextUrl;
     if (pathname !== '/auth/dang-nhap') {
          if (data.status === 401) {
               return NextResponse.redirect(new URL('/auth/dang-nhap', request.url));
          }
     } else {
          if (data.status === 200) {
               return NextResponse.redirect(new URL('/', request.url));
          }
     }
}
export const config = {
     matcher: ['/', '/auth/dang-nhap', '/categories:path*', '/courses:path*']
}