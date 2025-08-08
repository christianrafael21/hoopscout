# <p align = "center">🏀 ​Hoop Scout 🏀​</p>

##  :clipboard: Description

Api que controla o sistema de avaliação de jogadores de basket, calculando a probabilidade dos mesmos terem chances profissionais com métricas avançadas, assegurando a segurança dos dados criptografada e com arquitetura rigida de camadas, seguindo principios do SOLID e Clean Code.
***

## :computer:	 Tecnolgy and Concepts 

- JWTs
- Bcrypt
- Node.js
- TypeScript

***

## :rocket: Routes

### 👥 Users 

```yml
GET /user/profile (autentify)
    - Route to get personal info
    - headers: { "Authorization": `Bearer ${token}` }
    - body:{}
```
    
```yml 
POST /signup
    - Route to create acount on the plataform
    - headers: {}
    - body: {
        "email": "lorem@domain.com",
        "name": "lorem ipsum",
        "password": "**********"
    }
```

```yml 
POST /login
    - Route to make the login to acess the CRUD
    - headers: {}
    - body: {
        "email": "lorem@domain.com",
        "password": "**********"
    }
```

```yml 
PUT /user/edit (autentify)
    - Route to certify the user is logged to edit and acess sensitive CRUD info 
    - headers: {  "Authorization": `Bearer ${token}` }
    - body: {
        "email": "lorem@domain.com",
        "name": "lorem ipsum",
        "password": "**********"
    }
```

### ​🧑‍🏫​ Coach 

```yml
GET /all/athletes (autentify)
    - Route to get all athletes
    - headers: { "Authorization": `Bearer ${token}` }
    - body:{}
```
    
```yml 
GET /athlete/:id (autentify)
    - Route to acess especific info by athlete
    - headers: { "Authorization": `Bearer ${token}` }
    - params: id: number
    - body:{}
```

```yml 
POST /grade/:id (autentify)
    - Route to send athlete perform
    - headers: {}
    - params: id: number
    - body: {
    	"age": number, 
        "height": "X.XXm",
    	"weight": "XXkg",
    	"freeThrow": "XX%",
    	"longShot": "XX%",
    	"shortShot": "XX%",
    	"assistsGame": number
    }
```

### ​⛹️​​ Athlete 

```yml
GET /model (autentify)
    - Route to get model athlete of his age
    - headers: { "Authorization": `Bearer ${token}` }
    - body:{}
```
    
```yml 
GET /athlete (autentify)
    - Route to acess personal info athlete
    - headers: { "Authorization": `Bearer ${token}` }
    - body:{}
```

```yml 
GET /probability (autentify)
    - Route to get probability to be professional
    - headers: {}
    - params: id: number
    - body: {}
```


## 🏁 Running the application locally

First, make the clone repository in your machine:

```
git clone https://github.com/lucasmartinso/hoop-scout-back.git
```

After, inside the folder, run the comand to install the dependencies.

```
npm install
```
Config the .env, .env.test and .env.development based on .env.example

To finish the process, to init the server
```
npm start or npm run dev
```

:stop_sign: Don't forget to repeat the sequence above with [repository-do-front](https://github.com/brenolino/hoop-scout) that contains the interface of aplication, to test the project per complet.
