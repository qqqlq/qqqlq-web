import { useState } from 'react';
import { Box, Button, Input, VStack, Heading, Text } from '@chakra-ui/react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../lib/firebase';
import { useNavigate } from 'react-router-dom';
import SEO from '../../SEO';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/admin');
        } catch (err) {
            setError('Login failed. Check your credentials.');
            console.error(err);
        }
    };

    return (
        <>
        <SEO title="Admin Login" description="" path="/admin/login" noindex={true} />
        <Box maxW="md" mx="auto" mt={20} p={6} borderWidth={1} borderRadius="lg" boxShadow="lg">
            <VStack as="form" onSubmit={handleLogin} gap={4}>
                <Heading size="lg">Admin Login</Heading>
                {/* @ts-ignore */}
                {error && <Text color="red.500">{error}</Text>}
                <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <Button type="submit" colorPalette="blue" width="100%">Login</Button>
            </VStack>
        </Box>
        </>
    );
};

export default Login;
