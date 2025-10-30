'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  VStack,
  Input,
  Button,
  Heading,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const toast = useToast();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (login(username, password)) {
      router.push('/billing');
    } else {
      toast({
        title: 'Error',
        description: 'Invalid username or password',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.sm" centerContent>
      <Box p={8} mt={20} borderWidth={1} borderRadius="lg" width="100%">
        <VStack spacing={6}>
          <Heading>Login</Heading>
          <Text>Please log in to access the chat</Text>
          
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack spacing={4}>
              <Input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" colorScheme="blue" width="100%">
                Login
              </Button>
            </VStack>
          </form>
          
          <Text fontSize="sm" color="gray.500">
            Username: chan | Password: password
          </Text>
        </VStack>
      </Box>
    </Container>
  );
}