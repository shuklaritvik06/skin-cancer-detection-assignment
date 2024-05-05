import { useState, ChangeEvent } from 'react';
import axios from 'axios';

function App(): JSX.Element {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<any>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!selectedFile) {
        return;
      }
      const formData = new FormData();
      formData.append('image', selectedFile);
      const response = await axios.post<{ prediction: any }>('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setPrediction(response.data.prediction);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="border-dashed border-2 border-gray-400 p-6 rounded-lg">
        <input type="file" onChange={handleFileChange} className="mb-4" />
        <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Upload
        </button>
        <div>
          {selectedFile && (
            <div>
              <p className="font-bold">Selected Image:</p>
              <img src={URL.createObjectURL(selectedFile)} alt="Selected" className="max-w-sm" />
            </div>
          )}
        </div>
        {prediction && (
          <div className="mt-4">
            <p className="font-bold">Prediction:</p>
            <pre>{JSON.stringify(prediction, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
