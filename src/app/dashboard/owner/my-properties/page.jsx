import { getProperty } from '@/lib/api/property';
import React from 'react';
import PropertiesTable from './PropertiesTable';


const OwnerMyProperties = async() => {
    const properties = await getProperty();
    return (
        <div>
             My Properties
             <PropertiesTable propertiesData={{ data: properties }} />
        </div>
    );
};

export default OwnerMyProperties;