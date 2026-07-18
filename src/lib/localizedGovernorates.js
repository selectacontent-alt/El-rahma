export const GOVERNORATES = [
  { key: 'cairo', value: 'القاهرة' },
  { key: 'alexandria', value: 'الإسكندرية' },
  { key: 'giza', value: 'الجيزة' },
  { key: 'qalyubia', value: 'القليوبية' },
  { key: 'portSaid', value: 'بورسعيد' },
  { key: 'suez', value: 'السويس' },
  { key: 'ismailia', value: 'الإسماعيلية' },
  { key: 'sharqia', value: 'الشرقية' },
  { key: 'dakahlia', value: 'الدقهلية' },
  { key: 'gharbia', value: 'الغربية' },
  { key: 'monufia', value: 'المنوفية' },
  { key: 'kafrElSheikh', value: 'كفر الشيخ' },
  { key: 'beheira', value: 'البحيرة' },
  { key: 'damietta', value: 'دمياط' },
  { key: 'northSinai', value: 'شمال سيناء' },
  { key: 'southSinai', value: 'جنوب سيناء' },
  { key: 'beniSuef', value: 'بني سويف' },
  { key: 'minya', value: 'المنيا' },
  { key: 'fayoum', value: 'الفيوم' },
  { key: 'assiut', value: 'أسيوط' },
  { key: 'sohag', value: 'سوهاج' },
  { key: 'qena', value: 'قنا' },
  { key: 'luxor', value: 'الأقصر' },
  { key: 'aswan', value: 'أسوان' },
  { key: 'redSea', value: 'البحر الأحمر' },
  { key: 'newValley', value: 'الوادي الجديد' },
  { key: 'matrouh', value: 'مطروح' },
];

const byArabicValue = new Map(GOVERNORATES.map((item) => [item.value, item]));

export const getGovernorateLabel = (value, t) => {
  const item = byArabicValue.get(value);
  return item ? t(`governorates.${item.key}`) : value;
};

export const getGovernorateOptions = (t) => (
  GOVERNORATES.map((item) => ({
    ...item,
    label: t(`governorates.${item.key}`),
  }))
);
