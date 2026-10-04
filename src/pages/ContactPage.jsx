import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";

const ContactPage = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(t('contact.success'));
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className={`min-h-screen py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className={`max-w-3xl mx-auto rounded-2xl border p-8 shadow-lg transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-700 shadow-slate-950/50' : 'bg-white border-gray-200 shadow-gray-200/60'}`}>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#269745] mb-3">
          {t('contact.title')}
        </p>
        <h1 className={`text-3xl sm:text-4xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {t('contact.subtitle')}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>
              {t('contact.fullName')}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t('contact.namePlaceholder')}
              className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#269745] ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white placeholder:text-slate-400' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'}`}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>
              {t('contact.email')}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t('contact.emailPlaceholder')}
              className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#269745] ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white placeholder:text-slate-400' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'}`}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>
              {t('contact.message')}
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={t('contact.messagePlaceholder')}
              rows="6"
              className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#269745] ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white placeholder:text-slate-400' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'}`}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto bg-[#269745] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#1e7a38] transition-colors duration-300"
          >
            {t('contact.submit')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
