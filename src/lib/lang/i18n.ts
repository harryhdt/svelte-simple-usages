// import createLang from '$lib/lang/lang.svelte';
import { createLang } from 'svelte-simple-lang';
import id from '$lib/lang/id.json';
import en from '$lib/lang/en.json';

const i18n = createLang({
	defaultLocale: 'id',
	defaultSource: id,
	sources: {
		id,
		en,
		jp: async () => {
			const res = await fetch('/locales/jp.json');
			return { default: await res.json() };
		}
	}
});

export const { t, getLocale, setLocale, resetLocale, setDefaultLocale, availableLocales } = i18n;
export default i18n;
