import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [recordOpened, setRecordOpened] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to the bottom of the chat container when a new message is added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // This useEffect will be triggered whenever `messages` state changes
  useEffect(() => {
    scrollToBottom(); // Scroll to bottom whenever messages are updated
  }, [messages]);

  useEffect(() => {
    // Listen for the "recordOpened" message from LWC
    const messageListener = (event) => {
      console.log('React: Received message from Aura/LWC:', event.data);

      if (event.data.type === 'recordOpened') {
        const recordId = event.data.recordId;
        setRecordOpened(true); // Update React state when record is opened
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'copilot', text: `Successfully opened record: ${recordId}` },
        ]);
        console.log(`React: Record with ID ${recordId} has been opened.`);
      }
    };

    // Add event listener for messages
    window.addEventListener('message', messageListener);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('message', messageListener);
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    handleCopilotResponse(input);
    setInput('');
  };

  const handleCopilotResponse = (input) => {
    console.log(`React: Handling message "${input}"`);

    const responses = [];
    const recordIdMatch = input.match(/([a-zA-Z0-9]{15,18})/);

    if (input.toLowerCase().startsWith('weather')) {
      const city = input.slice(8).trim();
      if (city) {
        // Fetch weather data from a free weather API (No key required)
        fetch(`https://wttr.in/${city}?format=%C+%t`)
          .then((res) => res.text())
          .then((data) => {
            responses.push({
              sender: 'copilot',
              text: `🌤️ Weather in ${city}: ${data}`,
            });
            setMessages((prev) => [...prev, ...responses]);
          })
          .catch((error) => {
            console.error('Weather API error:', error);
            responses.push({
              sender: 'copilot',
              text: `🌧️ Sorry, I couldn't retrieve the weather for ${city}. Please try again later.`,
            });
            setMessages((prev) => [...prev, ...responses]);
          });
      }
    } else if (input.toLowerCase().startsWith('joke')) {
      // Fetch multiple jokes from JokeAPI (No key required)
      fetch('https://v2.jokeapi.dev/joke/Any?type=twopart&lang=en&amount=3')
        .then((res) => res.json())
        .then((data) => {
          if (data && data.jokes) {
            // Loop through the jokes and display them as separate responses
            data.jokes.forEach((joke, index) => {
              const jokeText = `${joke.setup} - ${joke.delivery}`;
              responses.push({
                sender: 'copilot',
                text: `😂 Joke ${index + 1}: ${jokeText}`,
              });
            });
          } else {
            responses.push({
              sender: 'copilot',
              text: '😂 Sorry, I couldn\'t fetch multiple jokes right now. Please try again later.',
            });
          }
          setMessages((prev) => [...prev, ...responses]);
        })
        .catch((error) => {
          console.error('Joke API error:', error);
          responses.push({
            sender: 'copilot',
            text: `😂 Sorry, I couldn't fetch jokes right now. Please try again later.`,
          });
          setMessages((prev) => [...prev, ...responses]);
        });
    } else if (input.startsWith('/')) {
      if (input === '/help') {
        responses.push({
          sender: 'copilot',
          text: 'Try: /info, /plugin weather, or enter a Salesforce Record ID.',
        });
      } else if (input === '/info') {
        responses.push({
          sender: 'copilot',
          text: '🤖 I am your Salesforce Copilot Assistant.',
        });
      } else if (input.startsWith('/plugin weather')) {
        responses.push({
          sender: 'copilot',
          text: '🌤️ Today\'s weather: Code storms and sunny deployments!',
        });
      } else {
        responses.push({
          sender: 'copilot',
          text: '❓ Unknown command. Try /help.',
        });
      }
    } else if (recordIdMatch) {
      const recordId = recordIdMatch[1];
      responses.push({
        sender: 'copilot',
        text: '🔍 Found a Salesforce Record ID. Click below to open it:',
        recordId,
      });
      console.log(`React: Found Salesforce Record ID: ${recordId}`);
    } else if (/hi|hello|hey/i.test(input)) {
      responses.push({
        sender: 'copilot',
        text: '👋 Hello! How can I assist you today?',
      });
    } else {
      responses.push({
        sender: 'copilot',
        text: `🤖 You said: "${input}". Need help? Try /help.`,
      });
    }

    setMessages((prev) => [...prev, ...responses]);
  };

  const handleOpenRecord = (recordId) => {
    console.log(`React: Sending open record request for ID: ${recordId}`);
    // Send message to parent Salesforce app (Aura/LWC)
    window.parent.postMessage(
      {
        type: 'openRecord',
        recordId: recordId,
      },
      '*'
    );
  };

  return (
    <div className="chat-container">
      <div className="chat-header">Copilot Assistant</div>

      <div className="chat-body">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.sender}`}>
            {msg.text && <div>{msg.text}</div>}
            {msg.recordId && (
              <button onClick={() => handleOpenRecord(msg.recordId)}>
                Open Record
              </button>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          placeholder="Type a message or record ID..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default App;
