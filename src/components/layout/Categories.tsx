import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { categories } from '../../data/mockData';

export const Categories: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="bg-black py-3 sm:py-6 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <h2 className="text-base sm:text-lg font-bold text-gold">Shop by Category</h2>
          <div className="flex space-x-1.5">
            <button
              onClick={() => scroll('left')}
              className="p-1.5 bg-gray-900 text-gold rounded-lg hover:bg-gray-800 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-1.5 bg-gray-900 text-gold rounded-lg hover:bg-gray-800 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="flex-shrink-0 w-18 sm:w-20 cursor-pointer group"
            >
              <div className="bg-gray-900 border-2 border-gray-800 rounded-lg p-1.5 sm:p-2.5 hover:border-gold transition-all duration-200 group-hover:scale-105">
                <div className="text-2xl sm:text-3xl text-center mb-0.5 sm:mb-1">{category.icon}</div>
                <div className="text-[10px] text-white text-center font-medium truncate">
                  {category.name}
                </div>
                <div className="text-[10px] text-gray-400 text-center">
                  {category.count}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
