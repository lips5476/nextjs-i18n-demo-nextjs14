'use client';

import { useTranslation } from "@/app/i18n/client"
export default function Like({ lng }: { lng: string }) {
  const { t } = useTranslation(lng, 'basic')
  return <button className="w-[50px] h-[50px] bg-pink-400 text-center leading-[50px]" onClick={() => {
    console.log(t('like'))
  }}>{t('like')}</button>
}
