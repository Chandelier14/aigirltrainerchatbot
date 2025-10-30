'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  VStack,
  Button,
  Heading,
  Text,
  useToast,
  Input,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { useAuth } from '@/context/AuthContext';

export default function BillingPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const { setPremiumStatus } = useAuth();

  const handleActivate = async () => {
    setIsProcessing(true);

    // Simulate a brief "processing" delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Automatically approve
    setPremiumStatus(true);
    toast({
      title: 'Access Granted',
      description: 'Welcome to the premium chat experience!',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    
    router.push('/chat');
  };

  return (
    <Container maxW="container.sm" centerContent>
      <Box p={8} mt={20} borderWidth={1} borderRadius="lg" width="100%">
        <VStack spacing={6}>
          <Heading>Premium Access</Heading>
          <Text fontSize="xl" fontWeight="bold">$500 USD</Text>
          <Text textAlign="center">
            Get unlimited access to our AI chat service
          </Text>

          <Button
            onClick={handleActivate}
            colorScheme="blue"
            size="lg"
            width="100%"
            isLoading={isProcessing}
            loadingText="Processing Payment"
          >
            Activate Premium Access
          </Button>

          <VStack spacing={2} mt={4}>
            <Text fontWeight="bold">Premium Features:</Text>
            <Text>✓ Unlimited AI Chat Access</Text>
            <Text>✓ Advanced Training Capabilities</Text>
            <Text>✓ Priority Support</Text>
            <Text>✓ Exclusive Content</Text>
          </VStack>
        </VStack>
      </Box>
    </Container>
  );
}