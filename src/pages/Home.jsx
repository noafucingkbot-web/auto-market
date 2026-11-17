import React, { useState, useEffect } from 'react';
import { FilterPanel } from '../components/FilterPanel';
import { CarCard } from '../components/CarCard';
import { MOCK_CARS } from '../data/mockCars';
import { supabase } from '../lib/supabase';
import { Sparkles, Shield, Zap, RefreshCw } from 'lucide-react';

export function Home() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [useMockFallback, setUseMockFallback] = useState(false);

  const [filters, setFilters] = useState({
    searchQuery: '',
    brand: '',
    transmission: '',
    priceMin: '',
    priceMax: '',
    yearMin: '',
    yearMax: '',
    sortBy: 'newest'
  });

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        console.warn('Supabase fetch failed or empty, using MOCK_CARS fallback:', error?.message);
        setCars(MOCK_CARS);
        setUseMockFallback(true);
      } else {
        setCars(data);
        setUseMockFallback(false);
      }
    } catch (err) {
      console.error('Error fetching cars:', err);
      setCars(MOCK_CARS);
      setUseMockFallback(true);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      brand: '',
      transmission: '',
      priceMin: '',
      priceMax: '',
      yearMin: '',
      yearMax: '',
      sortBy: 'newest'
    });
  };

  // Filter and Sort logic
  const filteredCars = cars.filter(car => {
    // Search query (brand, model, description, city)
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchText = `${car.brand} ${car.model} ${car.description || ''} ${car.city} ${car.color || ''}`.toLowerCase();
      if (!matchText.includes(query)) return false;
    }

    // Brand
    if (filters.brand && car.brand.toLowerCase() !== filters.brand.toLowerCase()) {
      return false;
    }

    // Transmission
    if (filters.transmission && car.transmission.toLowerCase() !== filters.transmission.toLowerCase()) {
      return false;
    }

    // Price Min
    if (filters.priceMin && Number(car.price) < Number(filters.priceMin)) {
      return false;
    }

    // Price Max
    if (filters.priceMax && Number(car.price) > Number(filters.priceMax)) {
      return false;
    }

    // Year Min
    if (filters.yearMin && Number(car.year) < Number(filters.yearMin)) {
      return false;
    }

    // Year Max
    if (filters.yearMax && Number(car.year) > Number(filters.yearMax)) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'newest') {
      return new Date(b.created_at) - new Date(a.created_at);
    }
    if (filters.sortBy === 'price-asc') {
      return Number(a.price) - Number(b.price);
    }
    if (filters.sortBy === 'price-desc') {
      return Number(b.price) - Number(a.price);
    }
    if (filters.sortBy === 'year-desc') {
      return Number(b.year) - Number(a.year);
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden mb-10">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#36a8f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-brand-500/20 text-brand-300 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6 border border-brand-500/30">
            <Sparkles className="w-4 h-4" />
            <span>Проверенные авто с пробегом</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6">
            Найдите автомобиль <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-sky-300">своей мечты</span>
          </h1>
          <p className="text-lg text-slate-300 mb-8 leading-relaxed">
            Тысячи актуальных объявлений от реальных владельцев. Проверка истории, честные цены и удобный поиск.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-6 border-t border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center text-brand-400 shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div className="text-sm">
                <div className="font-bold text-white">Безопасная сделка</div>
                <div className="text-slate-400 text-xs">Прямая связь с продавцом</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center text-brand-400 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div className="text-sm">
                <div className="font-bold text-white">Быстрый поиск</div>
                <div className="text-slate-400 text-xs">Гибкие фильтры и сортировка</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center text-brand-400 shrink-0">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div className="text-sm">
                <div className="font-bold text-white">Ежедневное обновление</div>
                <div className="text-slate-400 text-xs">Новые объявления каждый час</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {useMockFallback && (
          <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-2xl text-sm flex items-center justify-between">
            <span>ℹ️ Работает в демо-режиме (показаны примеры объявлений). Подключите Supabase через .env и выполните schema.sql для полной работы с базой.</span>
          </div>
        )}

        <FilterPanel
          filters={filters}
          setFilters={setFilters}
          onReset={handleResetFilters}
          totalCount={filteredCars.length}
        />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-slate-200 h-96 animate-pulse p-5 flex flex-col justify-between">
                <div className="bg-slate-200 rounded-xl h-48 w-full mb-4"></div>
                <div className="space-y-3">
                  <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-8 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto my-12">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
              <RefreshCw className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Автомобили не найдены</h3>
            <p className="text-sm text-slate-500 mb-6">
              По вашему запросу и фильтрам ничего не найдено. Попробуйте изменить параметры поиска или сбросить фильтры.
            </p>
            <button
              onClick={handleResetFilters}
              className="bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 px-6 rounded-xl text-sm transition-colors"
            >
              Сбросить фильтры
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
