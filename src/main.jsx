import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { store } from "./services/store/store";
import App from "./App";
import "./index.css";

// Charger la langue depuis le stockage local
const savedLanguage = localStorage.getItem('i18nextLng') || 'fr';
i18n.changeLanguage(savedLanguage);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    </Provider>
  </StrictMode>
);
