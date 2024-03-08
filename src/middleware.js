import { NextResponse } from 'next/server'
import { endPointApi } from './helper/endPointApi';
const { apiToken } = endPointApi;
export async function middleware(request) {
     let { value: token } = request.cookies.get('token');
     console.log(token);
     const res = await fetch(`${process.env.API}/${apiToken}`,
          {
               method: 'POST',
               headers: {
                    "Authorization": `Bearer${token}`
               }
          });
     const data = await res.json();
     if (request.url !== `${process.env.LOCALHOST}/auth/dang-nhap`) {
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
     matcher: ['/', '/auth/dang-nhap']
}