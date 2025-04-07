import { createInstance } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from 'react-i18next/initReactI18next';
import siteMetadata from "@/data/siteMetadata";

const { fallbackLanguage, languages } = siteMetadata

const initI18next = async (lng: string = fallbackLanguage, ns: string = 'basic') => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(resourcesToBackend((language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`)))
    .init({
      supportedLngs: languages,
      fallbackLng: fallbackLanguage,
      lng: lng,
      ns,
      defaultNS: 'basic',
      fallbackNS: 'basic',
    })
  return i18nInstance
}



export async function useTranslation(lng: string, ns: string = 'basic', options = {}) {
  const i18nextInstance = await initI18next(lng, ns);
  return {
    t: i18nextInstance.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns, options.keyPrefix),
    i18n: i18nextInstance,
  }
}
