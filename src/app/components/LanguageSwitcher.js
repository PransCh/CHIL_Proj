// components/LanguageSwitcher.js
// Correct import for app directory
import { useRouter } from 'next/navigation';

export default function LanguageSwitcher() {
  const router = useRouter();
  const locales = ['en', 'fr']; // Define your locales

  const switchLocale = (newLocale) => {
    const path = router.pathname;
    router.push(path, path, { locale: newLocale });
  };

  return (
    <div>
      {locales.map((locale) => (
        <button key={locale} onClick={() => switchLocale(locale)}>
          {locale === 'en' ? 'English' : locale === 'fr' ? 'French' : locale}
        </button>
      ))}
    </div>
  );
}
