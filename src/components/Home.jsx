import React, { useState, useEffect } from "react";
import axios from "../utils/axios";

const Home = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Перевірка, чи увійшов користувач в аккаунт
    // Тут можна використовувати токен або іншу перевірку аутентифікації
    const checkAuth = async () => {
      try {
        // Приклад перевірки аутентифікації
        const response = await axios.get("/check-auth"); // Додайте відповідний маршрут на сервері
        if (response.status === 200) {
          setLoggedIn(true);
        }
      } catch (error) {
        setLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <div>
      <h1>Welcome to the {loggedIn ? "Logged In" : "Guest"} Home Page</h1>
    </div>
  );
};

export default Home;
