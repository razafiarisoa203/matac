import React from 'react';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/src/assets/logo/MDAT.jpeg" 
                alt="Logo MDAT" 
                className="h-16 w-auto"
              />
              <div>
                <h3 className="text-xl font-bold">MDAT</h3>
                <p className="text-gray-400 text-sm">Ministère en charge de l'Aménagement du Territoire</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Plateforme de gestion des autorisations d'urbanisme à Madagascar
            </p>
          </div>

          {/* Liens rapides */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Liens rapides</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition">Accueil</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-white transition">Services</a></li>
              <li><a href="#objectifs" className="text-gray-400 hover:text-white transition">Objectifs</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-white transition">Contact</a></li>
              <li><a href="/login" className="text-gray-400 hover:text-white transition">Espace membre</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 text-green-400 mt-0.5" />
                <span className="text-gray-400">Antananarivo 101, Madagascar</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-green-400" />
                <span className="text-gray-400">+261 34 XX XXX XX</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-green-400" />
                <span className="text-gray-400">contact@mdat.mg</span>
              </li>
            </ul>
          </div>

          {/* Réseaux sociaux */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Suivez-nous</h4>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 hover:bg-gray-700 p-2  -full transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-gray-700 p-2  -full transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-gray-700 p-2  -full transition">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
            <div className="mt-6">
              <h5 className="font-medium mb-2">Newsletter</h5>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="px-4 py-2  -l-md text-gray-900 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button className="bg-green-600 hover:bg-green-700 px-4 py-2  -r-md transition">
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} MDAT - Tous droits réservés
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-white text-sm transition">
              Mentions légales
            </a>
            <a href="#" className="text-gray-500 hover:text-white text-sm transition">
              Politique de confidentialité
            </a>
            <a href="#" className="text-gray-500 hover:text-white text-sm transition">
              Conditions d'utilisation
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
