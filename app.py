from flask import Flask, render_template, request, redirect, jsonify
from pymongo import MongoClient
from bson import ObjectId
import json

app = Flask(__name__)
client = MongoClient('localhost', 27017)
db = client.task_management # to select the database 

@app.route('/')
def index():
    tasks = db.tasks.find() # to retrieve all the documents 
    tasks_list = []

    for task in tasks:
        task['_id'] = str(task['_id'])
        tasks_list.append(task)
    
    return render_template('index.html', tasks=tasks_list)

# @app.route('/display', methods=['POST', 'GET'])
# def display():
#     cursor = db.tasks.find()
#     tasks_list = []

#     for task in cursor:
#         task['_id'] = str(task['_id'])
#         tasks_list.append(task)
#     return jsonify(tasks_list)

@app.route('/api/insert', methods=['POST'])
def insert():
    # raw_data = request.get_data()
    # data_str = raw_data.decode('utf-8')
    # json_data = json.loads(data_str)

    # title = json_data['title']
    # description = json_data['description']
    # status = json_data['status']

    title = request.form['title']
    description = request.form['description']
    status = request.form['status']

    task = {
        'title': title,
        'description': description, 
        'status':status, 
    }

    db.tasks.insert_one(task)
    # return jsonify({"message": "Task inserted successfully"})
    return redirect('/')

# @app.route('/add', methods=['POST'])
# def add():
#     if request.method == 'POST':
#         data = request.get_json() # to get parse data 
#         title = data.get('title')
#         description = data.get('description')
#         status = data.get('status', 'To do') # in this step we set status as "To do" as default

#         tasks = {
#             'title': title,
#             'description': description,
#             'status': status
#         }

#         db.tasks.insert_one(tasks)
#         return jsonify({"message": "Task inserted successfully"})


@app.route('/api/edit/<string:id>', methods=['GET', 'POST'])
def edit_task(id):
    id = ObjectId(id)
    tasks = db.tasks.find_one({'_id':id})
    return render_template('edit.html', task=tasks)

@app.route('/update', methods=['POST'])
def edit():
    if request.method == 'POST':
        data = request.get_json()  # Parse JSON data
        id = data.get('id')
        title = data.get('title')
        description = data.get('description')
        status = data.get('status')

        updated_task = {
            '$set': {
                '_id' : ObjectId(id),
                'title': title,
                'description': description,
                'status': status
            }
        }
        db.tasks.update_one({'_id':ObjectId(id)}, updated_task)
        return jsonify({"message": "Task updated successfully"})

@app.route('/api/delete/<string:id>', methods=['GET', 'POST'])
def delete(id):
    id = ObjectId(id)
    db.tasks.delete_one({'_id': id})
    return redirect('/')


if __name__ == "__main__":
    app.run(debug=True, port=5000)
