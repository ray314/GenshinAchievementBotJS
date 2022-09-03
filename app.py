import asyncio
import json
import genshin
import jsonpickle
from flask import Flask, request, jsonify
from flask_cors import CORS
#Set up Flaskstrong>:
app = Flask(__name__)
#Set up Flask to bypass CORS at the front end:
cors = CORS(app)

#Set up alt account for genshin
cookies = {"ltuid": 254026189, "ltoken": "8eDU7xaHkuQvdAQlvdetis4K3TEeKemaC8IH5Wpa"}
client = genshin.Client(cookies)

#Create the receiver API POST endpoint:
@app.route("/userdata", methods=["POST"])
async def getUserData():
   uid = request.get_json()
   # Get all data from the genshin API
   data = await client.get_genshin_user(uid)
   # Put the data in an object
   response = data.dict()
   data.stats.luxurious_chests
   ##response = { 'characters' : data.characters.__dict__, 
   #            'explorations' : data.explorations.__dict__,
   #            'info' : data.info.__dict__, 
   #            'stats' : data.stats.__dict__, 
   #            'teapoy' : data.teapot.__dict__ }
   response = json.dumps(response)
   print(response)
   return response
     
#Run the app:
if __name__ == "__main__":
     app.run()