const { useState, useEffect } = React;

function App() {
    const [recipes, setRecipes] = useState([]);
    const [newRecipe, setNewRecipe] = useState({
        title: '',
        ingredients: '',
        instructions: '',
    });

    useEffect(() => {
        getRecipes();
    }, []);

    const getRecipes = () => {
        fetch('http://localhost:5001/recipes')
            .then(response => response.json())
            .then(data => {
                setRecipes(data.recipes);
            })
            .catch(error => console.error('Error fetching recipes:', error));
    };

    const displayRecipes = () => {
        return recipes.map(recipe => (
            <div className="recipe-card" key={recipe.id}>
                <h3>{recipe.title}</h3>
                <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
                <p><strong>Instructions:</strong> {recipe.instructions}</p>
            </div>
        ));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRecipe(prevState => ({ ...prevState, [name]: value }));
    };

    const addRecipe = () => {
        if (!newRecipe.title || !newRecipe.ingredients || !newRecipe.instructions) {
            alert('Please fill in all fields.');
            return;
        }

        fetch('http://localhost:5002/recipes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newRecipe),
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            getRecipes();
            setNewRecipe({
                title: '',
                ingredients: '',
                instructions: '',
            });
        })
        .catch(error => console.error('Error adding recipe:', error));
    };

    return (
        <div className="container">
            <h1>Recipe App</h1>
            {displayRecipes()}
            <form>
                <label htmlFor="title">Title:</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={newRecipe.title}
                    onChange={handleInputChange}
                    required
                />
                
                <label htmlFor="ingredients">Ingredients:</label>
                <textarea
                    id="ingredients"
                    name="ingredients"
                    value={newRecipe.ingredients}
                    onChange={handleInputChange}
                    required
                ></textarea>
                
                <label htmlFor="instructions">Instructions:</label>
                <textarea
                    id="instructions"
                    name="instructions"
                    value={newRecipe.instructions}
                    onChange={handleInputChange}
                    required
                ></textarea>
                
                <button type="button" onClick={addRecipe}>Add Recipe</button>
            </form>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));

