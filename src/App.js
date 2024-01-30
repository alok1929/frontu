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
  // const [showGrid, setShowGrid] = useState(false);
  const [showContractInfo, setShowContractInfo] = useState(false);
  const [showhistoryInfo, setShowhistoryInfo] = useState(false);


  const [contractInfoData, setContractInfoData] = useState([]);


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


      {collectionData.map((item, index) => (
        <div key={index} className='px-7 m-7 py-3 bg-slate-300 rounded-2xl mt-6 '>
          <div className='flex py-4 px-2'>
            {item.region && (
              <div className="bg-blue-500 w-min p-6 text-white px-4 py-2 rounded-xl">
                {item.plant.toUpperCase()}
              </div>
            )}
          </div>
          <div key={index} className="grid grid-cols-3 grid-rows-2">
            {Object.entries(item)
              .filter(([key, value]) =>
                key !== 'region'
                && key !== 'plant'
                && key !== 'technology'
                && key !== 'userHistory'
                && key !== 'updateHistory'
                && key !== 'contractName'
                && key !== 'isActive'
                && key !== 'contractInfo'
              )
              .map(([key, value], innerIndex) => (
                <div key={innerIndex} className="bg-gray-200 w-11/12 h-24 inline-block m-4 py-2 rounded-lg">
                  <div className="flex-col px-2">
                    <div>
                      <div className="flex flex-col w-4/5">
                        <div className=' text-sm font-bold px-2'>{key}:</div>
                        <div>
                          <span className='px-2 '>
                            <span>{JSON.stringify(value)} </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className='flex mr-2'>

            <div className='flex justify-center w-screen items-center py-2 p-4'>
              <div className='mr-14 mb-3 text-2xl font-medium '>

              </div>
            </div>
          </div>

          {/* Rendering for each contract in the contractName array */}
          {item.contractName.map((contract, contractIndex) => (
            <div key={contractIndex} className='px-4 py-2'>
              <strong className=' px-2 text-lg'>Contract  {contractIndex}: </strong>

              <div className='py-2'>
                <div className=''>
                  <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow  dark:bg-gray-800 dark:border-gray-700">
                    {item.contractName && item.contractName.length > 0 && (
                      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {item.contractName[0].contractName}
                      </h5>

                    )}
                    <div className=''>

                      <p className=" font-normal text-gray-700 dark:text-gray-400">
                        <div>Contract Start Date:
                          <strong className='text-white px-1'>
                            {formatTimestamp(contract.contractStartDate)}
                          </strong>
                        </div>
                        <div>Contract End Date:
                          <strong className='text-white px-1'>
                            {formatTimestamp(contract.contractEndDate)}
                          </strong>
                        </div>
                        <div>
                          {item.isActive === 'true' ? (
                            <div className='flex '>
                              <div className=''>Contract Status:</div>
                              <span className='text-green-500 px-1 font-mono py-0.5'>
                                ACTIVE
                              </span>
                            </div>
                          ) : (
                            <div className='flex '>
                              <div className=''>Contract Status:</div>
                              <span className='text-red-500 px-1 font-mono py-0.5'>
                                NOT ACTIVE
                              </span>
                            </div>
                          )
                          }
                        </div>
                      </p>
                      <button
                        onClick={() => setShowhistoryInfo(prevState => !prevState)}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        Timeline
                        <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                        </svg>
                      </button>
                      <div></div>
                     
                    </div>
                  </div>
                   {showhistoryInfo ? (
                        contract.TupdateHistory && contract.TupdateHistory.length > 0 && (
                          <div>
                            {contract.TupdateHistory.map((update, updateIndex) => (
                               <div key={updateIndex} className='py-4  bg-blue-400 rounded-xl p-4 m-5'>
                               <div className='py-2 px-2'>
                                
                                 <div className="items-center justify-between p-5 py-2  border-gray-200 
                                 rounded-md shadow-sm sm:flex dark:bg-slate-300 ">
           
           
           
                                   <div className='space-x-2'>
           
                                     <div class="flex font-medium dark:text-white space-x-2 py-2">
                                       <div className='flex bg-gray-700 rounded-full p-2  py-2'>
                                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                           <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
                                         </svg>
                                         {update.user}
                                       </div>
           
                                       <div className='py-2 px-2'>
                                         {update.description.toLowerCase().includes('updated') && (
                                           <span class="bg-blue-500 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-800 dark:text-white">
                                             Update
                                           </span>
                                         )}
                                         {update.description.toLowerCase().includes('corrected') && (
                                           <span class="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-500 dark:text-white">
                                             Edit
                                           </span>
                                         )}
                                         {update.description.toLowerCase().includes('created') && (
                                           <span class="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-500 dark:text-white">
                                             New
                                           </span>
                                         )}
                                       </div>
           
           
                                       <div className='flex justify-center items-center text-black text-sm'>
                                       {formatTimestamp(update.timestamp)}
                                       </div>
           
                                     </div>
                                     <div className='flex space-x-60'>
           
                                       <div class=" text-sm py-2 dark:text-gray-400">
                                         <p className='font-bold text-sm text-slate-700'>Description:<br /></p>
                                         <p className='text-black  text-md'> {update.description}</p>
           
                                         <div className=' py-2 text-black'>
                                           <p className='font-bold text-sm text-slate-700'>Comment:</p>
                                           <p className='text-black text-md '> {update.comment}</p>
                                         </div>
           
                                       </div>
           
           
           
                                     </div>
                                   </div>
           
           
                                 </div>
                               </div>
                             </div>
                            ))}
                          </div>
                        )




                      ) : <div></div>
                      }
                </div>


              </div>


            </div>
          ))}



        </div>
      ))}

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
