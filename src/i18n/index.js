import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      dashboard: 'Dashboard',
      workOrders: 'Work Orders',
      machines: 'Machines',
      inventory: 'Inventory',
      reports: 'Reports',
      settings: 'Settings',
      logout: 'Logout',
      open: 'Open',
      closed: 'Closed',
      pending: 'Pending',
      completed: 'Completed',
      executiveReadOnly: 'Executive View — Read Only',
    },
  },
  ar: {
    translation: {
      dashboard: 'لوحة التحكم',
      workOrders: 'أوامر العمل',
      machines: 'الآلات',
      inventory: 'المخزون',
      reports: 'التقارير',
      settings: 'الإعدادات',
      logout: 'تسجيل الخروج',
      open: 'مفتوح',
      closed: 'مغلق',
      pending: 'قيد الانتظار',
      completed: 'مكتمل',
      executiveReadOnly: 'عرض تنفيذي — للقراءة فقط',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('lang') || 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
