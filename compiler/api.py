from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from lss import parser,jwt_token

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
async def executeLSS(request: Request):
    data = await request.json()
    print("DATA RECEIVED", data)
    print("Token: ",data['token'])
    print("Command: ",data['command'])
    command = data['command']
    result = parser.parse(command)

    return {
            "message":"Great success",
            "json": result 
            }

