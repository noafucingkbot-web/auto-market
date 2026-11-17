import React, { useState } from 'react';
import { Search, Filter, RotateCcw, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { POPULAR_BRANDS, TRANSMISSION_TYPES } from '../data/mockCars';

export function FilterPanel({ filters, setFilters, onReset, totalCount }) {
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 mb-8">
      {/* Search Bar & Mobile Toggle */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            name="searchQuery"
            value={filters.searchQuery}
            onChange={handleChange}
            placeholder="Поиск по названию, модели или описанию..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm font-medium transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={() => setIsOpenMobile(!isOpenMobile)}
            className="md:hidden flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-xl font-medium text-sm transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Фильтры</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpenMobile ? 'rotate-180' : ''}`} />
          </button>

          <div className="text-sm font-semibold text-slate-500 bg-slate-100 px-4 py-3 rounded-xl whitespace-nowrap">
            Найдено: <span className="text-brand-600 font-bold">{totalCount}</span>
          </div>
        </div>
      </div>

      {/* Extended Filters (Desktop always, Mobile collapsible) */}
      <div className={`mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 ${isOpenMobile ? 'block' : 'hidden md:grid'}`}>
        {/* Brand */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Марка</label>
          <select
            name="brand"
            value={filters.brand}
            onChange={handleChange}
            className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          >
            {POPULAR_BRANDS.map(brand => (
              <option key={brand} value={brand === 'Все марки' ? '' : brand}>{brand}</option>
            ))}
          </select>
        </div>

        {/* Transmission */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Коробка передач</label>
          <select
            name="transmission"
            value={filters.transmission}
            onChange={handleChange}
            className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          >
            {TRANSMISSION_TYPES.map(trans => (
              <option key={trans} value={trans === 'Все КПП' ? '' : trans}>{trans}</option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Цена, ₽</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              name="priceMin"
              value={filters.priceMin}
              onChange={handleChange}
              placeholder="От"
              className="w-1/2 py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
            <input
              type="number"
              name="priceMax"
              value={filters.priceMax}
              onChange={handleChange}
              placeholder="До"
              className="w-1/2 py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>

        {/* Year Range */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Год выпуска</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              name="yearMin"
              value={filters.yearMin}
              onChange={handleChange}
              placeholder="От"
              className="w-1/2 py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
            <input
              type="number"
              name="yearMax"
              value={filters.yearMax}
              onChange={handleChange}
              placeholder="До"
              className="w-1/2 py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Сортировка</label>
          <div className="flex gap-2">
            <select
              name="sortBy"
              value={filters.sortBy}
              onChange={handleChange}
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            >
              <option value="newest">Сначала новые</option>
              <option value="price-asc">Сначала дешевле</option>
              <option value="price-desc">Сначала дороже</option>
              <option value="year-desc">Сначала новее год</option>
            </select>

            <button
              onClick={onReset}
              className="p-2.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-500 rounded-xl transition-colors shrink-0"
              title="Сбросить фильтры"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
