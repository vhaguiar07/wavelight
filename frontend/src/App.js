import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Login = () => {
  const [loginFormData, setLoginFormData] = useState({
    email: '',
    password: '',
  });

  const [videoFormData, setVideoFormData] = useState({
    title: '',
    description: '',
    videoFile: null,
  });

  const [mode, setMode] = useState('login');
  const [registered, setRegistered] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [userGifs, setUserGifs] = useState([]);

  const { email, password } = loginFormData;
  const { title, description, videoFile } = videoFormData;

  const handleLoginChange = (e) =>
    setLoginFormData({ ...loginFormData, [e.target.name]: e.target.value });

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setVideoFormData({ ...videoFormData, videoFile: file });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (mode === 'login') {
        res = await axios.post('http://localhost:3000/api/login', {
          email,
          password,
        });
        const authToken = res.data.token;
        localStorage.setItem('token', authToken);
        setToken(authToken);
        setRegistered(true);
      } else {
          const emailCheckRes = await axios.post(
            'http://localhost:3000/api/check-email',
            {
              email,
            }
          );
          if (emailCheckRes.status === 200) {
            res = await axios.post('http://localhost:3000/api/user/register', {
              email,
              password,
            });
            res = await axios.post('http://localhost:3000/api/login', {
              email,
              password,
            });
          }

        const authToken = res.data.token;
        localStorage.setItem('token', authToken);
        setToken(authToken);
        setRegistered(true);
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 409) {
        alert('O email já está sendo utilizado.');
      } else if (err.response && err.response.status === 401) {
        alert('Email ou senha incorretos.');
      } else {
        alert('Ocorreu um erro ao processar a solicitação.');
      }
    }
  };

  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('video', videoFile);

      await axios.post('http://localhost:3000/videos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setVideoUploaded(true);
      setVideoFormData({ title: '', description: '', videoFile: null });

      alert('Vídeo convertido com sucesso!');

    } catch (error) {
      console.error(token, error);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'cadastro' : 'login');
    setLoginFormData({ email: '', password: '' });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setRegistered(false);
  };

  useEffect(() => {
    const fetchUserGifs = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/gifs', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserGifs(response.data.gifs);
      } catch (error) {
        console.error('Erro ao buscar os GIFs do usuário:', error);
      }
    };

    if (registered) {
      fetchUserGifs();
    }
  }, [registered, token, videoUploaded]); // Adicionando videoUploaded aqui para monitorar as mudanças

  return (
    <div>
      {registered ? (
        <div>
          <h1 style={{ textAlign: 'center' }}>Aplicação de Conversão de vídeos para gif</h1>
          <div style={{ margin: 'auto', width: '50%' }}>
            <h2 style={{ textAlign: 'center' }} >Preencha abaixo as informações do gif</h2>
              <form style={{ textAlign: 'center', display: 'block', margin: 'auto', maxWidth: '300px' }} onSubmit={handleVideoSubmit}>
                <input style={{ display: 'block', marginBottom: '10px', width: '100%' }}
                  type="text"
                  placeholder="Título do Gif"
                  name="title"
                  value={title}
                  onChange={(e) => setVideoFormData({ ...videoFormData, title: e.target.value })}
                  required
                />
                <textarea style={{ display: 'block', marginBottom: '10px', width: '100%' }}
                  placeholder="Descrição do Gif"
                  name="description"
                  value={description}
                  onChange={(e) => setVideoFormData({ ...videoFormData, description: e.target.value })}
                />
                <input style={{ display: 'block', marginBottom: '10px', width: '100%' }}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  required
                />
                <button style={{ display: 'block', cursor: 'pointer', width: '100%' }} type="submit">
                  Converter
                </button>
              </form>
          </div>
          <div>
            <h2 style={{ textAlign: 'center' }} >GIFs Convertidos</h2>
              {userGifs.map((gif, index) => (
                <li style={{ textAlign: 'center' }} key={index}>
                  <a href={`http://localhost:3000/gifs/${gif}.gif`} target="_blank" rel="noopener noreferrer">{gif}</a>
                </li>
              ))}
          </div>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <button style={{ marginTop: '300px', cursor: 'pointer' }}onClick={handleLogout}>Sair</button>
          </div>
        </div>
      ) : (
        <div>
          <h1 style={{ textAlign: 'center' }}>{mode === 'login' ? 'Login' : 'Cadastro'}</h1>
            <form style={{ textAlign: 'center', display: 'block', margin: 'auto', maxWidth: '300px' }} onSubmit={handleLoginSubmit}>
              <input style={{ display: 'block', marginBottom: '10px', width: '100%' }}
                type="email"
                placeholder="Email"
                name="email"
                value={email}
                onChange={handleLoginChange}
                required
              />
              <input style={{ display: 'block', marginBottom: '10px', width: '100%' }}
                type="password"
                placeholder="Senha"
                name="password"
                value={password}
                onChange={handleLoginChange}
                minLength="6"
              />
              <button style={{ display: 'block', cursor: 'pointer', width: '100%' }} type="submit">
                {mode === 'login' ? 'Login' : 'Cadastrar'}
              </button>
            </form>
          <p style={{ textAlign: 'center', cursor: 'pointer', color: '#1c1ca6', textDecoration: 'underline' }} onClick={toggleMode}>
            {mode === 'login'
              ? 'Ainda não tem uma conta? Clique aqui para se cadastrar.'
              : 'Já tem uma conta? Clique aqui para fazer login.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Login;
