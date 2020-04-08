import React, { useState, useEffect } from "react";

import api from './services/api';

import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([]);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [techs, setTechs] = useState('');

  useEffect(() => {
    async function loadRepositories() {
      const response = await api.get('/repositories');

      setRepositories(response.data);
    }

    loadRepositories();
  }, []);

  async function handleAddRepository(e) {
    e.preventDefault();

    const formattedTechs = techs.split(',').map(tech => tech.trim());

    const response = await api.post('/repositories', {
      url,
      title,
      formattedTechs
    })

    setRepositories(oldState => ([...oldState, response.data]));
  }

  async function handleRemoveRepository(id) {
    await api.delete(`/repositories/${id}`);

    const newRepositories = repositories.filter(repo => repo.id != id);

    setRepositories(newRepositories);
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {repositories.map(repository => (
          <li key={repository.id}>
            {repository.title}
  
            <button onClick={() => handleRemoveRepository(repository.id)}>
              Remover
            </button>
          </li>
        ))}
      </ul>
      
      <form className="form" onSubmit={handleAddRepository}>
        <input
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="URL"
        />
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Título"
        />
        <input
          type="text"
          value={techs}
          onChange={e => setTechs(e.target.value)}
          placeholder="Tecnologias (Separadas por vírgulas)"
        />

        <button type="submit">Adicionar</button>
      </form>
    </div>
  );
}

export default App;
