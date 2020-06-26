const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

/** Misão: Conectar via api ao repositório do git */
const repositories = [];

/** Validação de Id de repositório existente */
function validateRepositoryId(request, response, next){
  const {id} = request.params;
  if(!isUuid(id)){
    return response.status('400').json({erro: 'Repository not found'}); 
  }
  return next();
}

/** Criando um novo repositório */
app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  const repository = { 
     id: uuid(),
     title,
     url,
     techs,
     likes: 0,
   }

  repositories.push(repository);
  return response.status('200').json(repository);

});

/** LIstar todos os repositorios */
app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.delete("/repositories/:id", validateRepositoryId, (request, response) => {
  const {id} = request.params;
  
  /** Id da posição ou -1 (caso não exista) */
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  /** Deletando posição do array */
  repositories.splice(repositoryIndex,1);
  return response.status('204').send();

});

/** Update de repositorio */
app.put("/repositories/:id", validateRepositoryId, (request, response) => {
  const {id} = request.params;
  const { title, url, techs} = request.body;
  /** Id da posição ou -1 (caso não exista) */
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  /** Objeto atualizado */
  const repository = {
    id,
    url,
    title,
    techs,
    likes: repositories[repositoryIndex].likes, 
  };
  /** Atualizando o array repositories */
  repositories[repositoryIndex] = repository;
  return response.json(repository);
});

/** Rota de likes: A cada chamada dessa rota o número de likes deve ser icrementado em 1 */
app.post("/repositories/:id/like", validateRepositoryId, (request, response) => {
  const {id} = request.params;
  
  /** Id da posição ou -1 (caso não exista) */
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  const { title, url, techs, likes } = repositories[repositoryIndex];

  const incrementLikes = (likes+1);

  const repository = { 
    id, 
    title, 
    url, 
    techs,
    likes: incrementLikes
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);

});

module.exports = app;
