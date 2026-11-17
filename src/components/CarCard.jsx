import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Gauge, Fuel, Settings2, MapPin } from 'lucide-react';

export function CarCard({ car }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
  };

  const formatMileage = (mileage) => {
    return new Intl.NumberFormat('ru-RU').format(mileage) + ' км';
  };

  const mainImage = car.images && car.images.length > 0 
    ? car.images[0] 
    : 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group">
      {/* Image Container */}
      <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
        <img
          src={mainImage}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
          {car.year} г.
        </div>
        <div className="absolute top-3 right-3 bg-brand-600/90 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          <span>{car.city}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors truncate">
              {car.brand} {car.model}
            </h3>
          </div>
          
          <div className="text-2xl font-black text-brand-600 mb-4">
            {formatPrice(car.price)}
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-2 py-3 border-y border-slate-100 text-xs text-slate-600 mb-4">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate">{formatMileage(car.mileage)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate">{car.transmission}</span>
            </div>
            <div className="flex items-center gap-2">
              <Fuel className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate">{car.fuel_type}</span>
            </div>
            {car.engine_capacity && (
              <div className="flex items-center gap-2 text-slate-500">
                <span>{car.engine_capacity} л / {car.engine_power || ''} л.с.</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={`/car/${car.id}`}
          className="w-full bg-slate-100 hover:bg-brand-600 text-slate-800 hover:text-white font-semibold py-2.5 px-4 rounded-xl text-center text-sm transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <span>Подробнее об авто</span>
        </Link>
      </div>
    </div>
  );
}
