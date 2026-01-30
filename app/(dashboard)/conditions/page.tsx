// Health Conditions / Disease Management Page
'use client';

import { useState, useEffect } from 'react';
import { getConditionGuidance, getUserConditions } from '@/lib/actions/recommendations';
import { 
  Loader2, 
  AlertCircle,
  Heart,
  Shield,
  Pill,
  Apple,
  Dumbbell,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Info,
  Phone,
  Plus,
  Search,
} from 'lucide-react';

const COMMON_CONDITIONS = [
  'Diabetes Type 2',
  'Hypertension',
  'Heart Disease',
  'Asthma',
  'Arthritis',
  'Thyroid Disorder',
  'PCOD/PCOS',
  'Obesity',
  'High Cholesterol',
  'Back Pain',
  'Migraine',
  'Anxiety',
  'Depression',
  'Insomnia',
  'Gastritis',
  'IBS',
];

export default function ConditionsPage() {
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [guidance, setGuidance] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userConditions, setUserConditions] = useState<string[]>([]);
  const [loadingUserConditions, setLoadingUserConditions] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUserConditions();
  }, []);

  async function loadUserConditions() {
    setLoadingUserConditions(true);
    const result = await getUserConditions();
    if (result.success && result.data) {
      setUserConditions(result.data);
    }
    setLoadingUserConditions(false);
  }

  async function loadGuidance(condition: string) {
    setSelectedCondition(condition);
    setIsLoading(true);
    setError(null);
    
    const result = await getConditionGuidance(condition);
    
    if (result.success) {
      setGuidance(result.data);
    } else {
      setError(result.error || 'Failed to load guidance');
    }
    
    setIsLoading(false);
  }

  const filteredConditions = searchQuery 
    ? COMMON_CONDITIONS.filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
    : COMMON_CONDITIONS;

  return (
    <div className="max-w-5xl mx-auto pb-20 lg:pb-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-health-text">Health Conditions</h1>
        <p className="text-health-muted">Get management guidance for various health conditions</p>
      </div>

      {/* Your Conditions */}
      {!loadingUserConditions && userConditions.length > 0 && (
        <div className="card mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-red-500" />
            <h2 className="font-semibold text-health-text">Your Health Conditions</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {userConditions.map((condition, i) => (
              <button
                key={i}
                onClick={() => loadGuidance(condition)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCondition === condition
                    ? 'bg-primary-600 text-white'
                    : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                }`}
              >
                {condition}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search & Browse */}
      <div className="card mb-6">
        <h2 className="font-semibold text-health-text mb-4">Browse Conditions</h2>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-health-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conditions..."
            className="input pl-10"
          />
        </div>

        {/* Condition Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {filteredConditions.map((condition) => (
            <button
              key={condition}
              onClick={() => loadGuidance(condition)}
              className={`p-3 rounded-lg text-sm font-medium text-left transition-colors ${
                selectedCondition === condition
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-health-text hover:bg-gray-200'
              }`}
            >
              {condition}
            </button>
          ))}
        </div>

        {/* Custom Search */}
        {searchQuery && filteredConditions.length === 0 && (
          <div className="mt-4 text-center">
            <p className="text-health-muted mb-2">Condition not found in list?</p>
            <button
              onClick={() => loadGuidance(searchQuery)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Get guidance for "{searchQuery}"
            </button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="card">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            <span className="ml-3 text-health-muted">Loading guidance for {selectedCondition}...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="card bg-red-50 border-red-200">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Guidance Display */}
      {guidance && !isLoading && (
        <div className="space-y-6 animate-fadeIn">
          {/* Overview */}
          <div className="card">
            <h2 className="text-xl font-bold text-health-text mb-4">{guidance.condition}</h2>
            {guidance.overview && (
              <p className="text-health-muted mb-4">{guidance.overview}</p>
            )}
            {guidance.severity && (
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                guidance.severity === 'mild' ? 'bg-green-100 text-green-700' :
                guidance.severity === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                <Shield className="w-4 h-4" />
                {guidance.severity} condition
              </div>
            )}
          </div>

          {/* Warning Signs */}
          {guidance.warningSignsToWatch && guidance.warningSignsToWatch.length > 0 && (
            <div className="card bg-red-50 border-red-200">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-red-800">Warning Signs to Watch</h3>
              </div>
              <ul className="space-y-2">
                {guidance.warningSignsToWatch.map((sign: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    {sign}
                  </li>
                ))}
              </ul>
              <div className="mt-4 p-3 rounded-lg bg-red-100">
                <div className="flex items-center gap-2 text-red-800">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm font-medium">Seek immediate medical attention if these symptoms occur</span>
                </div>
              </div>
            </div>
          )}

          {/* Diet Recommendations */}
          {guidance.dietRecommendations && (
            <GuidanceSection
              icon={Apple}
              title="Diet Recommendations"
              items={guidance.dietRecommendations.include}
              avoid={guidance.dietRecommendations.avoid}
              iconColor="text-green-600"
              bgColor="bg-green-100"
            />
          )}

          {/* Exercise Recommendations */}
          {guidance.exerciseGuidelines && (
            <GuidanceSection
              icon={Dumbbell}
              title="Exercise Guidelines"
              items={guidance.exerciseGuidelines.recommended}
              avoid={guidance.exerciseGuidelines.avoid}
              iconColor="text-blue-600"
              bgColor="bg-blue-100"
            />
          )}

          {/* Lifestyle Changes */}
          {guidance.lifestyleChanges && guidance.lifestyleChanges.length > 0 && (
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-health-text">Lifestyle Changes</h3>
              </div>
              <ul className="space-y-2">
                {guidance.lifestyleChanges.map((change: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-health-text">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    {change}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Medication Notes */}
          {guidance.medicationNotes && guidance.medicationNotes.length > 0 && (
            <div className="card bg-blue-50 border-blue-200">
              <div className="flex items-center gap-2 mb-4">
                <Pill className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-800">Medication Notes</h3>
              </div>
              <ul className="space-y-2">
                {guidance.medicationNotes.map((note: string, i: number) => (
                  <li key={i} className="text-sm text-blue-800 flex items-start gap-2">
                    <Info className="w-4 h-4 shrink-0 mt-0.5" />
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Monitoring Tips */}
          {guidance.monitoringTips && guidance.monitoringTips.length > 0 && (
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-primary-600" />
                <h3 className="font-semibold text-health-text">Self-Monitoring Tips</h3>
              </div>
              <ul className="space-y-2">
                {guidance.monitoringTips.map((tip: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-health-text">
                    <CheckCircle2 className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* When to See a Doctor */}
          {guidance.whenToSeeDoctor && guidance.whenToSeeDoctor.length > 0 && (
            <div className="card bg-amber-50 border-amber-200">
              <div className="flex items-center gap-2 mb-4">
                <Phone className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold text-amber-800">When to See a Doctor</h3>
              </div>
              <ul className="space-y-2">
                {guidance.whenToSeeDoctor.map((item: string, i: number) => (
                  <li key={i} className="text-sm text-amber-800 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Disclaimer */}
          <div className="p-4 rounded-lg bg-gray-100 text-sm text-health-muted">
            <strong>⚠️ Important Disclaimer:</strong> This information is for educational purposes only 
            and is not a substitute for professional medical advice, diagnosis, or treatment. Always 
            seek the advice of your physician or other qualified health provider with any questions 
            you may have regarding a medical condition. Never disregard professional medical advice 
            or delay in seeking it because of something you have read here.
          </div>
        </div>
      )}
    </div>
  );
}

function GuidanceSection({ 
  icon: Icon, 
  title, 
  items, 
  avoid, 
  iconColor, 
  bgColor 
}: { 
  icon: any; 
  title: string; 
  items?: string[]; 
  avoid?: string[];
  iconColor: string;
  bgColor: string;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  if ((!items || items.length === 0) && (!avoid || avoid.length === 0)) {
    return null;
  }

  return (
    <div className="card">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          <h3 className="font-semibold text-health-text">{title}</h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-health-muted" />
        ) : (
          <ChevronDown className="w-5 h-5 text-health-muted" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          {items && items.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Recommended
              </h4>
              <ul className="space-y-2">
                {items.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-health-text">
                    <span className="text-green-600">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {avoid && avoid.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-red-700 mb-2 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> Avoid
              </h4>
              <ul className="space-y-2">
                {avoid.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-health-text">
                    <span className="text-red-600">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
