// Diet Plan Page
'use client';

import { useState, useEffect } from 'react';
import { getDietRecommendation, getUserRecommendations } from '@/lib/actions/recommendations';
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
  Printer,
  History,
  ChevronRight,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function DietPage() {
  const [activeTab, setActiveTab] = useState<'generate' | 'history'>('generate');
  const [isLoading, setIsLoading] = useState(false);
  const [dietPlan, setDietPlan] = useState<any>(null);
  const [specificRequest, setSpecificRequest] = useState('');
  const [error, setError] = useState<string | null>(null);

  // History state
  const [historyItems, setHistoryItems] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Load history when tab changes
  useEffect(() => {
    if (activeTab === 'history') {
      loadHistory();
    }
  }, [activeTab]);

  async function loadHistory() {
    setIsLoadingHistory(true);
    const result = await getUserRecommendations('DIET');
    if (result.success && result.data) {
      setHistoryItems(result.data);
    }
    setIsLoadingHistory(false);
  }

  async function generateDietPlan() {
    setIsLoading(true);
    setError(null);

    const result = await getDietRecommendation(specificRequest || undefined);

    if (result.success) {
      setDietPlan(result.data);
      // Refresh history if we switch tabs later
      if (activeTab === 'history') loadHistory();
    } else {
      setError(result.error || 'Failed to generate diet plan');
    }

    setIsLoading(false);
  }

  function handlePrint() {
    window.print();
  }

  function loadFromHistory(item: any) {
    setDietPlan(item.content);
    setActiveTab('generate'); // Switch back to view it
  }

  return (
    <div className="max-w-5xl mx-auto pb-20 lg:pb-6">
      {/* Header */}
      <div className="mb-6 no-print">
        <h1 className="text-2xl font-bold text-health-text">Diet Plan</h1>
        <p className="text-health-muted">Get personalized nutrition recommendations</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 no-print border-b border-health-border">
        <button
          onClick={() => setActiveTab('generate')}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
            activeTab === 'generate'
              ? "border-primary-600 text-primary-600"
              : "border-transparent text-health-muted hover:text-health-text"
          )}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Current Plan
          </div>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
            activeTab === 'history'
              ? "border-primary-600 text-primary-600"
              : "border-transparent text-health-muted hover:text-health-text"
          )}
        >
          <div className="flex items-center gap-2">
            <History className="w-4 h-4" />
            History
          </div>
        </button>
      </div>

      {/* GENERATE TAB */}
      {activeTab === 'generate' && (
        <div className="animate-fadeIn">
          {/* Request Section - Hide when printing */}
          <div className="card mb-6 no-print">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary-600" />
              <h2 className="font-semibold text-health-text">Generate New Plan</h2>
            </div>

            <p className="text-sm text-health-muted mb-4">
              Our AI will create a personalized diet plan based on your health profile.
            </p>

            <textarea
              value={specificRequest}
              onChange={(e) => setSpecificRequest(e.target.value)}
              placeholder="e.g., 'I want a high protein vegetarian plan' (optional)"
              className="textarea mb-4"
              rows={2}
            />

            <div className="flex gap-2">
              <button
                onClick={generateDietPlan}
                disabled={isLoading}
                className="btn-primary flex-1 sm:flex-none"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Generate New Plan
                  </>
                )}
              </button>

              {dietPlan && (
                <button
                  onClick={handlePrint}
                  className="btn-secondary"
                  title="Print Diet Plan"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print / Save PDF
                </button>
              )}
            </div>

            {error && (
              <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}
          </div>

          {/* Diet Plan Display */}
          {dietPlan ? (
            <div id="printable-content" className="space-y-6">
              {/* Print Header - Only visible on print */}
              <div className="hidden print:block mb-8 text-center">
                <h1 className="text-3xl font-bold text-primary-800 mb-2">Personalized Diet Plan</h1>
                <p className="text-gray-600">Generated by Health Agent on {format(new Date(), 'PPP')}</p>
              </div>

              {/* Overview */}
              <div className="card print:shadow-none print:border-gray-200">
                <h2 className="text-lg font-semibold text-health-text mb-4">Daily Overview</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-orange-50 print:bg-gray-50 print:border">
                    <p className="text-sm text-orange-600 print:text-black mb-1">Daily Calories</p>
                    <p className="text-2xl font-bold text-orange-700 print:text-black">{dietPlan.dailyCalories}</p>
                    <p className="text-xs text-orange-600 print:text-gray-600">kcal</p>
                  </div>
                  {dietPlan.macros && (
                    <>
                      <div className="p-4 rounded-lg bg-blue-50 print:bg-gray-50 print:border">
                        <p className="text-sm text-blue-600 print:text-black mb-1">Protein</p>
                        <p className="text-2xl font-bold text-blue-700 print:text-black">{dietPlan.macros.protein}g</p>
                        <p className="text-xs text-blue-600 print:text-gray-600">{Math.round((dietPlan.macros.protein * 4 / dietPlan.dailyCalories) * 100)}%</p>
                      </div>
                      <div className="p-4 rounded-lg bg-green-50 print:bg-gray-50 print:border">
                        <p className="text-sm text-green-600 print:text-black mb-1">Carbs</p>
                        <p className="text-2xl font-bold text-green-700 print:text-black">{dietPlan.macros.carbs}g</p>
                        <p className="text-xs text-green-600 print:text-gray-600">{Math.round((dietPlan.macros.carbs * 4 / dietPlan.dailyCalories) * 100)}%</p>
                      </div>
                      <div className="p-4 rounded-lg bg-purple-50 print:bg-gray-50 print:border">
                        <p className="text-sm text-purple-600 print:text-black mb-1">Fats</p>
                        <p className="text-2xl font-bold text-purple-700 print:text-black">{dietPlan.macros.fats}g</p>
                        <p className="text-xs text-purple-600 print:text-gray-600">{Math.round((dietPlan.macros.fats * 9 / dietPlan.dailyCalories) * 100)}%</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Meals */}
              <div className="card print:shadow-none print:border-gray-200">
                <h2 className="text-lg font-semibold text-health-text mb-4">Daily Meals</h2>
                <div className="space-y-4">
                  {dietPlan.meals?.map((meal: any, index: number) => (
                    <MealCard key={index} meal={meal} />
                  ))}
                </div>
              </div>

              {/* Foods to Include/Avoid */}
              <div className="grid md:grid-cols-2 gap-6 print:block print:space-y-6">
                {dietPlan.foodsToInclude && (
                  <div className="card print:shadow-none print:border-gray-200 print:break-inside-avoid">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center print:bg-transparent">
                        <Check className="w-5 h-5 text-green-600 print:text-black" />
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
                  <div className="card print:shadow-none print:border-gray-200 print:break-inside-avoid">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center print:bg-transparent">
                        <X className="w-5 h-5 text-red-600 print:text-black" />
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
                <div className="card print:shadow-none print:border-gray-200 print:break-inside-avoid">
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

              {/* Special Notes - Only show on screen or if critical */}
              {dietPlan.specialNotes && dietPlan.specialNotes.length > 0 && (
                <div className="card bg-amber-50 border-amber-200 print:bg-transparent print:border-gray-200 print:break-inside-avoid">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    <h3 className="font-semibold text-amber-800 print:text-black">Special Notes</h3>
                  </div>
                  <ul className="space-y-2">
                    {dietPlan.specialNotes.map((note: string, i: number) => (
                      <li key={i} className="text-sm text-amber-800 print:text-black">• {note}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Disclaimer */}
              <div className="p-4 rounded-lg bg-gray-100 text-sm text-health-muted print:bg-transparent print:text-xs print:mt-8">
                <strong>⚠️ Disclaimer:</strong> This diet plan is for general wellness purposes only.
                It is not a substitute for professional nutritional advice.
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-health-muted">
              <Apple className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No plan generated yet. Use the form above to start.</p>
            </div>
          )}
        </div>
      )}

      {/* HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="animate-fadeIn">
          {isLoadingHistory ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
          ) : historyItems.length > 0 ? (
            <div className="space-y-4">
              {historyItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => loadFromHistory(item)}
                  className="card hover:border-primary-500/50 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary-500/10 rounded-lg text-primary-600">
                      <Apple className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-health-text group-hover:text-primary-600 transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-health-muted">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(item.createdAt), 'PPP')}
                        </span>
                        {item.content?.dailyCalories && (
                          <span>• {item.content.dailyCalories} kcal</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-health-muted group-hover:text-health-text" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-health-muted">
              <History className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No history found. Generate a plan to save it here.</p>
            </div>
          )}
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
    <div className="p-4 rounded-lg border border-health-border print:border-gray-200 print:break-inside-avoid">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center print:bg-gray-100 print:text-black`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-medium text-health-text capitalize print:text-black">{meal.name}</h4>
            {meal.time && <p className="text-sm text-health-muted print:text-gray-600">{meal.time}</p>}
          </div>
        </div>
        {meal.calories && (
          <span className="text-sm font-medium text-health-muted print:text-black">{meal.calories} kcal</span>
        )}
      </div>

      {meal.items && (
        <ul className="space-y-1">
          {meal.items.map((item: string, i: number) => (
            <li key={i} className="text-sm text-health-text flex items-start gap-2 print:text-black">
              <span className="text-primary-600 print:text-black">•</span>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
