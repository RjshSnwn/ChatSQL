import os
import openai
from langchain.agents.agent_toolkits import SQLDatabaseToolkit
from langchain.sql_database import SQLDatabase
from langchain.agents import create_sql_agent
from flask import Flask, request, jsonify
from langchain.agents.agent_types import AgentType
from langchain_experimental.sql import SQLDatabaseChain
from decouple import config
from langchain.chat_models import ChatOpenAI
from flask_cors import CORS
import json
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate

os.environ["OPENAI_API_KEY"] = config('OPENAI_API_KEY')
openai.api_key = os.environ["OPENAI_API_KEY"]

user = "postgres"
password = "admin"
host = "localhost"
port = "5432"
database = "postgres"
schema = "public"

db = SQLDatabase.from_uri(
    f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{database}",
)

llm = ChatOpenAI(model_name='gpt-4', temperature=0)

db_chain = SQLDatabaseChain.from_llm(llm, db, verbose=True)

toolkit = SQLDatabaseToolkit(db=db, llm=llm)

resFormat = [
    {
        "column 1": "row 1 data",
        "column 2": "row 1 data"
    },
    {
        "column 1": "row 2 data",
        "column 2": "row 2 data"
    }
]

prompt = f'''
             If the user message is a greeting, answer accordingly, otherwise based on the data that has been generated, return 20 distinct values from the response in the given format: {resFormat}. 
            
        INSTRUCTIONS: 
            1- If the response is in a single sentence or a very short passage with a value in it, return the sentence/passage and not JSON.
            2- Return the data in JSON format in case it is deemed to be in a table. Only return the JSON object and do not include any additional text along with the returned JSON object in response.
            3- You have to return the last indexed value of AgentActionMessageLog as output.
            4- If you deem the response to be in tabular format, then return it as an array of objects even if there is only one row to return.
            5- Make sure the property name in JSON should be enclosed in double quotes.
            6- Column name 'customercode' in table name 'billing' is equal to column name 'distributorcode' in table name 'secondary_mapping' and also the column name 'customername' in table name 'billing' is column name 'distributorname' in table name 'secondary_mapping', take this into consideration as you construct a query using the input question.
            7 -You MUST bring back distinct names for questions starting with Who, which and similar questions or name queries. 
'''

llm_prompt = PromptTemplate(
    input_variables=["query"],
    template='''
    Answer the user's query accordingly.
    query : {query}
    ''',
)

llm_chain = LLMChain(llm=llm, prompt=llm_prompt)


sql_agent = create_sql_agent(
    llm=llm,
    toolkit=toolkit,
    verbose=True,
    agent_type=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    agent_executor_kwargs={"return_intermediate_steps": True}
)

app = Flask(__name__)
CORS(app)
CORS(app, origins="*")


@app.route('/question', methods=['POST'])
def question():
    try:
        data = request.json
        question = data.get('question')
        input_values = {
            "query": question
        }

        if "Hi" in question:
            result = llm_chain.run(input_values)
            return jsonify({"result": result})        

        result = sql_agent(f"{prompt}. {question}")
        queryOutput = result['output']
        queryOutput = queryOutput.replace("'", '"')
        if "[{" in result['output']:
            queryOutput = json.loads(queryOutput)
        print("queryOutput:-", queryOutput)

        return jsonify({"result": queryOutput})

    except Exception as e:
        error_message = str(e)
        
        if "Token limit exceeded" in error_message:
            return jsonify({"response": "Sorry, please try again"})

        else:
            return jsonify({"response": "Sorry, please try again", "error_message": error_message})


if __name__ == '__main__':
    app.run(debug=True)
