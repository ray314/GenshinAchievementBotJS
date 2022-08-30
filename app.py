from flask import Flask, request, jsonify
from flask_cors import CORS
#Set up Flaskstrong>:
app = Flask(__name__)
#Set up Flask to bypass CORS at the front end:
cors = CORS(app)

#Create the receiver API POST endpoint:
@app.route("/userdata", methods=["POST"])
def postME():
   data = request.get_json()
   response = { 'res' : "Received UID successfully", 'data' : data}
   response = jsonify(response)
   return response
     
#Run the app:
if __name__ == "__main__":
     app.run()