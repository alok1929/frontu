import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [regions, setRegions] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedTechnology, setSelectedTechnology] = useState('');
  const [collectionData, setCollectionData] = useState([]);

  useEffect(() => {
    // Fetch regions on component mount
    axios.get('http://localhost:3000/getRegions')
      .then(response => setRegions(response.data.regions))
      .catch(error => console.error('Error fetching regions:', error));
  }, []);

  useEffect(() => {
    // Fetch technologies when a region is selected
    if (selectedRegion) {
      axios.get(`http://localhost:3000/getDocuments/${selectedRegion}`)
        .then(response => setTechnologies(response.data.documents))
        .catch(error => console.error('Error fetching technologies:', error));
    } else {
      // Clear technologies when no region is selected
      setTechnologies([]);
    }
  }, [selectedRegion]);

  const fetchData = async () => {
    try {
      let endpoint = '';

      if (selectedRegion && selectedTechnology) {
        endpoint = `http://localhost:3000/getCollections/${selectedRegion}/${selectedTechnology}`;
      } else if (selectedRegion && !selectedTechnology) {
        endpoint = `http://localhost:3000/getCollectionss/${selectedRegion}`;
      } else if (!selectedRegion && selectedTechnology) {
        endpoint = `http://localhost:3000/getCollectionsByTechnology/:${selectedTechnology}`;
      }

      const response = await axios.get(endpoint);
      const responseData = response.data.collections;

      if (!responseData) {
        console.log('No data available for the selected region.');
        setCollectionData([]); // Clear the previous data
      } else {
        setCollectionData(responseData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <h1>Firestore Data Fetcher</h1>
      <div>
        <label>
          Region:
          <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
            <option value="">Select Region</option>
            {regions.map(region => <option key={region} value={region}>{region}</option>)}
          </select>
        </label>
      </div>
      <div>
        <label>
          Technology:
          <select value={selectedTechnology} onChange={(e) => setSelectedTechnology(e.target.value)}>
            <option value="">Select Technology</option>
            {technologies.map(tech => <option key={tech} value={tech}>{tech}</option>)}
          </select>
        </label>
      </div>
      <div>
        <button onClick={fetchData}>Search</button>
      </div>
      <div>
        <h2>Collection Data:</h2>
        <ul>
          {collectionData.map((item, index) => (
            <li key={index}>
              <strong>Region:</strong> {item.region}, <strong>Document ID:</strong> {item.documentId}, <strong>Collection ID:</strong> {item.collectionId}
              <ul>
                {item.data.map((doc, docIndex) => (
                  <li key={docIndex}>
                    {JSON.stringify(doc)}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
