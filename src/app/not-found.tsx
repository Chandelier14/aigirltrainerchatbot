'use client';

import { Box, Button, Container, Heading, Text, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <Container maxW="container.sm" centerContent>
      <Box p={8} mt={20} textAlign="center">
        <VStack spacing={6}>
          <Heading>Page Not Found</Heading>
          <Text>Sorry, the page you're looking for doesn't exist.</Text>
          <Button 
            colorScheme="blue" 
            onClick={() => router.push('/login')}
          >
            Go to Login
          </Button>
        </VStack>
      </Box>
    </Container>
  );
}