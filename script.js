//pegando a url da API
let url = "https://jsonplaceholder.typicode.com/posts";

let loadingElement = document.querySelector('#loading');
let postsContainer = document.querySelector('#posts-container');

let postPage = document.querySelector('#post');
let postContainer = document.querySelector('#post-container');
let commentsContainer = document.querySelector('#comments-container');

// pegando o id da URl
let urlSearchParams = new URLSearchParams(window.location.search);
let postId = urlSearchParams.get('id');

//pegando dados do form
let commentForm = document.querySelector('#comment-form');
let inputBody = document.querySelector('#email');
let inputEmail = document.querySelector('#body');

//pegando e lendo todos os posts
async function getAllPosts()
{
    let response = await fetch(url);
    let data = await response.json();

    loadingElement.classList.add('hide');
    
    for (posts in data) {
        let div = document.createElement('div');
        let title = document.createElement('h1');
        let body = document.createElement('p');
        let link = document.createElement('a');

        title.innerHTML = data[posts].title;
        body.innerHTML = data[posts].body;
        link.innerHTML = 'Ler';
        link.setAttribute('href', `post.html?id=${data[posts].id}`);

        div.appendChild(title);
        div.appendChild(body);
        div.appendChild(link);

        postsContainer.appendChild(div);
    }
        
}

//inserindo um post na requisição
async function postComment(comment) 
{
    let response = await fetch(`${url}/${postId}/comments`, {
        method: "POST",
        body: comment,
        headers: {
            "Content-type": "application/json",
        },
    });
    
    let data = await response.json();
    
    createComment(data);
}

//função que pega o post de um unico usuario
async function getPost(id)
{
    let [responsePost, responseComment] = await Promise.all([
        fetch(`${url}/${id}`), //url + id do usuario
        fetch(`${url}/${id}/comments`) //url + id do usuario + pagina de comments inseridos
    ]);

    //pegando o post do usuario
    let dataPost = await responsePost.json();

    //pegando os comentarios que existe no post do usuario
    let dataComments =  await responseComment.json();

    loadingElement.classList.add('hide');
    postPage.classList.remove('hide');

    let title = document.createElement('h1');
    let body = document.createElement('p');

    //trazendo o titulo do post do usuario
    title.innerText = dataPost.title;
    //trazendo o conteudo do post do usuario
    body.innerHTML = dataPost.body;

    postContainer.appendChild(title);
    postContainer.appendChild(body);

    //trazendo os resultados dos comentarios inserido no post do usuario
    dataComments.map((comment) => {
        createComment(comment);
    });
}

function createComment(comment)
{
    let div = document.createElement("div");
    let email = document.createElement("h3");
    let commentBody = document.createElement("p");

    email.innerText = comment.email;
    commentBody.innerText = comment.body;

    div.appendChild(email);
    div.appendChild(commentBody);
    commentsContainer.appendChild(div);
}
  
//se existir id na URL, pega individual, caso contrario, traga todos
if (postId) {
    getPost(postId);

    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        let comment = {
            email: inputBody.value,
            body: inputEmail.value,
        }
        comment = JSON.stringify(comment);
        postComment(comment);
    });

} else {
    getAllPosts();
}
