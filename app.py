from flask import Flask, jsonify, render_template, request
import requests
import json, csv

app = Flask(__name__)

app.config['DEBUG'] = True 

@app.route("/", methods=["GET", "POST"])
def index():

	url = 'https://www.eventbriteapi.com/v3/events/search/?popular=True&token=SU73LIXOPDCVMKMPQOG4'
	r = requests.get(url).json()
	events_list = r['events']

	dates = {}
	regions = {}
	for i in range (0, len(events_list)):
		venue_id = events_list[i]['venue_id']
		if venue_id is not None:
			venue_url = 'https://www.eventbriteapi.com/v3/venues/' + venue_id + '/?token=GLLTVQVQWAUUGUO3FYZX'
			v = requests.get(venue_url).json()
			region = v['address']['region']
			if region in regions:
				regions[region] += 1
			else:
				regions[region] = 1

		date = events_list[i]['start']['utc'].split('T')[0]
		if date in dates:
			dates[date] += 1
		else:
			dates[date] = 1

	region_list = []
	for key in regions:
		region_list.append([key, regions[key]])

	with open('static/regions.json', 'w') as outfile:
		json.dump(region_list, outfile)


	with open('static/data.csv','wb') as f:
		writer = csv.writer(f, delimiter=',')
		writer.writerow(('Date', 'Num', 'Max'))
		for key in dates:
			writer.writerow((key, dates[key]))

	f.close()
	
	return render_template("index.html")

if __name__ == '__main__':
	app.run(host='0.0.0.0')

		