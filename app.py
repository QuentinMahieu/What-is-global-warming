from flask import Flask, jsonify
from flask import Response,json
from flask_cors import CORS, cross_origin
from flask import Flask, render_template, request, redirect, url_for

from pymongo import MongoClient

mongo = "MonashBootcamp"

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
@app.route("/",methods=['GET'])
def home():
    return render_template("index.html")

@app.route("/causes",methods=['GET'])
def causes():
    return render_template("causes.html")

@app.route("/effects",methods=['GET'])
def effects():
    return render_template("effects.html")

@app.route("/future",methods=['GET'])
def future():
    return render_template("future.html")

@app.route("/glob_anomalies/data",methods=['GET'])
def anom():
    # Collect the data
    glob_anomalies_col = climate_db.glob_anomalies.find({},{'_id': False})
    glob_anomalies_data = []
    for doc in glob_anomalies_col:
        glob_anomalies_data.append(doc)

    return (jsonify(glob_anomalies_data))

@app.route("/avg_country/data",methods=['GET'])
def avgCountry():
    # Collect the data
    avg_country_col = climate_db.avg_temp_per_country.find({},{'_id': False})
    avg_country_data = []
    for doc in avg_country_col:
        avg_country_data.append(doc)
  
    return (jsonify(avg_country_data))

@app.route("/aus_summary/data",methods=['GET'])
def ausExtremes():
    # Collect the data
    australia_extremes_summary_col = climate_db.australia_extremes_summary.find({},{'_id': False})
    australia_extremes_summary_data = []
    for doc in australia_extremes_summary_col:
        australia_extremes_summary_data.append(doc)

    return (jsonify(australia_extremes_summary_data))

@app.route("/glob_projection/data",methods=['GET'])
def projections():
    # Collect the data
    glob_projection_col = climate_db.glob_projection.find({},{'_id': False})
    glob_projection_data = []
    for doc in glob_projection_col:
        glob_projection_data.append(doc)
  
    return (jsonify(glob_projection_data))

@app.route("/sea_level/data",methods=['GET'])
def seaLevel():
    # Collect the data
    sea_level_col = climate_db.sea_level.find({},{'_id': False})
    sea_level_data = []
    for doc in sea_level_col:
        sea_level_data.append(doc)
  
    return (jsonify(sea_level_data))


if __name__ == '__main__':
    app.run(debug=True)
