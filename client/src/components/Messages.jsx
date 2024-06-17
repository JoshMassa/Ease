import React, { useState, useEffect, useRef, useContext } from 'react';
import { useSocket } from '../context/SocketContext';
import '../styles/Messages.css';
import { CurrentUserContext } from '../context/CurrentUserContext';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const socket = useSocket();
  const messagesEndRef = useRef(null);
  const { currentUser } = useContext(CurrentUserContext);
  const location = useLocation();
  const emojiPickerRef = useRef(null);
  const inputRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('https://chat-test-bquw.onrender.com/messages' || 'http://localhost:3000/messages'); // Switch the order of these for production
      if (Array.isArray(response.data)) {
        setMessages(response.data);
        scrollToBottom();
      } else {
        console.error('Fetched data is not an array:', response.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [location]);

  useEffect(() => {
    if (socket) {
      return () => {
        socket.off('chat message');
        socket.off('connect');
        socket.off('disconnect');
      };
    }
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!showEmojiPicker && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showEmojiPicker]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = () => {
    if (socket && socket.connected && input && currentUser) {
      const message = {
        content: input,
        client_offset: new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
        user: { 
          _id: currentUser._id, 
          username: currentUser.username, 
          profilePicture: currentUser.profilePicture,
        },
      };
      console.log('Sending message:', message);
      console.log('currentUser:', currentUser);

      setMessages((prevMessages) => [...prevMessages, message]);

      socket.emit('chat message', message, () => {
          console.log('Message sent successfully');
          setInput(''); // clear the input field
        });
      }
  };

  const addEmoji = (emoji) => {
    setInput(input + emoji.native);
    setShowEmojiPicker(false); // close the picker after selecting an emoji
  };
  return (
    <div id='messagesContainer'>
      <ul id="messages">
        {Array.isArray(messages) ? (
          messages.map((message) => (
            <li key={message.messageId || message._id} className="message-item">
              <Avatar 
                size="large" 
                src={message.user?.profilePicture} 
                icon={!message.user?.profilePicture && <UserOutlined />} 
                className="message-avatar"
              />
              <div className="message-content">
                <div><strong>{message.user ? message.user.username : 'User'}</strong> <span style={{fontSize: '14px'}}>- {message.client_offset}</span></div>
                <div className="message-text">{message.content}</div>
              </div>
            </li>
          ))
        ) : (
          <li>Loading messages...</li>
        )}
        <div ref={messagesEndRef} />
      </ul>
      <form id="form" onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
        <input
          id="input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          ref={inputRef}
          autoComplete='off'
        />
        <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>😊</button>
        {showEmojiPicker && (
          <div className="emoji-picker" ref={emojiPickerRef}>
            <Picker data={data} onEmojiSelect={addEmoji} />
          </div>
        )}
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Messages;
