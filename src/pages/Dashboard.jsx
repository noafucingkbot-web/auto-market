import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { POPULAR_BRANDS, TRANSMISSION_TYPES } from '../data/mockCars';
import imageCompression from 'browser-image-compression';
import { 
  PlusCircle, Trash2, Car, Upload, Loader2, AlertCircle, 
  CheckCircle2, MapPin, Gauge, Calendar, Shield, ArrowLeft 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export function Dashboard({ user, onOpenAuth }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('my-cars'); // 'my-cars' | 'add-car'
  const [myCars, setMyCars] = useState([]);
  const [loadingCars, setLoadingCars] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    brand: 'Toyota',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    mileage: '',
    transmission: 'Автомат',
    fuel_type: 'Бензин',
    body_type: 'Седан',
    engine_capacity: '',
    engine_power: '',
    drive_type: 'Передний',
    color: '',
    city: 'Москва',
    description: '',
    phone: '',
    telegram: '',
    whatsapp: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (user) {
      fetchMyCars();
    } else {
      setLoadingCars(false);
    }
  }, [user]);

  const fetchMyCars = async () => {
    setLoadingCars(true);
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyCars(data || []);
    } catch (err) {
      console.error('Error fetching my cars:', err);
    } finally {
      setLoadingCars(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
    }
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitCar = async (e) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth('signin');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const uploadedImageUrls = [];

      // 1. Compress and upload each photo to Supabase Storage
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        setUploadProgress(`Сжатие и загрузка фото ${i + 1} из ${selectedFiles.length}...`);

        // Compression options using browser-image-compression
        const options = {
          maxSizeMB: 0.8,
          maxWidthOrHeight: 1280,
          useWebWorker: true
        };

        const compressedFile = await imageCompression(file, options);

        // Upload to Supabase Storage bucket 'car-images'
        const fileExt = file.name.split('.').pop() || 'jpg';
        const fileName = `${user.id}-${Date.now()}-${i}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('car-images')
          .upload(filePath, compressedFile);

        if (uploadError) {
          throw new Error(`Ошибка загрузки фото: ${uploadError.message}`);
        }

        // Get public URL
        const { data: publicURLData } = supabase.storage
          .from('car-images')
          .getPublicUrl(filePath);

        if (publicURLData?.publicUrl) {
          uploadedImageUrls.push(publicURLData.publicUrl);
        }
      }

      setUploadProgress('Сохранение объявления в базу данных...');

      // 2. Insert into cars table
      const { error: insertError } = await supabase
        .from('cars')
        .insert([
          {
            user_id: user.id,
            brand: formData.brand,
            model: formData.model,
            year: Number(formData.year),
            price: Number(formData.price),
            mileage: Number(formData.mileage),
            transmission: formData.transmission,
            fuel_type: formData.fuel_type,
            body_type: formData.body_type,
            engine_capacity: formData.engine_capacity ? Number(formData.engine_capacity) : null,
            engine_power: formData.engine_power ? Number(formData.engine_power) : null,
            drive_type: formData.drive_type,
            color: formData.color,
            city: formData.city,
            description: formData.description,
            phone: formData.phone,
            telegram: formData.telegram,
            whatsapp: formData.whatsapp,
            images: uploadedImageUrls,
            status: 'active'
          }
        ]);

      if (insertError) throw insertError;

      setSuccess('Объявление успешно опубликовано!');
      setSelectedFiles([]);
      setFormData({
        brand: 'Toyota',
        model: '',
        year: new Date().getFullYear(),
        price: '',
        mileage: '',
        transmission: 'Автомат',
        fuel_type: 'Бензин',
        body_type: 'Седан',
        engine_capacity: '',
        engine_power: '',
        drive_type: 'Передний',
        color: '',
        city: 'Москва',
        description: '',
        phone: '',
        telegram: '',
        whatsapp: ''
      });

      // Refresh listings and switch tab
      fetchMyCars();
      setTimeout(() => {
        setActiveTab('my-cars');
      }, 1500);

    } catch (err) {
      console.error('Submit error:', err);
      setError(err.message || 'Произошла ошибка при публикации объявления');
    } finally {
      setUploading(false);
      setUploadProgress('');
    }
  };

  const handleDeleteCar = async (carId) => {
    if (!window.confirm('Вы уверены, что хотите удалить это объявление?')) return;

    try {
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', carId);

      if (error) throw error;
      setMyCars(prev => prev.filter(c => c.id !== carId));
    } catch (err) {
      console.error('Error deleting car:', err);
      alert('Не удалось удалить объявление: ' + err.message);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 px-4 flex items-center justify-center">
        <div className="bg-white rounded-3xl border border-slate-200 p-10 max-w-md w-full text-center shadow-xl">
          <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Требуется авторизация</h2>
          <p className="text-sm text-slate-500 mb-8">
            Войдите в личный кабинет, чтобы управлять своими объявлениями и добавлять новые машины на продажу.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => onOpenAuth('signin')}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-brand-600/30 transition-all"
            >
              Войти в аккаунт
            </button>
            <button
              onClick={() => onOpenAuth('signup')}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 px-4 rounded-2xl transition-colors"
            >
              Создать аккаунт
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-6 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Личный кабинет продавца</h1>
            <p className="text-sm text-slate-500">Управляйте своими объявлениями и добавляйте новые авто</p>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('my-cars')}
              className={`py-2.5 px-5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'my-cars' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Мои объявления ({myCars.length})
            </button>
            <button
              onClick={() => setActiveTab('add-car')}
              className={`py-2.5 px-5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'add-car' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Добавить авто</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {activeTab === 'my-cars' ? (
          <div>
            {loadingCars ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
              </div>
            ) : myCars.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myCars.map(car => (
                  <div key={car.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="relative aspect-[16/10] bg-slate-100">
                        <img
                          src={car.images?.[0] || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80'}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3 bg-brand-600 text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
                          {car.status === 'active' ? 'Активно' : 'Продано'}
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="text-xl font-bold text-slate-900 mb-1">{car.brand} {car.model}, {car.year}</h3>
                        <div className="text-2xl font-black text-brand-600 mb-3">
                          {new Intl.NumberFormat('ru-RU').format(car.price)} ₽
                        </div>
                        <div className="text-xs text-slate-500 space-y-1">
                          <div>Город: <span className="font-semibold text-slate-700">{car.city}</span></div>
                          <div>Пробег: <span className="font-semibold text-slate-700">{new Intl.NumberFormat('ru-RU').format(car.mileage)} км</span></div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0 flex items-center gap-3">
                      <Link
                        to={`/car/${car.id}`}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2.5 px-4 rounded-xl text-center text-sm transition-colors"
                      >
                        Смотреть
                      </Link>
                      <button
                        onClick={() => handleDeleteCar(car.id)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 p-2.5 rounded-xl transition-colors"
                        title="Удалить объявление"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto my-12">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Car className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">У вас пока нет объявлений</h3>
                <p className="text-sm text-slate-500 mb-6">
                  Разместите свое первое объявление о продаже автомобиля прямо сейчас!
                </p>
                <button
                  onClick={() => setActiveTab('add-car')}
                  className="bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 px-6 rounded-xl text-sm transition-colors"
                >
                  Разместить автомобиль
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm max-w-3xl mx-auto">
            <h2 className="text-2xl font-black text-slate-900 mb-6">Новое объявление о продаже</h2>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-2xl text-sm flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmitCar} className="space-y-6">
              {/* Brand & Model */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Марка *</label>
                  <select
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  >
                    {POPULAR_BRANDS.filter(b => b !== 'Все марки').map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Модель *</label>
                  <input
                    type="text"
                    required
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    placeholder="Например: Camry, X5, Solaris"
                    className="w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Year, Price, Mileage */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Год выпуска *</label>
                  <input
                    type="number"
                    required
                    min={1950}
                    max={new Date().getFullYear()}
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Цена, ₽ *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="2450000"
                    className="w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Пробег, км *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleInputChange}
                    placeholder="45000"
                    className="w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Transmission, Fuel, Body */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Коробка передач *</label>
                  <select
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleInputChange}
                    className="w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  >
                    {TRANSMISSION_TYPES.filter(t => t !== 'Все КПП').map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Тип топлива *</label>
                  <select
                    name="fuel_type"
                    value={formData.fuel_type}
                    onChange={handleInputChange}
                    className="w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  >
                    <option value="Бензин">Бензин</option>
                    <option value="Дизель">Дизель</option>
                    <option value="Гибрид">Гибрид</option>
                    <option value="Электро">Электро</option>
                    <option value="ГАЗ">ГАЗ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Тип кузова</label>
                  <select
                    name="body_type"
                    value={formData.body_type}
                    onChange={handleInputChange}
                    className="w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  >
                    <option value="Седан">Седан</option>
                    <option value="Внедорожник">Внедорожник</option>
                    <option value="Хэтчбек">Хэтчбек</option>
                    <option value="Универсал">Универсал</option>
                    <option value="Купе">Купе</option>
                  </select>
                </div>
              </div>

              {/* Engine capacity, power, drive type, color, city */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Объем двигателя, л</label>
                  <input
                    type="number"
                    step="0.1"
                    name="engine_capacity"
                    value={formData.engine_capacity}
                    onChange={handleInputChange}
                    placeholder="2.5"
                    className="w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Мощность, л.с.</label>
                  <input
                    type="number"
                    name="engine_power"
                    value={formData.engine_power}
                    onChange={handleInputChange}
                    placeholder="181"
                    className="w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Привод</label>
                  <select
                    name="drive_type"
                    value={formData.drive_type}
                    onChange={handleInputChange}
                    className="w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  >
                    <option value="Передний">Передний</option>
                    <option value="Задний">Задний</option>
                    <option value="Полный">Полный</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Цвет</label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    placeholder="Черный металлик"
                    className="w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Город *</label>
                  <input
                    type="text"
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Москва"
                    className="w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Contacts */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Телефон *</label>
                  <input
                    type="text"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+7 (999) 123-45-67"
                    className="w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Telegram username</label>
                  <input
                    type="text"
                    name="telegram"
                    value={formData.telegram}
                    onChange={handleInputChange}
                    placeholder="@username"
                    className="w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">WhatsApp номер</label>
                  <input
                    type="text"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    placeholder="+79991234567"
                    className="w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Описание</label>
                <textarea
                  rows={4}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Расскажите об истории автомобиля, состоянии кузова, салона и комплектации..."
                  className="w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                ></textarea>
              </div>

              {/* Photos Upload with client-side compression */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Фотографии автомобиля</label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-brand-500 transition-colors bg-slate-50">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="car-photos-input"
                  />
                  <label htmlFor="car-photos-input" className="cursor-pointer flex flex-col items-center">
                    <Upload className="w-10 h-10 text-slate-400 mb-2" />
                    <span className="text-sm font-semibold text-slate-700">Нажмите для выбора фото</span>
                    <span className="text-xs text-slate-400 mt-1">Поддерживается сжатие изображений перед загрузкой</span>
                  </label>
                </div>

                {selectedFiles.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {selectedFiles.map((file, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeSelectedFile(idx)}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 shadow hover:bg-red-700 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 px-6 rounded-2xl shadow-xl shadow-brand-600/30 transition-all disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
              >
                {uploading && <Loader2 className="w-6 h-6 animate-spin" />}
                <span>{uploading ? uploadProgress : 'Опубликовать объявление'}</span>
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
