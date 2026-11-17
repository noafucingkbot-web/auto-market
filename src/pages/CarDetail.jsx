import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { MOCK_CARS } from '../data/mockCars';
import { 
  ArrowLeft, Calendar, Gauge, Fuel, Settings2, MapPin, 
  Phone, Send, MessageCircle, ShieldCheck, CheckCircle, 
  Layers, Disc, Palette, Compass, Zap 
} from 'lucide-react';

export function CarDetail() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    fetchCarDetails();
  }, [id]);

  const fetchCarDetails = async () => {
    setLoading(true);
    try {
      // First check if it's a mock id
      if (id && id.startsWith('mock-')) {
        const found = MOCK_CARS.find(c => c.id === id);
        setCar(found || MOCK_CARS[0]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        // Fallback to mock search
        const found = MOCK_CARS.find(c => c.id === id) || MOCK_CARS[0];
        setCar(found);
      } else {
        setCar(data);
      }
    } catch (err) {
      console.error('Error fetching car detail:', err);
      const found = MOCK_CARS.find(c => c.id === id) || MOCK_CARS[0];
      setCar(found);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Автомобиль не найден</h2>
        <Link to="/" className="text-brand-600 font-semibold hover:underline">Вернуться в каталог</Link>
      </div>
    );
  }

  const formatPrice = (price) => new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
  const formatMileage = (mileage) => new Intl.NumberFormat('ru-RU').format(mileage) + ' км';

  const images = car.images && car.images.length > 0 
    ? car.images 
    : ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80'];

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Top Bar / Navigation */}
      <div className="bg-white border-b border-slate-200 py-4 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-brand-600 font-semibold text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Назад в каталог</span>
          </Link>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg">
            ID: {car.id.slice(0, 8)}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Gallery & Description */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm">
              <div className="relative aspect-[16/10] bg-slate-900 rounded-2xl overflow-hidden mb-4 shadow-inner">
                <img
                  src={images[activeImageIndex]}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-semibold">
                  {activeImageIndex + 1} из {images.length}
                </div>
              </div>

              {images.length > 1 && (
                <div className="grid grid-cols-5 sm:grid-cols-6 gap-3">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all ${
                        activeImageIndex === idx ? 'border-brand-600 shadow-md scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & Price (Mobile) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm lg:hidden">
              <div className="flex items-center gap-2 text-brand-600 text-sm font-semibold mb-1">
                <MapPin className="w-4 h-4" />
                <span>{car.city}</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 mb-2">
                {car.brand} {car.model}, {car.year}
              </h1>
              <div className="text-3xl font-black text-brand-600 mb-6">
                {formatPrice(car.price)}
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Layers className="w-5 h-5 text-brand-600" />
                <span>Характеристики</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-sm text-slate-500 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" /> Год выпуска
                  </span>
                  <span className="font-bold text-slate-900">{car.year} г.</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-sm text-slate-500 flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-slate-400" /> Пробег
                  </span>
                  <span className="font-bold text-slate-900">{formatMileage(car.mileage)}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-sm text-slate-500 flex items-center gap-2">
                    <Settings2 className="w-4 h-4 text-slate-400" /> Коробка передач
                  </span>
                  <span className="font-bold text-slate-900">{car.transmission}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-sm text-slate-500 flex items-center gap-2">
                    <Fuel className="w-4 h-4 text-slate-400" /> Тип топлива
                  </span>
                  <span className="font-bold text-slate-900">{car.fuel_type}</span>
                </div>

                {car.body_type && (
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-sm text-slate-500 flex items-center gap-2">
                      <Disc className="w-4 h-4 text-slate-400" /> Тип кузова
                    </span>
                    <span className="font-bold text-slate-900">{car.body_type}</span>
                  </div>
                )}

                {car.engine_capacity && (
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-sm text-slate-500 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-slate-400" /> Двигатель
                    </span>
                    <span className="font-bold text-slate-900">{car.engine_capacity} л / {car.engine_power || '—'} л.с.</span>
                  </div>
                )}

                {car.drive_type && (
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-sm text-slate-500 flex items-center gap-2">
                      <Compass className="w-4 h-4 text-slate-400" /> Привод
                    </span>
                    <span className="font-bold text-slate-900">{car.drive_type}</span>
                  </div>
                )}

                {car.color && (
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-sm text-slate-500 flex items-center gap-2">
                      <Palette className="w-4 h-4 text-slate-400" /> Цвет
                    </span>
                    <span className="font-bold text-slate-900">{car.color}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Seller Description */}
            {car.description && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Описание от продавца</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                  {car.description}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Title (Desktop) & Contact Seller Card */}
          <div className="space-y-6">
            {/* Title & Price Card (Desktop) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm hidden lg:block">
              <div className="flex items-center gap-2 text-brand-600 text-sm font-semibold mb-2">
                <MapPin className="w-4 h-4" />
                <span>{car.city}</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 mb-2">
                {car.brand} {car.model}, {car.year}
              </h1>
              <div className="text-4xl font-black text-brand-600 mb-6">
                {formatPrice(car.price)}
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Проверенное объявление от собственника</span>
              </div>
            </div>

            {/* Contact Seller Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl sticky top-28">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Связаться с продавцом</h3>
              <p className="text-sm text-slate-500 mb-6">Позвоните или напишите продавцу для уточнения деталей сделки.</p>

              <div className="space-y-4">
                {/* Phone */}
                <a
                  href={`tel:${car.phone}`}
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-brand-600/30 transition-all flex items-center justify-center gap-3 text-lg"
                >
                  <Phone className="w-5 h-5" />
                  <span>{car.phone || '+7 (999) 000-00-00'}</span>
                </a>

                {/* Telegram & WhatsApp buttons */}
                <div className="grid grid-cols-2 gap-3">
                  {car.telegram ? (
                    <a
                      href={`https://t.me/${car.telegram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 font-semibold py-3 px-4 rounded-2xl transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Send className="w-4 h-4" />
                      <span>Telegram</span>
                    </a>
                  ) : (
                    <div className="bg-slate-100 text-slate-400 font-semibold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 text-sm cursor-not-allowed">
                      <Send className="w-4 h-4" />
                      <span>Telegram</span>
                    </div>
                  )}

                  {car.whatsapp ? (
                    <a
                      href={`https://wa.me/${car.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold py-3 px-4 rounded-2xl transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp</span>
                    </a>
                  ) : (
                    <div className="bg-slate-100 text-slate-400 font-semibold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 text-sm cursor-not-allowed">
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 text-xs text-slate-400 space-y-2">
                <p className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Рекомендуем осматривать авто лично</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Не переводите предоплату до осмотра</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
