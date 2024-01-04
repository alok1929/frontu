import React from 'react';
import aliasNames from './aliasNames.json';


const DataGridComponent = ({ detailedData }) => {
  return (
    <div>
      {Array.isArray(detailedData) ? (
        detailedData.length > 0 ? (
          <div className="">
            {detailedData.map((item, index) => (
              <div key={index} className="grid grid-cols-4 grid-rows-4">
                {Object.entries(item)
                  .filter(([key, value]) =>
                    value !== 'false' &&
                    key !== 'technology' &&
                    key !== 'region' &&
                    key !== 'plant' &&
                    key !== 'contractName' &&
                    key !== 'isActive' &&
                    key !== 'updateHistory'
                  )
                  .map(([key, value], innerIndex) => (
                    <div key={innerIndex} className="bg-gray-200 w-11/12 h-24  inline-block m-4 py-2 rounded-lg">
                      <div className="flex-col px-2">
                        <div>
                          <div className="flex flex-col w-4/5">
                            <div className=' text-sm  font-bold px-2'>{aliasNames[key]|| key}:</div>
                            <div>
                              <span className="p-2 text-md" style={{ wordBreak: 'break-all', overflowWrap: 'break-word', overflow: 'scroll' }}>
                                {typeof value === 'object' ? JSON.stringify(value, null, 2) : value}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
            
           
            
          </div>
        ) : (
          
          <p>No data available for the selected filters</p>
        )
      ) : (
        <div>
          <p className='text-xl font-mono flex justify-center mb-4 py-4 animate-bounce   '>
            Loading
          </p>
        </div>
      )}
    </div>
  );
};

export default DataGridComponent;

<div>
        <ul>
          {collectionData.map((item, index) => (
            <li key={index}>
              

              <ul>
                {Object.entries(item)
                  .filter(([key, value]) => key !== 'region' && key !== 'plant' && key !== 'technology')
                  .map(([key, value]) => (
                    <div className='flex grid grid-cols-4 grid-row-4'>
                      <li key={key}>
                      <strong>{key}:</strong> {value}
                    </li>
                    </div>
                    
                  ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>