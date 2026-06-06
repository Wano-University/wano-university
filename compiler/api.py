from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from lss import parser
import jwt_token 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.post('/')
async def executeLSSPOST(request: Request):
    data = await request.json()
    command = data['command']
    jwt_token.token= data['token']
    result = parser.parse(command)
    print(result)

    return {
            "message":str(result),
            } 

@app.get('/')
async def executeLSSGET(request: Request):
    data = await request.json()
    print("DATA RECEIVED", data)
    print("Token: ",data['token'])
    print("Command: ",data['command'])
    command = data['command']
    jwt_token.token= data['token']
    result = parser.parse(command)

    
    return {
            "message":result.body,
            "json": result 
            }

