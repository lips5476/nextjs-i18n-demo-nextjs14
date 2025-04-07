
import { useTranslation as translation } from "@/app/i18n/index"

export default async function Home(props: any) {
  const { lng } = props.params;

  const { t } = await translation(lng);
  return (
    <div className="w-[300px] h-[300px] bg-sky-400 m-auto mt-[30px] text-center leading-[300px]">{t('home')} {lng}</div>
  );
}
