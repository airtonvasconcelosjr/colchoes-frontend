const API_URL = "http://localhost:8080/login";

export const login = async (email, password) => {

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password
            }),
        });

        const responseText = await response.text();

        if (response.ok) {
            try {
                const data = JSON.parse(responseText);
                return { token: data.token || data };
            } catch (e) {
                return { token: responseText };
            }
        } else {
            throw new Error(responseText || 'Credenciais inválidas');
        }
    } catch (error) {
        throw error;
    }
};