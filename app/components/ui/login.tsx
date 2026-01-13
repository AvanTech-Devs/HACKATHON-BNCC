import React, { useState } from 'react';
import { useRouter } from 'next/router';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Aqui você pode adicionar a lógica de autenticação
        if (username && password) {
            // Simulando login bem-sucedido
            router.push('/dashboard');
        } else {
            alert('Por favor, preencha todos os campos.');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
            <h1>Bem-vindo ao Cultura Digital</h1>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
                <label htmlFor="username">Usuário</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Digite seu usuário"
                    style={{ marginBottom: '10px', padding: '8px' }}
                />
                <label htmlFor="password">Senha</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                    style={{ marginBottom: '10px', padding: '8px' }}
                />
                <button type="submit" style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Entrar
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
