import { createContext } from 'react';
import { AuthContextType } from '@/lib/auth';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

