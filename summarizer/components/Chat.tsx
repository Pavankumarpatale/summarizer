import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import { ChatLine, LoadingChatLine } from './ChatLine';
import styles from '../styles/styles.module.css';

type ChatAgent = 'user' | 'system' | 'assistant';

export interface Message {
  role: ChatAgent;
  content: string;
}

export const initialMessages: Message[] = [
  {
    role: 'assistant',
    content: 'Hi! I am a friendly AI assistant. Ask me anything! I can summarize your text and answer questions.',
  },
];

const InputMessage: React.FC<{ input: string; setInput: React.Dispatch<React.SetStateAction<string>>; sendMessage: (message: string) => void }> = ({ input, setInput, sendMessage }) => {
  const [lengthPenalty, setLengthPenalty] = useState(0.8);
  const [maxLength, setMaxLength] = useState(128);

  return (
    <div className={styles['input-container']}>
      <div className={styles['input-fields']}>
        <label htmlFor="lengthPenaltyInput">Length Penalty:</label>
        <input
          id="lengthPenaltyInput"
          type="number"
          step="0.1"
          min="0"
          value={lengthPenalty}
          onChange={(e) => setLengthPenalty(Number(e.target.value))}
          className={styles['input-field']}
        />
        <label htmlFor="maxLengthInput">Max Length:</label>
        <input
          id="maxLengthInput"
          type="number"
          min="1"
          max="512"
          value={maxLength}
          onChange={(e) => setMaxLength(Number(e.target.value))}
          className={styles['input-field']}
        />
      </div>
      <div className={styles['input-button']}>
        <input
          type="text"
          aria-label="chat input"
          required
          className={styles['input-field']}
          value={input}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendMessage(input);
              setInput('');
            }
          }}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
        <Button
          type="submit"
          className={styles['say-button']}
          onClick={() => {
            sendMessage(input);
            setInput('');
          }}
        >
          Say
        </Button>
      </div>
    </div>
  );
};

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const sendMessage = async (message: string) => {
    setLoading(true);
    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: message },
    ];
    setMessages(newMessages);
    const last100messages = newMessages.slice(-100); // remember last 100 messages

    try {
      const response = await fetch('https://summarize//post request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: message,
          config: {
            length_penalty: 0.8,
            num_beams: 8,
            max_length: 128,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();

      setMessages([
        ...newMessages,
        { role: 'assistant', content: data.summary },
      ]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles['chat-container']}>
      {messages.map(({ content, role }, index) => (
        <ChatLine key={index} role={role} content={content} />
      ))}

      {loading && <LoadingChatLine />}

      {messages.length < 2 && (
        <span className={styles['initial-message']}>
          Type a message to start the conversation
        </span>
      )}
      <InputMessage
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
      />
    </div>
  );
};
