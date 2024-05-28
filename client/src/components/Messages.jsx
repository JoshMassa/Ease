import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import '../styles/Messages.css';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const socket = useSocket();
  const messagesEndRef = useRef(null);

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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = () => {
    if (socket && input) {
      socket.emit('chat message', input, new Date().toISOString(), () => {
        setInput('');
      });
    }
  };

  return (
    <div id='messagesContainer'>
      <ul id="messages">
        {messages.map((message) => (
          <li key={message.id}>{message.content}</li>
        ))}
        <div ref={messagesEndRef} />
      </ul>
      <form id="form" onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
        <input
          id="input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Messages;
