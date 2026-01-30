// Diet Plan Page
'use client';

import { useState } from 'react';
import { getDietRecommendation } from '@/lib/actions/recommendations';
import { 
  Apple, 
  Loader2, 
  Coffee, 
  Sun, 
  Moon,
  Utensils,
  Droplets,
  AlertCircle,
  RefreshCw,
  ThumbsUp,
  Check,
  X,
  Sparkles,
} from 'lucide-react';

export default function DietPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [dietPlan, setDietPlan] = useState<any>(null);
  const [specificRequest, setSpecificRequest] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function generateDietPlan() {
    setIsLoading(true);
    setError(null);
    
    const result = await getDietRecommendation(specificRequest || undefined);
    
    if (result.success) {
      setDietPlan(result.data);
    } else {
      setError(result.error || 'Failed to generate diet plan');
    }
    
    setIsLoading(false);
  }

  return (
    <div className="max-w-5xl mx-auto pb-20 lg:pb-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-health-text">Diet Plan</h1>
        <p className="text-health-muted">Get personalized nutrition recommendations based on your health profile</p>
      </div>

      {/* Request Section */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary-600" />
          <h2 className="font-semibold text-health-text">Generate Your Diet Plan</h2>
        </div>
        
        <p className="text-sm text-health-muted mb-4">
          Our AI will create a personalized diet plan based on your health profile, conditions, and goals.
          You can also add specific requirements.
        </p>

        <textarea
          value={specificRequest}
          onChange={(e) => setSpecificRequest(e.target.value)}
          placeholder="Any specific requirements? e.g., 'I need more protein' or 'Low carb options' (optional)"
          className="textarea mb-4"
          rows={2}
        />

        <button
          onClick={generateDietPlan}
          disabled={isLoading}
          className="btn-primary"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : dietPlan ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate Plan
            </>
          ) : (
            <>
              <Apple className="w-4 h-4 mr-2" />
              Generate Diet Plan
            </>
          )}
        </button>

        {error && (
          <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}
      </div>

      {/* Diet Plan Display */}
      {dietPlan && (
        <div className="space-y-6 animate-fadeIn">
          {/* Overview */}
          <div className="card">
            <h2 className="text-lg font-semibold text-health-text mb-4">Daily Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-orange-50">
                <p className="text-sm text-orange-600 mb-1">Daily Calories</p>
                <p className="text-2xl font-bold text-orange-700">{dietPlan.dailyCalories}</p>
                <p className="text-xs text-orange-600">kcal</p>
              </div>
              {dietPlan.macros && (
                <>
                  <div className="p-4 rounded-lg bg-blue-50">
                    <p className="text-sm text-blue-600 mb-1">Protein</p>
                    <p className="text-2xl font-bold text-blue-700">{dietPlan.macros.protein}g</p>
                    <p className="text-xs text-blue-600">{Math.round((dietPlan.macros.protein * 4 / dietPlan.dailyCalories) * 100)}% of calories</p>
                  </div>
                  <div className="p-4 rounded-lg bg-green-50">
                    <p className="text-sm text-green-600 mb-1">Carbs</p>
                    <p className="text-2xl font-bold text-green-700">{dietPlan.macros.carbs}g</p>
                    <p className="text-xs text-green-600">{Math.round((dietPlan.macros.carbs * 4 / dietPlan.dailyCalories) * 100)}% of calories</p>
                  </div>
                  <div className="p-4 rounded-lg bg-purple-50">
                    <p className="text-sm text-purple-600 mb-1">Fats</p>
                    <p className="text-2xl font-bold text-purple-700">{dietPlan.macros.fats}g</p>
                    <p className="text-xs text-purple-600">{Math.round((dietPlan.macros.fats * 9 / dietPlan.dailyCalories) * 100)}% of calories</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Meals */}
          <div className="card">
            <h2 className="text-lg font-semibold text-health-text mb-4">Daily Meals</h2>
            <div className="space-y-4">
              {dietPlan.meals?.map((meal: any, index: number) => (
                <MealCard key={index} meal={meal} />
              ))}
            </div>
          </div>

          {/* Foods to Include/Avoid */}
          <div className="grid md:grid-cols-2 gap-6">
            {dietPlan.foodsToInclude && (
              <div className="card">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-health-text">Foods to Include</h3>
                </div>
                <ul className="space-y-2">
                  {dietPlan.foodsToInclude.map((food: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <ThumbsUp className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                      <span>{food}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {dietPlan.foodsToAvoid && (
              <div className="card">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                    <X className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-health-text">Foods to Avoid</h3>
                </div>
                <ul className="space-y-2">
                  {dietPlan.foodsToAvoid.map((food: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <X className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <span>{food}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Hydration Tips */}
          {dietPlan.hydrationTips && (
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Droplets className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-health-text">Hydration Tips</h3>
              </div>
              <ul className="space-y-2">
                {dietPlan.hydrationTips.map((tip: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Droplets className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Special Notes */}
          {dietPlan.specialNotes && dietPlan.specialNotes.length > 0 && (
            <div className="card bg-amber-50 border-amber-200">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold text-amber-800">Special Notes</h3>
              </div>
              <ul className="space-y-2">
                {dietPlan.specialNotes.map((note: string, i: number) => (
                  <li key={i} className="text-sm text-amber-800">• {note}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Disclaimer */}
          <div className="p-4 rounded-lg bg-gray-100 text-sm text-health-muted">
            <strong>⚠️ Disclaimer:</strong> This diet plan is for general wellness purposes only. 
            It is not a substitute for professional nutritional advice. Please consult a dietitian 
            or healthcare provider before making significant changes to your diet, especially if 
            you have health conditions.
          </div>
        </div>
      )}
    </div>
  );
}

function MealCard({ meal }: { meal: any }) {
  const icons: Record<string, any> = {
    breakfast: Coffee,
    lunch: Sun,
    dinner: Moon,
    snack: Apple,
  };

  const colors: Record<string, string> = {
    breakfast: 'bg-orange-100 text-orange-600',
    lunch: 'bg-yellow-100 text-yellow-600',
    dinner: 'bg-purple-100 text-purple-600',
    snack: 'bg-green-100 text-green-600',
  };

  const mealType = meal.name?.toLowerCase() || 'snack';
  const Icon = icons[mealType] || Utensils;
  const color = colors[mealType] || 'bg-gray-100 text-gray-600';

  return (
    <div className="p-4 rounded-lg border border-health-border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-medium text-health-text capitalize">{meal.name}</h4>
            {meal.time && <p className="text-sm text-health-muted">{meal.time}</p>}
          </div>
        </div>
        {meal.calories && (
          <span className="text-sm font-medium text-health-muted">{meal.calories} kcal</span>
        )}
      </div>
      
      {meal.items && (
        <ul className="space-y-1">
          {meal.items.map((item: string, i: number) => (
            <li key={i} className="text-sm text-health-text flex items-start gap-2">
              <span className="text-primary-600">•</span>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
