import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import LogForm from '../components/LogForm';
import WorkoutForm from '../components/workoutform';
import EditModal from '../components/EditModal';

function DashboardPage() {
  const [meals, setMeals] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [aiRecommendation, setAiRecommendation] = useState('');
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const { authToken, user } = useAuth();

  useEffect(() => {
    console.log("DashboardPage mounted. Auth Token:", authToken); // <-- DEBUG LOG
    const fetchData = async () => {
      if (authToken) {
        setLoading(true);
        const config = { headers: { 'Authorization': `Bearer ${authToken}` } };
        try {
          console.log("Attempting to fetch data from backend..."); // <-- DEBUG LOG
          const mealsRes = await axios.get('http://localhost:5000/api/meals', config);
          const workoutsRes = await axios.get('http://localhost:5000/api/workouts', config);
          console.log("Data fetched successfully!"); // <-- DEBUG LOG
          setMeals(mealsRes.data);
          setWorkouts(workoutsRes.data);
        } catch (err) {
          console.error('--- FETCH DATA FAILED ---:', err); // <-- IMPORTANT ERROR LOG
        } finally {
          setLoading(false);
        }
      } else {
        console.log("No auth token found, skipping data fetch."); // <-- DEBUG LOG
        setLoading(false);
      }
    };
    fetchData();
  }, [authToken]);

  // --- All CRUD Functions ---
  const addMeal = async (mealData) => {
    const config = { headers: { 'Authorization': `Bearer ${authToken}` } };
    try {
      const res = await axios.post('http://localhost:5000/api/meals', mealData, config);
      setMeals([res.data, ...meals]);
    } catch (err) { console.error('--- ADD MEAL FAILED ---:', err); }
  };
  const deleteMeal = async (id) => {
      // ... delete meal logic
  };
  const updateMeal = async (updatedMeal) => {
      // ... update meal logic
  };
  const addWorkout = async (workoutData) => {
      // ... add workout logic
  };
  const deleteWorkout = async (id) => {
      // ... delete workout logic
  };
  const updateWorkout = async (updatedWorkout) => {
      // ... update workout logic
  };
  const getAiRecommendation = async () => {
    setAiLoading(true);
    setAiRecommendation('');
    const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
    const config = { headers: { 'Authorization': `Bearer ${authToken}` } };
    try {
      const res = await axios.post('http://localhost:5000/api/ai/recommend-meal', { currentCalories: totalCalories }, config);
      setAiRecommendation(res.data.recommendation);
    } catch (err) {
      console.error('--- AI RECOMMENDATION FAILED ---:', err); // <-- IMPORTANT ERROR LOG
      setAiRecommendation('Sorry, I could not get a recommendation at this time.');
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-8 text-gray-700">Loading your dashboard...</div>;
  }

  return (
    // ... JSX remains the same
    <div className="space-y-8">
      {editingItem && (
        <EditModal 
          item={editingItem} 
          onSave={'calories' in editingItem ? updateMeal : updateWorkout}
          onCancel={() => setEditingItem(null)}
        />
      )}
      <h1 className="text-3xl font-bold text-gray-800">Welcome, {user ? user.name : 'User'}!</h1>
      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-xl shadow-2xl">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Smart Suggestion
        </h2>
        <button 
          onClick={getAiRecommendation} 
          disabled={aiLoading}
          className="bg-white text-green-600 font-semibold py-2 px-6 rounded-full hover:bg-gray-100 transform hover:scale-105 transition-transform duration-300 shadow-lg flex items-center justify-center disabled:opacity-50 disabled:scale-100"
        >
          {aiLoading ? (
            <div className="w-5 h-5 border-t-2 border-b-2 border-green-600 rounded-full animate-spin"></div>
          ) : ( 'Get Meal Recommendation' )}
        </button>
        {aiRecommendation && (
          <p className="mt-4 p-4 bg-white/20 rounded-md">
            <strong>AI Coach:</strong> {aiRecommendation}
          </p>
        )}
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Log a Meal</h2>
          <LogForm onLog={addMeal} />
          <h3 className="text-xl font-semibold mt-6 mb-2 text-gray-600">Today's Meals</h3>
          <ul className="space-y-2">
            {meals.map(meal => (
              <li key={meal._id} className="p-3 bg-gray-50 rounded-md flex justify-between items-center">
                <span>{meal.name}</span>
                <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-600">{meal.calories} calories</span>
                  <button onClick={() => setEditingItem(meal)} className="text-blue-500 hover:text-blue-700 text-xs font-bold uppercase">Edit</button>
                  <button onClick={() => deleteMeal(meal._id)} className="text-red-500 hover:text-red-700 text-xs font-bold uppercase">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
           <h2 className="text-2xl font-semibold mb-4 text-gray-700">Log a Workout</h2>
          <WorkoutForm onLog={addWorkout} />
          <h3 className="text-xl font-semibold mt-6 mb-2 text-gray-600">Today's Workouts</h3>
          <ul className="space-y-2">
            {workouts.map(workout => (
              <li key={workout._id} className="p-3 bg-gray-50 rounded-md flex justify-between items-center">
                <span>{workout.name}</span>
                <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-600">{workout.duration}</span>
                  <button onClick={() => setEditingItem(workout)} className="text-blue-500 hover:text-blue-700 text-xs font-bold uppercase">Edit</button>
                  <button onClick={() => deleteWorkout(workout._id)} className="text-red-500 hover:text-red-700 text-xs font-bold uppercase">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;

