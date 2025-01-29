import { useState, useEffect } from 'react';

const useCookie = (name) => {
    const [cookieValue, setCookieValue] = useState(null);

    useEffect(() => {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + '=')) {
                setCookieValue(cookie.substring((name + '=').length));
                return;
            }
        }
        setCookieValue(null);
    }, [name]);  // React will run this effect when the 'name' prop changes

    return cookieValue;
};

export default useCookie;
