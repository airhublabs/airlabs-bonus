
<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="https://airhubaviation.com/wp-content/uploads/2021/10/logo.svg" alt="Logo" width="400" height="80">
  </a>

  <h3 align="center">Airlabs Security Bonus Calculator</h3>

  <p align="center">
    Trial project to calculate flight & cabin crew bonuses for flying over dangerous zones. 
    <br />
        <a href="https://github.com/othneildrew/Best-README-Template"><strong>View Live»</strong></a>
    <br />
    <br />
        <a href="api.newage.dev/docs">API Docs</a>
    ·
    <a href="api.newage.dev">API Link</a>

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


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[product-screenshot]: images/screenshot.png
