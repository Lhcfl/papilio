import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import langs from '@/assets/langs.json';
import { useTranslation } from 'react-i18next';

export const AppLanguageSelect = () => {
  const { i18n } = useTranslation();

  function changeLanguage(lng: string) {
    void i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
  }

  return (
    <Select onValueChange={changeLanguage} value={i18n.language}>
      <SelectTrigger className="w-100">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {Object.entries(langs).map(([key, value]) => (
            <SelectItem key={key} value={key}>
              {value}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
