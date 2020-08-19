const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');
const { isUuid } = require("uuidv4");

function validadeRepositoryLikes(request, response, next) {
  const { id } = request.params;
  const { likes } = request.body;
  if (!isUuid(id)) {
    return response.status(400).json({ error: 'invalid Repository ID' })
  }
  if (likes) {
    
    return response.status(400).json({
      "likes":0,
      error: 'invalid argument!' });
  }

  return next();
}
const app = express();
app.use(express.json());
app.use(cors());


const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id",validadeRepositoryLikes, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' })
  }
  const repository = {
    id,
    title,
    url,
    techs,
  };
  repositories[repositoryIndex] = repository;
  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' })
  }
  repositories.splice(repositoryIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repository = repositories.find(repository => repository.id === id);
  if (!repository) {
    return response.status(400).send('Repositório não encontrado');
  }
  repository.likes++;
  return response.json(repository);
});

module.exports = app;
