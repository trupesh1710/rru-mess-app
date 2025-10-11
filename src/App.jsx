import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit2, Trash2, Lock, LogOut, UtensilsCrossed, Bell, CalendarDays } from 'lucide-react';

export default function MessApp() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [meals, setMeals] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [viewMode, setViewMode] = useState('today');
  const [formData, setFormData] = useState({
    date: '',
    breakfast: '',
    lunch: '',
    snacks: '',
    dinner: ''
  });
  const [announcementData, setAnnouncementData] = useState({
    title: '',
    message: '',
    date: ''
  });

  const handleLogin = () => {
    if (loginData.username === 'admin' && loginData.password === 'admin123') {
      setIsAdmin(true);
      setShowLoginForm(false);
      setLoginData({ username: '', password: '' });
    } else {
      alert('Invalid username or password!');
    }
  };

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

  const handleAddMeal = () => {
    if (!formData.date || !formData.breakfast || !formData.lunch || !formData.snacks || !formData.dinner) {
      alert('Please fill all fields');
      return;
    }

    if (editingMeal) {
      const updated = meals.map(m => m.id === editingMeal.id ? { ...formData, id: m.id } : m);
      setMeals(updated);
      setEditingMeal(null);
    } else {
      const newMeal = { ...formData, id: Date.now() };
      setMeals([...meals, newMeal]);
    }
    setFormData({ date: '', breakfast: '', lunch: '', snacks: '', dinner: '' });
    setShowAddForm(false);
  };

  const handleAddAnnouncement = () => {
    if (!announcementData.title || !announcementData.message) {
      alert('Please fill title and message');
      return;
    }

    if (editingAnnouncement) {
      const updated = announcements.map(a => a.id === editingAnnouncement.id ? { ...announcementData, id: a.id } : a);
      setAnnouncements(updated);
      setEditingAnnouncement(null);
    } else {
      const newAnnouncement = { ...announcementData, id: Date.now(), date: new Date().toISOString().split('T')[0] };
      setAnnouncements([...announcements, newAnnouncement]);
    }
    setAnnouncementData({ title: '', message: '', date: '' });
    setShowAnnouncementForm(false);
  };

  const handleEdit = (meal) => {
    setEditingMeal(meal);
    setFormData(meal);
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this meal?')) {
      setMeals(meals.filter(m => m.id !== id));
    }
  };

  const handleEditAnnouncement = (announcement) => {
    setEditingAnnouncement(announcement);
    setAnnouncementData(announcement);
    setShowAnnouncementForm(true);
  };

  const handleDeleteAnnouncement = (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      setAnnouncements(announcements.filter(a => a.id !== id));
    }
  };

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

  if (!isAdmin) {
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
              <button
                onClick={() => setShowLoginForm(true)}
                className="mt-4 text-sm text-gray-500 hover:text-gray-700 inline-flex items-center gap-1"
              >
                <Lock className="w-4 h-4" />
                Admin Login
              </button>
            </div>

          {showLoginForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
              <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Login</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Username</label>
                    <input
                      type="text"
                      value={loginData.username}
                      onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                      placeholder="Enter username"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Password</label>
                    <input
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      placeholder="Enter password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleLogin}
                      className="flex-1 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setShowLoginForm(false);
                        setLoginData({ username: '', password: '' });
                      }}
                      className="flex-1 px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

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

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 px-4 sm:px-0">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Admin Panel - RRU Mess</h1>
            <p className="text-gray-600">Manage meal schedules and announcements</p>
          </div>
          <button
            onClick={() => setIsAdmin(false)}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => {
              setShowAddForm(true);
              setEditingMeal(null);
              setFormData({ date: '', breakfast: '', lunch: '', snacks: '', dinner: '' });
            }}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
          >
            <Plus className="w-5 h-5" />
            Add New Meal
          </button>
          <button
            onClick={() => {
              setShowAnnouncementForm(true);
              setEditingAnnouncement(null);
              setAnnouncementData({ title: '', message: '', date: '' });
            }}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Bell className="w-5 h-5" />
            Add Announcement
          </button>
        </div>

        {showAnnouncementForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">{editingAnnouncement ? 'Edit Announcement' : 'Add New Announcement'}</h3>
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">Title</label>
                <input
                  type="text"
                  value={announcementData.title}
                  onChange={(e) => setAnnouncementData({ ...announcementData, title: e.target.value })}
                  placeholder="e.g., Special Dinner Tonight"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">Message</label>
                <textarea
                  value={announcementData.message}
                  onChange={(e) => setAnnouncementData({ ...announcementData, message: e.target.value })}
                  placeholder="e.g., Celebrating Diwali with special sweets!"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={handleAddAnnouncement}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  {editingAnnouncement ? 'Update' : 'Add'} Announcement
                </button>
                <button
                  onClick={() => {
                    setShowAnnouncementForm(false);
                    setEditingAnnouncement(null);
                  }}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showAddForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">{editingMeal ? 'Edit Meal' : 'Add New Meal'}</h3>
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Breakfast</label>
                  <textarea
                    value={formData.breakfast}
                    onChange={(e) => setFormData({ ...formData, breakfast: e.target.value })}
                    placeholder="e.g., Idli, Sambar, Chutney"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Lunch</label>
                  <textarea
                    value={formData.lunch}
                    onChange={(e) => setFormData({ ...formData, lunch: e.target.value })}
                    placeholder="e.g., Rice, Dal, Sabzi, Roti"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Snacks</label>
                  <textarea
                    value={formData.snacks}
                    onChange={(e) => setFormData({ ...formData, snacks: e.target.value })}
                    placeholder="e.g., Tea, Pakora"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Dinner</label>
                  <textarea
                    value={formData.dinner}
                    onChange={(e) => setFormData({ ...formData, dinner: e.target.value })}
                    placeholder="e.g., Chapati, Paneer, Rice"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows={2}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={handleAddMeal}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  {editingMeal ? 'Update' : 'Add'} Meal
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingMeal(null);
                  }}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              Announcements
            </h3>
            {announcements.length > 0 ? (
              <div className="space-y-3">
                {announcements.sort((a, b) => new Date(b.date) - new Date(a.date)).map(announcement => (
                  <div key={announcement.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{announcement.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{announcement.message}</p>
                        <p className="text-xs text-gray-400 mt-2">{announcement.date}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditAnnouncement(announcement)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAnnouncement(announcement.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No announcements yet</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">All Scheduled Meals</h3>
            {meals.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {meals.sort((a, b) => new Date(b.date) - new Date(a.date)).map(meal => (
                  <div key={meal.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-lg">{formatDate(meal.date)}</p>
                        <p className="text-sm text-gray-500">{meal.date}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(meal)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(meal.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="font-semibold text-yellow-700">Breakfast</p>
                        <p className="text-gray-600 text-xs">{meal.breakfast}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-orange-700">Lunch</p>
                        <p className="text-gray-600 text-xs">{meal.lunch}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-green-700">Snacks</p>
                        <p className="text-gray-600 text-xs">{meal.snacks}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-blue-700">Dinner</p>
                        <p className="text-gray-600 text-xs">{meal.dinner}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No meals scheduled yet</p>
            )}
          </div>
        </div>
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