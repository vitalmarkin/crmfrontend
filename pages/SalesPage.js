import React from 'react';
import SalesForm from '../components/SalesForm';
import DealsTable from '../components/DealsTable';

const SalesPage = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sales</h1>
      <SalesForm />
      <DealsTable />
    </div>
  );
};

export default SalesPage;
