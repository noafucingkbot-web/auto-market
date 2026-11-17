import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, PlusCircle, User, LogOut, ShieldCheck } from 'lucide-react';

export function Navbar({ user, onOpenAuth, onSignOut }) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight text-slate-900">Auto<span className="text-brand-600">Market</span></span>
            <span className="block text-xs font-medium text-slate-500 uppercase tracking-widest">Авто с пробегом</span>
          </div>
        </Link>

        {/* Navigation & Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            to="/"
            className="hidden sm:inline-flex items-center text-sm font-medium text-slate-700 hover:text-brand-600 transition-colors px-3 py-2 rounded-lg hover:bg-slate-100"
          >
            Каталог авто
          </Link>

          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm shadow-sm shadow-brand-600/30 transition-all hover:shadow-md hover:shadow-brand-600/40"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Разместить авто</span>
                <span className="sm:hidden">Продать</span>
              </Link>

              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors text-sm font-medium"
                  title="Личный кабинет"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs">
                    {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden md:inline truncate max-w-[120px]">{user.email}</span>
                </Link>

                <button
                  onClick={onSignOut}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  title="Выйти"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('signin')}
                className="inline-flex items-center gap-2 text-slate-700 hover:text-brand-600 font-medium text-sm px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Войти</span>
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm shadow-sm shadow-brand-600/30 transition-all hover:shadow-md"
              >
                <span>Регистрация</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
