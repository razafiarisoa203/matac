import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CustomToast = () => {
  return (
    <ToastContainer
      position="top-right"          // Position de la notification
      autoClose={3000}              // Fermeture automatique après 3s
      hideProgressBar={false}       // Affiche la barre de progression
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover              // Thème coloré
      progressStyle={{
        background: '#ffffff',      // Barre blanche
      }}
    />
  );
};

export default CustomToast;
