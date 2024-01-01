import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [regions, setRegions] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedTechnology, setSelectedTechnology] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [collectionData, setCollectionData] = useState([]);

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
        <div>
          <label>
            Technology:
            <select value={selectedTechnology} onChange={(e) => setSelectedTechnology(e.target.value)}>
              <option value="">Select Technology</option>
              {technologies.map(tech => <option key={tech} value={tech}>{tech}</option>)}
            </select>
          </label>
        </div>
      </div>
      <div>
        <button onClick={fetchData}>Search</button>
      </div>
      <h2>Data :</h2>


      <ul>
        {collectionData.map((item, index) => (
          <li key={index}>
            <strong>Region:</strong> {item.region}
            <br></br>
            <strong>Plant:</strong> {item.plant}
            <br></br>
            <strong>Technology:</strong> {item.technology}

            <ul>
              {Object.entries(item)
                .filter(([key, value]) => key !== 'region' && key!=='plant' && key!=='technology')
                .map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {value}
                  </li>
                ))}
            </ul>
          </li>
        ))}
      </ul>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default App;
