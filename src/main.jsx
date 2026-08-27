import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { store } from "./services/store/store";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext"; // ← Ajoute cette ligne
import CustomToast from "./components/customToast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>          {/* ← Ajoute le ThemeProvider ici */}
          <AuthProvider>
            <App />
            <CustomToast />
          </AuthProvider>
        </ThemeProvider>
      </I18nextProvider>
    </Provider>
  </StrictMode>
);