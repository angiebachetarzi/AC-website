# The Islander's guide

[![pipeline status](https://gitlab.ensimag.fr/ribauts/app_web/badges/master/pipeline.svg)](https://gitlab.ensimag.fr/ribauts/app_web/commits/master)
[![coverage report](https://gitlab.ensimag.fr/ribauts/app_web/badges/master/coverage.svg)](https://gitlab.ensimag.fr/ribauts/app_web/commits/master)


## Installation

### NodeJS & NPM

https://nodejs.org/fr/download/

To check that you have the latest version of Node and Npm, please run the following command
``` bash
node -v
npm -v
```

### Project

``` bash
git clone https://gitlab.ensimag.fr/ribauts/app_web.git
cd ./app_web/tig_client
npm install
cd ..
npm install
```

## Run project

### Backend tests

``` bash
npm run test
```

### Frontend tests

``` bash
npm install Cypress
npm run cy-test
```

### Start server & client

``` bash
npm run start-client
```

A Chrome window will open automatically on localhost:8080

## Ensiwiki

For more details about the project, please visit this link

https://ensiwiki.ensimag.fr/index.php?title=CAW1_2020_Projet_de_Simon_RIBAUT,_Angie_BACHETARZI
