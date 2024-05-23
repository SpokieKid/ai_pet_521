import React, { useState, useCallback } from 'react';
import axios from 'axios';
import './App.css';

const BASE_URL = 'http://148.135.56.110:5000/api/chat';  // 更新为你部署的 Vercel 地址

function App() {
  const [userInput, setUserInput] = useState('');
  const [responseText, setResponseText] = useState('');
  const [conversationHistory, setConversationHistory] = useState([
    {
      role: 'system',
      content: "You are a game world generator. I have provided you with a JSON file containing the player info and player-to-player action info. You must simulate possible actions based on the player info and the player-to-player action info. You can refer to similar games like Stardew Valley, Dwarf Fortress, where players/npcs have random actions with another player/npcs. What you need to simulate are the variables detailed in the 'action attributes' section of the JSON file. Simulate 10 possible actions based on the action attributes."
    }
  ]);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const sendMessage = useCallback(async (userMessage, jsonData) => {
    const newConversationHistory = [
      ...conversationHistory,
      { role: 'user', content: userMessage },
      { role: 'user', content: jsonData }
    ];

    const data = {
      messages: newConversationHistory,
      model: 'deepseek-chat',
      frequency_penalty: 0,
      max_tokens: 2048,
      presence_penalty: 0,
      stop: null,
      stream: false,
      temperature: 1,
      top_p: 1,
      logprobs: false,
      top_logprobs: null
    };

    try {
      const response = await axios.post(BASE_URL, data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      const responseMessage = response.data.choices[0].message.content;
      setResponseText(formatResponse(responseMessage));

      setConversationHistory([
        ...newConversationHistory,
        { role: 'assistant', content: responseMessage }
      ]);
    } catch (error) {
      console.error('Error:', error);
    }
  }, [conversationHistory]);

  const handleSend = async () => {
    if (userInput) {
      try {
        const response = await axios.get('/pet_para.json');
        const jsonData = JSON.stringify(response.data);
        await sendMessage(userInput, jsonData);
      } catch (error) {
        console.error('Error loading JSON data:', error);
      }
    } else {
      console.error('Please select a situation');
    }
  };

  const formatResponse = (text) => {
    return text.split('\n').map((str, index) => (
      <p key={index} style={{ marginBottom: '10px' }}>
        {str}
      </p>
    ));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Chat with AI</h1>
        <div className="response-box">
          {responseText}
        </div>
        <select value={userInput} onChange={handleInputChange}>
          <option value="">Select a situation to simulate</option>
          <option value="simulate 1 situation">Simulate 1 Situation</option>
          <option value="simulate 2 situations">Simulate 2 Situations</option>
          <option value="simulate 3 situations">Simulate 3 Situations</option>
        </select>
        <button onClick={handleSend}>Send</button>
      </header>
    </div>
  );
}

export default App;
