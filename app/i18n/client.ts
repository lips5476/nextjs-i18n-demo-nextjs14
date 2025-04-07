'use client'

import { useEffect, useState } from 'react'
import i18next from 'i18next'
import { initReactI18next, useTranslation as useTranslationOrg } from 'react-i18next'
import { useCookies } from 'react-cookie'
import resourcesToBackend from 'i18next-resources-to-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import siteMetadata from '@/data/siteMetadata'

const { fallbackLanguage: defaultLocale, languages: locales } = siteMetadata
export const cookieName = 'i18next'

const runsOnServerSide = typeof window === 'undefined'

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(resourcesToBackend((language, namespace) => import(`./locales/${language}/${namespace}.json`)))
  .init({
    supportedLngs: locales,
    fallbackLng: defaultLocale,
    lng: defaultLocale,
    fallbackNS: 'basic',
    defaultNS: 'basic',
    ns: 'basic',
    detection: {
      order: ['path', 'htmlTag', 'cookie', 'navigator'],
    },
    preload: runsOnServerSide ? locales : []
  })


export function useTranslation(lng, ns, options = {}) {
  const ret = useTranslationOrg(ns, options)
  const { i18n } = ret

  useEffect(() => {
    if (runsOnServerSide && lng && i18n.resolvedLanguage !== lng) {
      i18n.changeLanguage(lng)
    }
  }, [lng, i18n])

  useEffect(() => {
    if (!runsOnServerSide) {
      const currentLanguage = i18n.resolvedLanguage
      if (lng && currentLanguage !== lng) {
        i18n.changeLanguage(lng)
      }
      // 使用原生 cookie 操作替代 react-cookie
      const currentCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith(`${cookieName}=`))
        ?.split('=')[1]

      if (lng && currentCookie !== lng) {
        document.cookie = `${cookieName}=${lng}; path=/`
      }
    }
  }, [lng, i18n])

  return ret
}
