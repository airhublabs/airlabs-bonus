<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://airhubaviation.com/">
    <img src="https://airhubaviation.com/wp-content/uploads/2021/10/logo.svg" alt="Logo" width="400" height="80">
  </a>

  <h3 align="center">Airlabs Security Bonus Calculator</h3>

  <p align="center">
    Trial project to calculate flight & cabin crew bonuses for flying over dangerous zones. 
    <br />
        <a href="https://newage.dev"><strong>View Live»</strong></a>
    <br />
    <br />
        <a href="https://api.newage.dev/docs">API Docs</a>
    ·
    <a href="https://api.newage.dev">API Link</a>

  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#project-highlights">Project Highlights</a>
    </li>
    <li>
      <a href="#installation">Installation</a>
    </li>
</li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## Project Highlights

#### Main features:
* Airlabs SDK - Fully typed data access libraryto interact with the backend. 
* Monorepo
* Automatic code generation
* API Versioning
* Dockerized & deployed to AWS ECR, running containers on AWS ECS.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Built With

#### 📌 Backend 
* NestJS & Express
* Swagger
* Prisma
* Nrwl NX

#### 📌 Frontend
* React / NextJS
* MUI
* Styled JSX
* React Query
* react-form-hook & zod for validation

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

Application is split by two main apps `backoffice` & `api`. Backoffice is the frontend layer for accessing the API.  

### Installation

1. Install NPM packages
   ```sh
   npm install
   ```
2. Set `DATABSE_URL` in .env 
   ```sh
   DATABASE_URL="postgresql://postgres:password@localhost:5432"
   ```
2. Prisma migrate 
   ```sh
   npx prisma migrate dev
   ```
3. Prisma generate
   ```sh
   npx prisma generate
   ```
4. Serve the applications
   ```sh
   nx serve api
   ```
      ```sh
   nx serve backoffice
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTACT -->
## Contact

Adam Ghowiba  - adam@webrevived.com

<p align="right">(<a href="#readme-top">back to top</a>)</p>
