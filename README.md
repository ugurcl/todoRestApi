# 📋 Todo App Backend

---

## About the Project

This project is a **Todo List Backend API** built with Node.js, Express, and MongoDB.

Features:

* User registration and login (JWT-based authentication)
* Todo CRUD operations (Create, Read, Update, Delete)
* Detailed data validation with Zod
* **Rate limiting** with Express-rate-limit and Redis
* Pagination and filtering
* Token verification middleware
* TypeScript for type safety

---

## Technologies

* Node.js
* Express
* MongoDB (Mongoose)
* Redis (for Rate limiter)
* TypeScript
* Zod (Validation)
* bcrypt (Password hashing)
* JSON Web Token (JWT)
* express-rate-limit + rate-limit-redis

---

## Setup

### Prerequisites

* Node.js >=16
* MongoDB (local or Atlas)
* Redis (WSL, Docker, or Windows Memurai)

### Steps

1.  Clone the repository

    ```bash
    git clone https://github.com/ugurcl/todoRestApi.git
    cd todoRestApi
    ```

2.  Install dependencies

    ```bash
    npm install
    ```

3.  Create a `.env` file and add the following variables

    ```
    PORT=3000
    MONGO_URI=mongodb://localhost:27017/todoRestApi
    JWT_SECRET=supersecretkey

    ```

4.  Run the project

    ```bash
    npm run dev
    ```

---

## API Endpoints

### Auth

| Method | Endpoint      | Description       |
| :----- | :------------ | :---------------- |
| POST   | `/register`   | User registration |
| POST   | `/login`      | User login        |

### Todo

| Method | Endpoint    | Description          |
| :----- | :---------- | :------------------- |
| POST   | `/todos`    | Create a new todo    |
| GET    | `/todos`    | Get user's todos     |
| GET    | `/todo/:id`| Get single todo details|
| PATCH  | `/todo/:id`| Update a todo        |
| DELETE | `/todo/:id`| Delete a todo        |

---

## Features

* **JWT Authentication**: Token-based security for user authentication
* **Password Hashing**: Passwords are securely stored with bcrypt
* **Validation**: Input and update data are validated with Zod
* **Rate Limiting**: IP-based request limiting, managed via Redis
* **Pagination**: Todos can be retrieved in a paginated manner
* **TypeScript**: Type safety and fewer errors in code



---

## How to Contribute?

1.  Fork the repository
2.  Develop on your own branch
3.  Submit a pull request




## License

MIT License

---

## Contact

For any questions, suggestions, and feedback:

* **Email:** infougurcalskan@gmail.com
* **LinkedIn:** [www.linkedin.com/in/uğur-çalışkan-b39608267](www.linkedin.com/in/uğur-çalışkan-b39608267)