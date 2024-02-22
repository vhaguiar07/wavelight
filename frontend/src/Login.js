import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/login', {
        email,
        password,
      });
      localStorage.setItem('token', res.data.token);
      // Redirecione ou atualize a página após o login bem-sucedido
      window.location.reload();
    } catch (err) {
      console.error(err.response.data.msg);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={(e) => onSubmit(e)}>
        <input
          type='email'
          placeholder='Email'
          name='email'
          value={email}
          onChange={(e) => onChange(e)}
          required
        />
        <input
          type='password'
          placeholder='Senha'
          name='password'
          value={password}
          onChange={(e) => onChange(e)}
          minLength='6'
        />
        <button type='submit'>Login</button>
      </form>
    </div>
  );
};

export default Login;