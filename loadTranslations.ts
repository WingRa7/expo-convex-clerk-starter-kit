const translations: Record<string, any> = {
  es: require("./content/es.json"),
  fr: require("./content/fr.json"),
  ja: require("./content/ja.json"),
};

export function loadTranslations(locale: string) {
  return translations[locale] ?? {};
}
