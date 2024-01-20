from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask import request, jsonify

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///recipes.db'
db = SQLAlchemy(app)

class Recipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    ingredients = db.Column(db.Text, nullable=False)
    instructions = db.Column(db.Text, nullable=False)

    def __repr__(self):
        return f"<Recipe {self.title}>"

@app.route('/recipes', methods=['GET', 'POST'])
def handle_recipes():
    if request.method == 'GET':
        # Logic to get all recipes
        recipes = Recipe.query.all()
        recipe_list = [{'id': recipe.id, 'title': recipe.title, 'ingredients': recipe.ingredients, 'instructions': recipe.instructions} for recipe in recipes]
        return jsonify({'recipes': recipe_list})

    elif request.method == 'POST':
        # Logic to add a new recipe
        data = request.json
        new_recipe = Recipe(title=data['title'], ingredients=data['ingredients'], instructions=data['instructions'])

        try:
            db.session.add(new_recipe)
            db.session.commit()
            return jsonify({'message': 'Recipe added successfully!'}), 201
        except:
            db.session.rollback()
            return jsonify({'message': 'Error adding recipe'}), 500
        finally:
            db.session.close()


if __name__ == '__main__':
    app.run(debug=True, port=5002)
