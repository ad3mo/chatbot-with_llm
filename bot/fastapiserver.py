from typing import Optional
from fastapi import FastAPI, HTTPException, Header, Request
import httpx
import jwt
from chat import get_response
app = FastAPI()

@app.post("/login")
async def login(email: str, password: str):
    # Forward the login information to the Node.js server
    node_url = "http://localhost:5000/api/auth/login"
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(node_url, json={"email": email, "password": password})
            if response.status_code == 200:
                # Forward the response from the Node.js server to the client
                return response.json()  # Return JSON-serializable response
            else:
                raise HTTPException(status_code=500, detail="Node.js server error")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/register")
async def login(username:str, email: str, password: str):
    # Forward the login information to the Node.js server
    node_url = "http://localhost:5000/api/auth/register"
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(node_url, json={"username":username,"email": email, "password": password})
            if response.status_code == 201:
                # Forward the response from the Node.js server to the client
                return response.json()  # Return JSON-serializable response
            else:
                raise HTTPException(status_code=500, detail="Node.js server error")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@app.post("/chat")
async def chat(request: Request, authorization: Optional[str] = Header(None)):
    # Print the request headers for debugging
    # print(dict(request.headers))

    # Get user input from the request body
    request_body = await request.json()
    msg = request_body.get("msg")
  
    try:
        # Extract the JWT token from the 'authorization' header
        token = None
        if authorization and authorization.startswith("Bearer "):
            token = authorization.split(" ")[1]

        response = get_response(msg, token)  # Pass the token to get_response function
        res = {"chat_response": response}
        return res
    except Exception as e:
        print("Error:", e)
        return {"error": str(e)}


# @app.get("/balance")
# async def get_balance(jwt:str):
#     # Forward the login information to the Node.js server
#     node_url = "http://localhost:5000/api/balance"
#     headers = {"Authorization": f"Bearer {jwt}",
#                    "Content-Type": "application/json"}
#     try:
#         async with httpx.AsyncClient() as client:
#             response = await client.get(node_url,headers=headers)
#             if response.status_code == 200:
#                 # Forward the response from the Node.js server to the client
#                 return response.json()  # Return JSON-serializable response
#             else:
#                 raise HTTPException(status_code=500, detail="Node.js server error")
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
    


# @app.post("/sendmoney")
# async def send_money(accountNumber:int,amount:float,jwt:str):
#     # Forward the login information to the Node.js server
#     node_url = "http://localhost:5000/api/transactions/send"
#     headers = {"Authorization": f"Bearer {jwt}",
#                    "Content-Type": "application/json"}
#     try:
#         async with httpx.AsyncClient() as client:
#             response = await client.post(node_url,headers=headers,json={"accountNumber":accountNumber,"amount":amount})
#             if response.status_code == 200:
#                 # Forward the response from the Node.js server to the client
#                 return response.json()  # Return JSON-serializable response
#             else:
#                 raise HTTPException(status_code=500, detail="Node.js server error")
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# @app.get("/transactions")
# async def get_transactions(jwt:str):
#     # Forward the login information to the Node.js server
#     node_url = "http://localhost:5000/api/transactions/history"
#     headers = {"Authorization": f"Bearer {jwt}",
#                    "Content-Type": "application/json"}
#     try:
#         async with httpx.AsyncClient() as client:
#             response = await client.get(node_url,headers=headers)
#             if response.status_code == 200:
#                 # Forward the response from the Node.js server to the client
#                 return response.json()  # Return JSON-serializable response
#             else:
#                 raise HTTPException(status_code=500, detail="Node.js server error")
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
    


# def decode_jwt(token):
#     try:
#         decoded_token = jwt.decode(token, "TOPSECRET", algorithms=["HS256"])
#         return decoded_token.get("id")  # Extract the user ID from the decoded token
#     except jwt.ExpiredSignatureError:
#         raise HTTPException(status_code=401, detail="Token expired")
#     except jwt.InvalidTokenError:
#         raise HTTPException(status_code=401, detail="Invalid token")
    

# @app.get("/user")
# async def get_userinfo(jwt:str):
#     # Forward the login information to the Node.js server
#     user_id = decode_jwt(jwt)
#     node_url = f"http://localhost:5000/api/users/{user_id}"
#     headers = {"Authorization": f"Bearer {jwt}",
#                    "Content-Type": "application/json"}
#     try:
#         async with httpx.AsyncClient() as client:
#             response = await client.get(node_url,headers=headers)
#             if response.status_code == 200:
#                 # Forward the response from the Node.js server to the client
#                 return response.json()  # Return JSON-serializable response
#             else:
#                 raise HTTPException(status_code=500, detail="Node.js server error")
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
    