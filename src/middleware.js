import { NextResponse } from 'next/server'
import { endPointApi } from './helper/endPointApi';
const { API_TOKEN } = endPointApi;
export async function middleware(request) {
     const token = request.cookies.get('token');
     const res = await fetch(`${process.env.API}/${API_TOKEN}`,
          {
               method: 'POST',
               headers: {
                    "Authorization": `Bearer${token?.value}`
               }
          });
     const data = await res.json();
     console.log(data);
     const { pathname } = request.nextUrl;
     if (pathname !== '/auth/dang-nhap') {
          if (data.status === 401) {
               console.log(1);
               return NextResponse.redirect(new URL('/auth/dang-nhap', request.url));
          }
     } else {
          if (data.status === 200) {
               return NextResponse.redirect(new URL('/', request.url));
          }
     }
     return null;
}
export const config = {
     matcher: ['/', '/auth/dang-nhap', '/categories:path*', '/courses:path*', '/users:path*']
}