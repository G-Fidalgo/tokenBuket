# Token Bucket Sample project

In this small project you will find implementation of Token Bucket algorithim

## API endpoints rate limits

On this project you will find one main route `/take` where given some required parameters it will return the reamining tokens for a give caller on specific route request

`/take`

```
method: Get
route: /take
query: {
    callerId: {
        type: string,
        required: true,
        description: "This is the id wich identifies requestor and whom tokens will be taken"
    },
    method: {
        type: string,
        required: true,
        description: "This is the method of the requested route you want to check",
        enum: [GET, POST, PATCH, PUT]
    },
    route: {
        type: string,
        required: true,
        description: "This is the route you would like to take a token from",
        example: "/user/:id"
    }
}
```

responses:

```
200: {
    "message": "OK",
    "reamainingTokens": 9
},
200: {
    "message": "KO",
    "reamainingTokens": 0
},
400: {
    "message": "Bad Request",
    "info": "Missing route on query params"
}
```

## Description

This service will pick defined routes on `config.json` file at the root of the project and start a Token Bucket service that each second will check and add if needed new tokens for each caller registered.

A caller is registered every time a new id is passed on query params.

In case a caller has reached limit of requests for given route response will be of this kind:

```
200: {
    "message": "KO",
    "reamainingTokens": 0
}
```

Other whise you should get the remaining tokens for provided route on this way:

```
200: {
    "message": "OK",
    "reamainingTokens": 9
}
```

### Config json file

This JSON will define the accesible routes, max ammount of request token per route (burst) as the number of tokens that will be generated (sustained) each minute

## Start project

1 - Install dependencies

```
npm install
```

2 - Start application on development mode

```
npm run dev
```
