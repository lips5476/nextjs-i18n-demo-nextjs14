import { NextRequest, NextResponse } from "next/server";
import acceptLanguage from 'accept-language'
import siteMetadata from "./data/siteMetadata";



const { fallbackLanguage, languages } = siteMetadata;
acceptLanguage.languages(languages)


const publicFile = /\.(.*)$/
const excludeFile: string[] = []

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)']
}

function getLocale(req: Request) {
  const needLanguage = acceptLanguage.get(req.headers.get('Accept-Language')) || fallbackLanguage;
  return needLanguage;
}


export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const filtedlanguage = languages.filter((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);


  if (filtedlanguage.length > 0) {
    if (filtedlanguage[0] === fallbackLanguage) {
      const url = pathname.replace(`/${fallbackLanguage}`, '');
      //   /zh  => https://xxx.com/zh
      return NextResponse.redirect(new URL(url ? url : '/', request.url))
    }
    return
  }

  // 公共文件夹路径有这个路径 且排除文件的数组里也没有该路径
  if (publicFile.test(pathname) && excludeFile.indexOf(pathname.substring(1)) === -1) return
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`


  if (locale === fallbackLanguage) {
    return NextResponse.rewrite(request.nextUrl)
  }

}
