from flask import Flask, jsonify
from flask import Response,json
from flask_cors import CORS, cross_origin
from flask import Flask, render_template, request, redirect, url_for
import joblib
import numpy as np
from sklearn.linear_model import LinearRegression
from pymongo import MongoClient
import pymongo
# from config import mongo

mongo = os.environ.get('mongo', None)
#################################################
# Database Setup
#################################################
dbname = "GlobalWarmingData"
client = MongoClient(f"mongodb+srv://Quentin:{mongo}@cluster0.ddqv6.mongodb.net/{dbname}?retryWrites=true&w=majority")
climate_db = client.get_database("GlobalWarmingData")
#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Flask Routes
#################################################
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/causes")
def causes():
    return render_template("causes.html")

@app.route("/effects")
def effects():
    return render_template("effects.html")

@app.route("/future")
def future():
    return render_template("future.html", )

@app.route("/project")
def projetcInfo():
    return render_template("project.html")

@app.route("/glob_anomalies/data",methods=['GET'])
def anom():
    # Collect the data
    glob_anomalies_col = climate_db.glob_anomalies.find({},{'_id': False}).sort('Year',1)
    glob_anomalies_data = []
    for doc in glob_anomalies_col:
        glob_anomalies_data.append(doc)

    return (jsonify(glob_anomalies_data))

@app.route("/avg_country/data",methods=['GET','POST'])
def avgCountry():
    # Collect the data
    avg_country_col = climate_db.avg_temp_per_country.find({'Country':{ "$in": [ 'Australia','United Kingdom','United States','China' ] }},{'_id': False}).sort([('Country',pymongo.ASCENDING),('Year',pymongo.ASCENDING)])
    avg_country_data = []
    for doc in avg_country_col:
        avg_country_data.append(doc)
  
    return (jsonify(avg_country_data))

@app.route("/aus_summary/data",methods=['GET'])
def ausExtremes():
    # Collect the data
    australia_extremes_summary_col = climate_db.australia_extremes_summary.find({},{'_id': False}).sort('Year',1)
    australia_extremes_summary_data = []
    for doc in australia_extremes_summary_col:
        australia_extremes_summary_data.append(doc)

    return (jsonify(australia_extremes_summary_data))

@app.route("/glob_projection/data",methods=['GET'])
def projections():
    # Collect the data
    glob_projection_col = climate_db.glob_projection.find({},{'_id': False}).sort('Year',1)
    glob_projection_data = []
    for doc in glob_projection_col:
        glob_projection_data.append(doc)
  
    return (jsonify(glob_projection_data))

@app.route("/sea_level/data",methods=['GET'])
def seaLevel():
    # Collect the data
    sea_level_col = climate_db.sea_level.find({},{'_id': False}).sort('Year',1)
    sea_level_data = []
    for doc in sea_level_col:
        sea_level_data.append(doc)
  
    return (jsonify(sea_level_data))

@app.route("/predictmyimpact",methods=['GET','POST'])
def impact():
    # Collect the data
    if request.method == 'POST':
        select = request.form.get("CO2")
        
    if select == '':
        prediction = "Wrong number given"
    else:
        y = np.array([2021,float(select),1.24,1.05]).reshape(1,-1)

        filename = 'models/aus_anomalie_pred.sav'
        loaded_model = joblib.load(filename)
        score = 0.9994*100
        prediction = loaded_model.predict(y)
        prediction = prediction.ravel()
        prediction = f'+ {round(prediction.item(0),2)} °C in temperature in 2021 vs 1.15°C in 2020. With {round(score,2)}% accuraccy.'

    return render_template("future.html", temperature = prediction)

if __name__ == '__main__':
    app.run(debug=True)
