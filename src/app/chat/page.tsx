'use client';

import { Box, Container, Flex, Text, Input, Button, VStack, HStack, Image } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { collection, addDoc, orderBy, query, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isPremium, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isPremium) {
      router.push('/billing');
      return;
    }

    const q = query(collection(db, 'messages'), orderBy('timestamp'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages: Message[] = [];
      snapshot.forEach((doc) => {
        newMessages.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [isPremium, router]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    
    await addDoc(collection(db, 'messages'), {
      text: input,
      sender: 'user',
      timestamp: Date.now(),
    });

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: input }],
        }),
      });

      const data = await response.json();
      
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

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <Container maxW="container.xl" p={4}>
      <Flex justifyContent="flex-end" mb={4}>
        <Button onClick={handleLogout} colorScheme="red" size="sm">
          Logout
        </Button>
      </Flex>
      <Flex gap={6} h="calc(100vh - 6rem)">
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