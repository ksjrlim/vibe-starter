import React, { useState } from 'react';
import { Bookmark, Star, Clock, ChefHat, Check } from 'lucide-react';

export const RecipeCard: React.FC = () => {
  const [isSaved, setIsSaved] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});

  const toggleIngredient = (idx: number) => {
    setCheckedIngredients((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const ingredients = [
    '1 pound shelf-stable or fresh potato gnocchi',
    '2 pints cherry or grape tomatoes',
    '4 garlic cloves, smashed and peeled',
    '1/4 cup extra-virgin olive oil',
    '1 ball (8 oz) fresh burrata or torn mozzarella',
    'Handful fresh basil leaves & flaky sea salt',
  ];

  return (
    <div className="bg-[#fcfaf7] border border-[#e8dfd5] p-4 rounded my-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-widest text-[#9333ea] font-nyt-sans">
          <ChefHat className="w-3.5 h-3.5 text-[#9333ea]" />
          <span>NYT Cooking • Recipe of the Day</span>
        </div>
        <button
          onClick={() => setIsSaved(!isSaved)}
          className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-nyt-sans transition-colors cursor-pointer ${
            isSaved
              ? 'bg-[#121212] text-white'
              : 'border border-gray-300 text-gray-700 hover:border-black'
          }`}
        >
          <Bookmark className={`w-3 h-3 ${isSaved ? 'fill-white' : ''}`} />
          <span>{isSaved ? 'Saved in Recipe Box' : 'Save Recipe'}</span>
        </button>
      </div>

      <h3 className="font-nyt-headline font-bold text-[18px] text-[#121212] leading-snug mb-1">
        Sheet-Pan Crispy Gnocchi With Blistered Tomatoes & Basil
      </h3>
      <p className="text-[11.5px] text-gray-600 font-nyt-sans mb-3">
        By Ali Slagle • No boiling required: tossing the gnocchi straight onto a hot sheet pan results in crispy exteriors and tender, pillowy centers.
      </p>

      {/* Meta Specs */}
      <div className="flex items-center gap-4 text-[11px] text-gray-700 font-nyt-sans border-y border-[#ede5db] py-2 mb-3">
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-gray-500" />
          <span>25 Minutes</span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
          <span className="font-bold">4.8</span>
          <span className="text-gray-500">(3,420 notes)</span>
        </div>
        <span>•</span>
        <span className="font-medium text-emerald-800">Easy Weeknight</span>
      </div>

      {/* Interactive Ingredient Checklist */}
      <div>
        <h4 className="text-[10.5px] font-bold uppercase tracking-wider text-gray-500 font-nyt-sans mb-2">
          Ingredients Checklist
        </h4>
        <div className="space-y-1.5">
          {ingredients.map((item, idx) => (
            <label
              key={idx}
              onClick={() => toggleIngredient(idx)}
              className="flex items-center gap-2 text-[12px] font-nyt-sans text-gray-800 cursor-pointer select-none group"
            >
              <div
                className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
                  checkedIngredients[idx]
                    ? 'bg-black border-black text-white'
                    : 'border-gray-300 group-hover:border-black bg-white'
                }`}
              >
                {checkedIngredients[idx] && <Check className="w-2.5 h-2.5" />}
              </div>
              <span className={checkedIngredients[idx] ? 'line-through text-gray-400' : ''}>
                {item}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
