from functions import process_chat, process_from_history, llm_response, has_a_function_call, get_function_details
from classes import GetUserInfo, GetTransactionsHistory, SendMoney,  SendMoneyArguments, PayBill
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage, AIMessage, ChatMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.chains import LLMChain
from langchain_core.utils.function_calling import convert_to_openai_function
from typing import Optional
import json
import requests
import os
from dotenv import load_dotenv
load_dotenv()

jswt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzEzMTAxMTIyLCJleHAiOjE3MTMxODc1MjJ9.6Q4v4qmf8Qnuc5KHF6zHYujSlrI90zEtBx3Vp1ULV7s"

# loading the llm (require .env file containg OPENAI_API_KEY)
llm = ChatOpenAI(temperature=0, model="gpt-3.5-turbo-0613")

# load all tools
tools = [GetUserInfo(), GetTransactionsHistory(), SendMoney(), PayBill()]

# convert class tools to openai functions
functions = [convert_to_openai_function(t) for t in tools]

template = """
    You are a banking assistant at Proxym, your name is 'El bankeji' : your goal is to assist already loggedin users to either give services to or to give them financial advices and suggestions.
    The banking services you provide are: check balance, check transactions history, send an amount of money to account number  & pay the bill of 100 TND.
    The currency is : TND or DT (Tunisian Dinar) which is equal to 3.3 US Dollars.
    You also can give financial suggestions to the user.
    Be friendly & clear.
    You only speak french!
    
    """

prompt = ChatPromptTemplate.from_messages([
    ("system", template
     ),
    MessagesPlaceholder(variable_name="chat_history"),
    ("user", "{input}")
])

llm_chain = LLMChain(prompt=prompt, llm=llm)

chat_history = []

while True:

    query = input("You: ")

    output = process_chat(llm=llm, query=query, functions=functions)

    checkFunction = has_a_function_call(output)
    if checkFunction:
        print("\n==================WITH A FUNCTION====================\n")
        details = get_function_details(checkFunction, output)
        name = details[0]
        args = json.loads(details[1])
        print("\n==================NAME====================\n",
              name, "\n======================================\n")
        print("\n==================ARGS====================\n",
              args, "\n======================================\n")
        response = llm_response(llm=llm, function_args=args, query=query,
                                output=output, function_name=name, SendMoneyArguments=SendMoneyArguments, tools=tools, token=jswt, functions=functions)
    else:
        print("\n================WITHOUT FUNCTIONS======================\n")
        response = process_from_history(llm_chain=llm_chain, query=query,
                                        chat_history=chat_history)

    chat_history.append(HumanMessage(content=query))
    chat_history.append(AIMessage(content=response))

    print("Assistant: ", response)
    print("=======================\n history: ",
          chat_history, "\n=======================\n ")
