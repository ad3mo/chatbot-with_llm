from functions import process_chat, process_from_history, llm_response
from classes import GetUserInfo, GetTransactionsHistory, SendMoney,  SendMoneyArguments, PayBill
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage, AIMessage, ChatMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.chains import LLMChain
from langchain_core.utils.function_calling import convert_to_openai_function
from typing import Optional
import requests
import json
import os
from dotenv import load_dotenv
load_dotenv()

jswt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzEyODg1OTkxLCJleHAiOjE3MTI5NzIzOTF9.0K5BmpOgrS_m3YspQBprYHgEVDDs4VkMzpLIdooEIzc"

# loading the llm (require .env file containg OPENAI_API_KEY)
llm = ChatOpenAI(temperature=0, model="gpt-3.5-turbo-0613")

# load all tools
tools = [GetUserInfo(), GetTransactionsHistory(), SendMoney(), PayBill()]

# convert class tools to openai functions
functions = [convert_to_openai_function(t) for t in tools]

prompt = ChatPromptTemplate.from_messages([
    ("system",
     """
    You are a banking assistant at Proxym, your name is 'El bankeji' : your goal is to assist already loggedin users to either give services to or to give them financial advices and suggestions.
    The banking services you provide are: check balance, check transactions history, send an amount of money to account number  & pay the bill of 100 TND.
    The currency is : TND or DT (Tunisian Dinar) which is equal to 3.3 US Dollars.
    You also can give financial suggestions to the user.
    Be friendly & clear.
    You only speak french!
    
    """),
    MessagesPlaceholder(variable_name="chat_history"),
    ("user", "{input}")
])

llm_chain = LLMChain(prompt=prompt, llm=llm)


while True:

    chat_history = []

    query = input("You: ")

    output = process_chat(llm=llm, query=query, functions=functions)
    print(output)

    name = output.additional_kwargs.get("function_call")
    if name:
        caser = output.additional_kwargs["function_call"]["name"]
        print(caser)
        question = json.loads(
            output.additional_kwargs["function_call"]["arguments"])
        print(question)
        chain = llm_response(llm=llm, question=question, query=query,
                             output=output, caser=caser, SendMoneyArguments=SendMoneyArguments, tools=tools, token=jswt, functions=functions)
        response = process_from_history(
            llm_chain=llm_chain, query=chain, chat_history=chat_history)
    else:
        response = process_from_history(llm_chain=llm_chain, query=query,
                                        chat_history=chat_history)

    chat_history.append(HumanMessage(content=query))
    chat_history.append(AIMessage(content=response))

    print("Assistant: ", response)
