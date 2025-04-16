import React from 'react';
import Filters from '../components/Filters';

const MarketingPage = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Marketing</h1>
      <Filters />
      {/* Здесь может быть таблица или результаты фильтрации */}
    </div>
  );
};

export default MarketingPage;
