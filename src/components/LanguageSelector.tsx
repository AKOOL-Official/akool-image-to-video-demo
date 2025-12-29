import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    localStorage.setItem("language", language);
  };

  return (
    <Select value={i18n.language} onValueChange={changeLanguage}>
      <SelectTrigger className="w-[120px] rounded-xl border-muted">
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent className="rounded-xl border-muted">
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="zh">中文</SelectItem>
        <SelectItem value="ko">한국어</SelectItem>
        <SelectItem value="ja">日本語</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;
