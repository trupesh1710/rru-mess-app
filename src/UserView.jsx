import React, { useState, useEffect } from 'react';
import { Calendar, UtensilsCrossed, Bell, CalendarDays } from 'lucide-react';

export default function UserView() {
  const [meals, setMeals] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [viewMode, setViewMode] = useState('today');

  useEffect(() => {
    const sampleMeals = [
      {
        id: 1,
        date: new Date().toISOString().split('T')[0],
        breakfast: 'Poha, Tea, Banana',
        lunch: 'Rice, Dal Tadka, Mix Veg, Roti, Salad',
        snacks: 'Tea, Samosa',
        dinner: 'Chapati, Paneer Butter Masala, Rice, Curd'
      }
    ];
    const sampleAnnouncements = [
      {
        id: 1,
        title: 'Special Dinner Tonight',
        message: 'Celebrating Diwali with special sweets and snacks!',
        date: new Date().toISOString().split('T')[0]
      }
    ];
    setMeals(sampleMeals);
    setAnnouncements(sampleAnnouncements);
  }, []);

  const getTodaysMeal = () => {
    const today = new Date().toISOString().split('T')[0];
    return meals.find(m => m.date === today);
  };

  const getWeekMeals = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    const weekMeals = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const meal = meals.find(m => m.date === dateStr);
      weekMeals.push({
        date: dateStr,
        dayName: date.toLocaleDateString('en-IN', { weekday: 'short' }),
        meal: meal || null
      });
    }
    return weekMeals;
  };

  const getActiveAnnouncements = () => {
    const today = new Date().toISOString().split('T')[0];
    return announcements.filter(a => a.date >= today).sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const todaysMeal = getTodaysMeal();
  const weekMeals = getWeekMeals();
  const activeAnnouncements = getActiveAnnouncements();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8 px-4 sm:px-0">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-2">
            <UtensilsCrossed className="w-10 h-10 text-orange-600" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">RRU Mess</h1>
          </div>
          <p className="text-gray-600">Rashtriya Raksha University</p>
        </div>

        {activeAnnouncements.length > 0 && (
          <div className="mb-8 space-y-3">
            {activeAnnouncements.map(announcement => (
              <div key={announcement.id} className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl shadow-lg p-5">
                <div className="flex items-start gap-3">
                  <Bell className="w-6 h-6 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{announcement.title}</h3>
                    <p className="text-orange-50">{announcement.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mb-6 justify-center px-4 sm:px-0">
          <button
            onClick={() => setViewMode('today')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              viewMode === 'today'
                ? 'bg-orange-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Today's Menu
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
              viewMode === 'week'
                ? 'bg-orange-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            Week View
          </button>
        </div>

        {viewMode === 'today' && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-orange-600" />
              Today's Menu
            </h2>
            {todaysMeal ? (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <p className="text-gray-600 mb-4">{formatDate(todaysMeal.date)}</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <MealCard title="Breakfast" items={todaysMeal.breakfast} color="yellow" />
                  <MealCard title="Lunch" items={todaysMeal.lunch} color="orange" />
                  <MealCard title="Snacks" items={todaysMeal.snacks} color="green" />
                  <MealCard title="Dinner" items={todaysMeal.dinner} color="blue" />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center text-gray-500">
                No menu available for today
              </div>
            )}
          </div>
        )}

        {viewMode === 'week' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CalendarDays className="w-6 h-6 text-blue-600" />
              This Week's Menu
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {weekMeals.map((day, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-5">
                  <div className="mb-3">
                    <p className="font-bold text-lg text-gray-800">{day.dayName}</p>
                    <p className="text-sm text-gray-500">{new Date(day.date + 'T00:00:00').toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</p>
                  </div>
                  {day.meal ? (
                    <div className="space-y-2">
                      <div className="border-l-2 border-yellow-400 pl-2">
                        <p className="text-xs font-semibold text-yellow-700">Breakfast</p>
                        <p className="text-sm text-gray-600">{day.meal.breakfast}</p>
                      </div>
                      <div className="border-l-2 border-orange-400 pl-2">
                        <p className="text-xs font-semibold text-orange-700">Lunch</p>
                        <p className="text-sm text-gray-600">{day.meal.lunch}</p>
                      </div>
                      <div className="border-l-2 border-green-400 pl-2">
                        <p className="text-xs font-semibold text-green-700">Snacks</p>
                        <p className="text-sm text-gray-600">{day.meal.snacks}</p>
                      </div>
                      <div className="border-l-2 border-blue-400 pl-2">
                        <p className="text-xs font-semibold text-blue-700">Dinner</p>
                        <p className="text-sm text-gray-600">{day.meal.dinner}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">No menu scheduled</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MealCard({ title, items, color }) {
  const colorClasses = {
    yellow: 'border-yellow-400 bg-yellow-50',
    orange: 'border-orange-400 bg-orange-50',
    green: 'border-green-400 bg-green-50',
    blue: 'border-blue-400 bg-blue-50'
  };

  return (
    <div className={`border-l-4 ${colorClasses[color]} p-4 rounded-lg`}>
      <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-700 text-sm whitespace-pre-line">{items}</p>
    </div>
  );
}
