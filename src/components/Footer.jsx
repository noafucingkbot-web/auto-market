import React from 'react';
import { Car, ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white">
                <Car className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">Auto<span className="text-brand-400">Market</span></span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Современная и надежная площадка для купли-продажи подержанных автомобилей напрямую от собственников.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Разделы</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#/cars" className="hover:text-brand-400 transition-colors">Каталог автомобилей</a></li>
              <li><a href="#/dashboard" className="hover:text-brand-400 transition-colors">Разместить объявление</a></li>
              <li><a href="#/dashboard" className="hover:text-brand-400 transition-colors">Личный кабинет</a></li>
            </ul>
          </div>

          {/* Popular Brands */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Популярные марки</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Toyota, BMW, Mercedes-Benz</li>
              <li>Audi, Volkswagen, Kia</li>
              <li>Hyundai, Skoda, Lada</li>
              <li>Haval, Chery, Geely</li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Поддержка</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-slate-400">
                <Phone className="w-4 h-4 text-brand-400" />
                <span>8 (800) 555-35-35</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4 text-brand-400" />
                <span>support@automarket.ru</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-4 h-4 text-brand-400" />
                <span>Москва, Пресненская наб., 12</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} AutoMarket. Все права защищены.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <span className="hover:text-slate-400 cursor-pointer">Политика конфиденциальности</span>
            <span className="hover:text-slate-400 cursor-pointer">Условия использования</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
