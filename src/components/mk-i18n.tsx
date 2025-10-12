export const MkI18n = (props: { i18nKey: string; values?: Record<string, React.ReactNode> }) => {
  const { t } = useTranslation();
  let ts: React.ReactNode[] = [t(props.i18nKey)];

  Object.entries(props.values ?? {}).forEach(([key, value]) => {
    ts = ts.flatMap((s) => {
      if (typeof s === 'string') {
        const parts = s.split(`{{${key}}}`);
        return parts.flatMap((part, index) => (index == 0 ? [part] : [value, part]));
      } else {
        return s;
      }
    });
  });

  return (
    <div className="mk-i18n" data-i18n-key={props.i18nKey}>
      {ts}
    </div>
  );
};
