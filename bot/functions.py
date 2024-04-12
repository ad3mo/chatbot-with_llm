import jwt
from langchain.schema import HumanMessage, AIMessage, ChatMessage
from langchain.chains import create_tagging_chain, create_tagging_chain_pydantic


def extract_id_from_jwt(token):
    try:
        # Decode the JWT token without verifying the signature
        decoded_token = jwt.decode(token, options={"verify_signature": False})
        # Extract the 'id' field from the decoded token
        user_id = decoded_token.get('id')
        return user_id
    except jwt.ExpiredSignatureError:
        print("Token has expired.")
    except jwt.InvalidTokenError:
        print("Invalid token.")


# process which function to run
def run_api_functions(llm, query, question, tools, token, SendMoneyArguments, caser):
    toolRes = None
    match caser:
        case "GetUserInfo":
            toolRes = tools[0]._run(jwt=token, query=question)
            return toolRes
        case "GetTransactionsHistory":
            toolRes = tools[1]._run(jwt=token, query=question)
            return toolRes
        case "SendMoney":

            chain = create_tagging_chain_pydantic(SendMoneyArguments, llm)
            parse = chain.invoke(query)
            toolRes = tools[2]._run(jwt=token, receiver_id=parse.get(
                "text").accountNumber, amount=parse.get("text").amount)
            return toolRes
        case "PayBill":
            toolRes = tools[3]._run(jwt=token)
            return toolRes
        case _:
            print("err")


def process_chat(llm, query, functions):
    response = llm.invoke(

        # the llm automatically chooses the correct function for the query
        [HumanMessage(content=query)], functions=functions)

    return response


def llm_response(llm, question,  query, output, tools, token, SendMoneyArguments, caser, functions):
    # Second response: make api response human readable
    second_response = llm.invoke(
        [
            HumanMessage(content=query),
            AIMessage(content=str(output.additional_kwargs)),
            ChatMessage(
                role="function",
                additional_kwargs={
                    "name": output.additional_kwargs["function_call"]["name"]
                },
                content=f"{run_api_functions(llm=llm, question=question, query=query, tools=tools,
                                             token=token, SendMoneyArguments=SendMoneyArguments, caser=caser)}"
            ),
        ],
        functions=functions,
    )
    return second_response.content


def process_from_history(llm_chain, query, chat_history):
    response = llm_chain.invoke({
        "chat_history": chat_history,
        "input": query,
    })
    return response["text"]
