import { Box, Container, Flex, Text, Input, Button, VStack, HStack, Image } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { collection, addDoc, orderBy, query, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const OPENROUTER_API_KEY = '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';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('timestamp'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages: Message[] = [];
      snapshot.forEach((doc) => {
        newMessages.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    
    // Add user message to Firebase
    await addDoc(collection(db, 'messages'), {
      text: input,
      sender: 'user',
      timestamp: Date.now(),
    });

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-oss-20b',
          messages: [{ role: 'user', content: input }],
        }),
      });

      const data = await response.json();
      
      // Add AI response to Firebase
      await addDoc(collection(db, 'messages'), {
        text: data.choices[0].message.content,
        sender: 'ai',
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Error:', error);
    }

    setInput('');
    setIsLoading(false);
  };

  return (
    <Container maxW="container.xl" p={4}>
      <Flex gap={6} h="calc(100vh - 2rem)">
        {/* Left side - Image and Live Webcam text */}
        <Box w="300px">
          <Text fontSize="xl" fontWeight="bold" mb={4}>Live Webcam</Text>
          <Image
            src="/how-to-draw-girl.webp"
            alt="How to draw girl"
            objectFit="cover"
            w="100%"
            borderRadius="md"
          />
        </Box>

        {/* Right side - Chat interface */}
        <Flex flex={1} direction="column" borderRadius="lg" borderWidth={1} p={4}>
          <VStack flex={1} overflowY="auto" spacing={4} mb={4}>
            {messages.map((message) => (
              <Box
                key={message.id}
                alignSelf={message.sender === 'user' ? 'flex-end' : 'flex-start'}
                bg={message.sender === 'user' ? 'blue.500' : 'gray.100'}
                color={message.sender === 'user' ? 'white' : 'black'}
                p={3}
                borderRadius="lg"
                maxW="70%"
              >
                {message.text}
              </Box>
            ))}
          </VStack>
          
          <form onSubmit={sendMessage}>
            <HStack>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
              />
              <Button
                type="submit"
                colorScheme="blue"
                isLoading={isLoading}
              >
                Send
              </Button>
            </HStack>
          </form>
        </Flex>
      </Flex>
    </Container>
  );
}