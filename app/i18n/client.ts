'use client'

import { useEffect, useCallback, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import i18next from 'i18next'
import { initReactI18next, useTranslation as useTranslationOrg } from 'react-i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import siteMetadata from '@/data/siteMetadata'

const { fallbackLanguage: defaultLocale, languages: locales } = siteMetadata
export const cookieName = 'i18next'

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(resourcesToBackend((language, namespace) =>
    import(`./locales/${language}/${namespace}.json`)
  ))
  .init({
    supportedLngs: locales,
    fallbackLng: defaultLocale,
    lng: defaultLocale,
    fallbackNS: 'basic',
    defaultNS: 'basic',
    ns: 'basic',
    detection: {
      order: ['path', 'htmlTag', 'cookie', 'navigator'],
      caches: ['cookie'],
      lookupCookie: cookieName
    },
    interpolation: {
      escapeValue: false
    }
  })
export function useTranslation(lng, ns, options = {}) {
  const router = useRouter()
  const pathname = usePathname()
  const [initialized, setInitialized] = useState(false)

  const ret = useTranslationOrg(ns, options)
  const { i18n } = ret

  // 安全的语言切换函数
  const changeLanguageSafe = useCallback(async (newLng) => {
    if (i18n.resolvedLanguage === newLng) return

    // 1. 先改变cookie
    document.cookie = `${cookieName}=${newLng}; path=/; max-age=31536000; SameSite=Lax`

    // 2. 等待语言切换完成
    await i18n.changeLanguage(newLng)

    // 3. 更新路由（如果需要）
    const currentPath = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/')
    router.push(`/${newLng}${currentPath}`)
  }, [i18n, pathname, router])

  // 初始化语言状态
  useEffect(() => {
    if (!initialized && lng && i18n.resolvedLanguage !== lng) {
      changeLanguageSafe(lng).then(() => setInitialized(true))
    }
  }, [lng, i18n, initialized, changeLanguageSafe])

  // 处理路由变化时的语言同步
  useEffect(() => {
    const handleRouteChange = () => {
      const currentLng = pathname.split('/')[1]
      if (locales.includes(currentLng) && currentLng !== i18n.resolvedLanguage) {
        changeLanguageSafe(currentLng)
      }
    }

    handleRouteChange()
    window.addEventListener('popstate', handleRouteChange)
    return () => window.removeEventListener('popstate', handleRouteChange)
  }, [pathname, i18n, changeLanguageSafe])

  return {
    ...ret,
    changeLanguage: changeLanguageSafe // 暴露安全的语言切换方法
  }
}
