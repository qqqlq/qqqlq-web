import { useEffect, useState, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../../../lib/firebase';
import { Center, Spinner } from '@chakra-ui/react';

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return <Center h="50vh"><Spinner size="xl" /></Center>;
    }

    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
