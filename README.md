# Park Your Pooch

Built by Carter J. Cobb

## Details

This project uses Node.js, Express.js and MongoDB to build a microserviced api and client. Requirements this project satifies are as follows:

### Business Requirements

Park your Pooch is a system for a dog daycare center where customers can book a pooch parking at the facility (daycare for their dog). Customers will login and reserve rooms for their dogs. Rooms will be reserved for the booked time after successfully paying for the booking. Employees can login to see booking and rooms as well as dogs assigned to those rooms.

The application is targeted towards working professionals or families planning vacation time who need a place to keep their dog while they are away from home. This group of people need the application to quickly and easily plan to take care of their dog while they are away. They would want to use this because they can book rooms in advance and plan for the future through an online interface over calling a daycare center or requiring a loved one to care for the dog during their absence.

### Technical Requirements

- Appropriate service boundaries that encapsulate areas of responsibility and discourage "chatty" service communications.
- At least one instance of every service.
- For at least two services have at least two instances.
- At least two different data storage classifications as backing databases (i.e. not all backing databases can be SQL-based. For clarity: Both MariaDB and SQLServer are SQL-based data stores.
- A service registration/discover service is required and all services must register regardless of communication needs.
- All external request (UI clients) must route through an edge service.
- Each service should have it's own suite of automated test cases that can be run independently in a mock environment.
- Your entire system (databases, services, etc.) must be deployed using a single docker compose file (except your external client/UI).
- The external client/UI must be either a web (SPA) or mobile client.

### Requirements To Start

- Node.js installed [download link](https://nodejs.org/en/download/)
- Docker insalled [download link](https://www.docker.com/products/docker-desktop)
- WSL2 installed (WindowsOS Only) [download link](https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi)

### Recommended But Not Required Items

- MongoDB Compass installed [download link](https://www.mongodb.com/try/download/compass)
- Postman installed [download link](https://www.postman.com/downloads/)
- RedisInsight installed [download link](https://redislabs.com/redis-enterprise/redis-insight/)

## Pre Run

- add a `.env` file in the root directory.
- .env file keys:
  - HOST_PATH=~/path/to/local/directory

### Customer Microservice Requirements

- add a `.env` file in the root of the `customer` directory (`./services/customer/.env`)
- .env file keys:
  - NODE_ENV=development
  - MONGO_URL=mongodb://mongo:27017
  - ACCESS_TOKEN_SECRET=yzQnI8Y2lGxrvNe6TObEt53HDDapxnBTuvts58dL
  - REFRESH_TOKEN_SECRET=FNrNvfYraHCdPWC2qV2dfbgXoD3d1rKxeZ8VjSiA

### Employee Microservice Requirements

- add a `.env` file in the root of the `employee` directory (`./services/employee/.env`)
- .env file keys:
  - NODE_ENV=development
  - MONGO_URL=mongodb://mongo:27017
  - ACCESS_TOKEN_SECRET=yzQnI8Y2lGxrvNe6TObEt53HDDapxnBTuvts58dL
  - REFRESH_TOKEN_SECRET=FNrNvfYraHCdPWC2qV2dfbgXoD3d1rKxeZ8VjSiA

### Gateway Microservice Requirements

- add a `.env` file in the root of the `gateway` directory (`./services/gateway/.env`)
- .env file keys:
  - NODE_ENV=development

### Order Microservice Requirements

- add a `.env` file in the root of the `order` directory (`./services/order/.env`)
- .env file keys:
  - NODE_ENV=development
  - MONGO_URL=mongodb://mongo:27017

### Pooch Microservice Requirements

- add a `.env` file in the root of the `pooch` directory (`./services/pooch/.env`)
- .env file keys:
  - NODE_ENV=development
  - MONGO_URL=mongodb://mongo:27017

### Room Microservice Requirements

- add a `.env` file in the root of the `room` directory (`./services/room/.env`)
- .env file keys:
  - NODE_ENV=development
  - MONGO_URL=mongodb://mongo:27017

## Run

- Simply run `docker-compose up -d --build` in the terminal on the root directory

### Accessible localhost Items

- Front end will be accessible at <http://localhost:7777>
- Eureka Web Client will be accessible at <http://localhost:8080>
- Containerized MongoDB data store will be accessible at <http://localhost:8989>
- Containerized Redis data store will be accessible at <http://localhost:6379>

## Test

- Each service has independent unit tests. While inside the root directory of a service run `npm test`.

## Additional Details

This was built as an assignment for a college class at Neumont College of Computer Science. Please do not use any part of this project in any way that would be considered plagiarism.
