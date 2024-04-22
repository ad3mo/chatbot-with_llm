from pydantic import BaseModel
from typing import Optional
from fastapi import FastAPI, HTTPException, Header, Response, Request, Cookie
from fastapi.middleware.cors import CORSMiddleware
import httpx
import jwt
from datetime import datetime, timedelta
from constants import BANKING_API_URL
import asyncio

from chat import get_response
app = FastAPI()

# Allow requests from http://localhost:3000
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


class LoginRequest(BaseModel):
    email: str
    password: str


@app.post("/login")
async def login(login_request: LoginRequest, response: Response):
    email = login_request.email
    password = login_request.password
    # Forward the login information to the banking server
    url = f"{BANKING_API_URL}/auth/login"
    try:
        async with httpx.AsyncClient() as client:
            response_from_node = await client.post(url, json={"email": email, "password": password})
            if response_from_node.status_code == 200:
                token = response_from_node.json().get("token")
                # Set the token in a cookie
                expires = datetime.now() + timedelta(days=30)

                response.set_cookie(
                    key="auth_token",
                    value=token,
                    httponly="true",
                    samesite="none",
                    secure="true"
                )
                response.status_code = 200
                return response
            else:
                raise HTTPException(
                    status_code=response_from_node.status_code, detail="Failed to authenticate")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# @app.post("/register")
# async def login(username: str, email: str, password: str):
#     # Forward the login information to the Node.js server
#     url = f"{BANKING_API_URL}/api/auth/register"
#     try:
#         async with httpx.AsyncClient() as client:
#             response = await client.post(url, json={"username": username, "email": email, "password": password})
#             if response.status_code == 201:

#                 return response.json()
#             else:
#                 raise HTTPException(
#                     status_code=500, detail="Node.js server error")
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


async def getToken(request: Request):
    jwt = request.cookies.get("auth_token")
    return jwt


@app.get("/status")
async def status(request: Request, auth_token: str = Cookie(None)):
    url = f"{BANKING_API_URL}/auth/status"
    print(auth_token)
    try:
        jwt = await getToken(request)
        print("status", jwt)
        async with httpx.AsyncClient() as client:
            headers = {"Authorization": f"Bearer {jwt}",
                       "Content-Type": "application/json"}
            response = await client.get(url, headers=headers)

            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(
                    status_code=500, detail="Node.js server error")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/logout")
async def logout(request: Request, response: Response):
    url = f"{BANKING_API_URL}/auth/logout"

    try:
        jwt = await getToken(request)  # Wait for the token
        print("logout", jwt)
        async with httpx.AsyncClient() as client:
            headers = {"Authorization": f"Bearer {jwt}",
                       "Content-Type": "application/json"}
            res = await client.get(url, headers=headers)

            if res.status_code == 200:
                response.delete_cookie(
                    key="auth_token",
                    httponly="true",
                    samesite="none",
                    secure="true"
                )

                return {"message": "Logged out successfully"}
            else:
                raise HTTPException(
                    status_code=500, detail="Node.js server error")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/generate")
async def generate(request: Request, response: Response):

    try:
        jwt = await getToken(request)
        if not jwt:
            return {"error": "could not authenticate user"}

        request_body = await request.json()
        msg = request_body.get("query")
        print(msg)
        if not msg:
            return {"error": "missing 'query' in request body"}

        res = get_response(msg, jwt)
        print(res)
        return {"chat_response": res}

    except Exception as e:
        print("Error:", e)
        return {"error": str(e)}
