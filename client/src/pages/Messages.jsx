import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on('chat message', (msg, messageId) => {
        setMessages((prevMessages) => [...prevMessages, { id: messageId, content: msg }]);
      });

      socket.on('connect', () => {
        console.log('Connected to Socket.IO server');
      });

      return () => {
        socket.off('chat message');
        socket.off('connect');
      };
    }
  }, [socket]);

  const sendMessage = () => {
    if (socket && input) {
      socket.emit('chat message', input, new Date().toISOString(), () => {
        setInput('');
      });
    }
  };

  return (
    <div>
      <h1>Messages</h1>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>{message.content}</li>
        ))}
      </ul>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Messages;
