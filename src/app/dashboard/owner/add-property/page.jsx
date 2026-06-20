
import AddPropertyModal from '@/components/dashboard/AddPropertyModal';
import React from 'react';


export default function AddProperty() {
  return (
    <div className="space-y-6">
      {/* Upper Layout Action Header Block */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-5">
        {/* Dynamic Modals Trigger Integration */}
        <AddPropertyModal/>
      </div>

    </div>
  );
}