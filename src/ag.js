<div className='px-20 '>

        <ol className="relative border-s py-2 border-gray-200 dark:border-gray-700">
          {Array.isArray(detailedData) && detailedData.map((item, index) => (
            <li key={index} className="mb-10 ms-6">
              {item.updateHistory
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // Sort in descending order
                .map((historyItem, historyIndex) => (
                  <div key={historyIndex} className='py-4'>
                    <div className='py-2 px-2'>
                      <span className="absolute flex items-center justify-center w-6 h-6 
                     bg-blue-100 rounded-xl -start-3 ring-8 ring-white dark:ring-slate-300 dark:bg-slate-300">

                        {historyItem.description.toLowerCase().includes('corrected') && (
                          <EditedSvg />
                        )}
                        {historyItem.description.toLowerCase().includes('updated') && (
                          <UpdatedSvg />
                        )}
                        {historyItem.description.toLowerCase().includes('created') && (
                          <NewContractsvg />
                        )}
                      </span>
                      <div className="items-center justify-between p-5 py-2  border-gray-200 
                      rounded-md shadow-sm sm:flex dark:bg-slate-300 ">



                        <div className='space-x-2'>

                          <div class="flex font-medium dark:text-white space-x-2 py-2">
                            <div className='flex bg-gray-700 rounded-full p-2  py-2'>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
                              </svg>
                              {historyItem.user}
                            </div>

                            <div className='py-2 px-2'>
                              {historyItem.description.toLowerCase().includes('updated') && (
                                <span class="bg-blue-500 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-800 dark:text-white">
                                  Update
                                </span>
                              )}
                              {historyItem.description.toLowerCase().includes('corrected') && (
                                <span class="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-500 dark:text-white">
                                  Edit
                                </span>
                              )}
                              {historyItem.description.toLowerCase().includes('created') && (
                                <span class="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-500 dark:text-white">
                                  New
                                </span>
                              )}
                            </div>


                            <div className='flex justify-center items-center text-black text-sm'>
                              {historyItem.timestamp}
                            </div>

                          </div>
                          <div className='flex space-x-60'>

                            <div class=" text-sm py-2 dark:text-gray-400">
                              <p className='font-bold text-sm text-slate-700'>Description:<br /></p>
                              <p className='text-black  text-md'> {historyItem.description}</p>

                              <div className=' py-2 text-black'>
                                <p className='font-bold text-sm text-slate-700'>Comment:</p>
                                <p className='text-black text-md '> {historyItem.comment}</p>
                              </div>

                            </div>



                          </div>
                        </div>


                      </div>
                    </div>
                  </div>

                ))}
              {item.updateHistory && item.updateHistory.length === 0 && (
                <div className="text-gray-500 dark:text-gray-300">No update history available</div>
              )}
            </li>
          ))}
        </ol>

      </div>
