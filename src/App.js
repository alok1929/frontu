import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditedSvg from './EditedSvg';
import NewContractsvg from './NewContractsvg';
import UpdatedSvg from './UpdatedSvg';

function App() {
  const [regions, setRegions] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedTechnology, setSelectedTechnology] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [collectionData, setCollectionData] = useState([]);
  const [showGrid, setShowGrid] = useState(false);



  function formatTimestamp(timestampObject) {
    const milliseconds = Number(timestampObject._seconds) * 1000 + Number(timestampObject._nanoseconds) / 1e6;
    const dateObject = new Date(milliseconds);
  
    // Format the date as DD-MM-YYYY
    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1; // Month is zero-based
    const year = dateObject.getFullYear();
  
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  }
  


  useEffect(() => {
    // Fetch regions on component mount
    axios.get('http://localhost:3000/getRegions')
      .then(response => setRegions(response.data.regions))
      .catch(error => {
        console.error('Error fetching regions:', error);
        setError('Failed to fetch regions');
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:3000/getTech')
      .then(response => setTechnologies(response.data.technologies))
      .catch(error => {
        console.error('Error fetching technologies:', error);
        setError('Failed to fetch technologies');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    console.log("Updated collection data:", collectionData);
  }, [collectionData]); // Log the updated collectionData when it changes

  const fetchData = async () => {
    try {
      let endpoint = '';
      if (selectedRegion && selectedTechnology) {
        endpoint = `http://localhost:3000/getDocumentsbyplantstech/${selectedRegion}/${selectedTechnology}/`;
      }
      else if (selectedRegion && !selectedTechnology) {
        endpoint = `http://localhost:3000/getDocuments/${selectedRegion}`;
      }
      else if (!selectedRegion && !selectedTechnology) {
        endpoint = `http://localhost:3000/getAllDocuments`;
      }
      else if (!selectedRegion && selectedTechnology) {
        endpoint = `http://localhost:3000/getDocumentsbytech/${selectedTechnology}`;
      }
      // setShowGrid(true);
      const response = await axios.get(endpoint);
      const responsu = response.data.documents;
      console.log("this is being set in collection data", responsu);
      setCollectionData(responsu);
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <div>
      <div className='flex flex-col justify-center items-center p-6 font-medium text-2xl bg-slate-200 px-12'>
        Contracts & Warranties
      </div>

      <div className='flex justify-center items-center py-10 space-x-20 bg-slate-200'>
        <label htmlFor='regions' className=''></label>
        <select
          id='regions'
          value={selectedRegion}
          className='rounded-lg p-3'
          onChange={(e) => setSelectedRegion(e.target.value)}

        >
          <option value="">Select Region</option>
          {regions.map(region =>
            <option key={region} value={region}>{region}
            </option>)}
        </select>

        <label htmlFor='technologies'></label>
        <select
          id='technologies'
          className='rounded-lg p-3'
          value={selectedTechnology}
          onChange={(e) => setSelectedTechnology(e.target.value)}
        >
          <option value="">Select Technology</option>
          {technologies.map(tech => <option key={tech} value={tech}>{tech}
          </option>)}
        </select>



        <div className='px-5'>
          <button
            className='text-white
           bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-6 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
            onClick={fetchData}
          >
            Search
          </button>
        </div>


      </div>
      <div className='text-2xl px-10 py-6'>Contracts</div>

      <div className="">
        {collectionData.map((item, index) => (
          <div key={index} className='px-7 m-7 py-3 bg-slate-300 rounded-2xl mt-6 '>
            <div className='flex mr-2 '>
              <div className='p-4 py-5 px-4 '>
                {item.isActive === 'true' && (
                  <div className="bg-green-500 p-6 text-white px-5 py-2 rounded-xl">Active</div>
                )}
              </div>
              <div className='flex justify-center w-screen items-center py-2 p-4'>
                <div className='mr-14 mb-3 text-2xl font-medium '>
                  {item.contractName && (
                    <h1 className='py-4 text-xl font-semibold'>{item.contractName}</h1>
                  )}
                </div>
              </div>
            </div>

            <div key={index} className="grid grid-cols-4 grid-rows-4">
              {Object.entries(item)
                .filter(([key, value]) =>
                  key !== 'region'
                  && key !== 'plant'
                  && key !== 'technology'
                  && key !== 'userHistory'
                  && key !== 'updateHistory'
                  && key !== 'contractName'
                  && key !== 'isActive'

                )
                .map(([key, value], innerIndex) => (
                  <div key={innerIndex} className="bg-gray-200 w-11/12 h-24  inline-block m-4 py-2 rounded-lg">
                    <div className="flex-col px-2">
                      <div>
                        <div className="flex flex-col w-4/5">
                          <div className=' text-sm  font-bold px-2'>{key}:</div>
                          <div>
                            <span className="p-2 text-md" style={{ wordBreak: 'break-all', overflowWrap: 'break-word', overflow: 'scroll' }}>
                              {key === 'contractStartDate' || key === 'contractEndDate' ? (
                                <span>{formatTimestamp(value)}</span>
                              ) : (
                                <span>{JSON.stringify(value)}</span>
                              )}

                            </span>
                          </div>
                        </div>
                      </div>

                    </div>



                  </div>
                ))}
            </div>

          </div>
        ))}

      </div>

      {/*timeline bitch */}





      {loading && <div className='flex justify-center items-center py-8'>
        <div className=' p-10 text-2xl font-medium bg-slate-300 rounded-xl  mt-6 animate-bounce w-4/5 text-center'>
          Loading
        </div>
      </div>}
    </div>
  );
}

export default App;
