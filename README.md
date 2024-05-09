# VAL Recipes

VAL Recipes is a sophisticated digital recipe book focusing on West African dishes. It serves as a comprehensive platform for users to manage and explore a curated collection of authentic West African recipes. Whether you aspire to contribute your own recipes, refine existing ones, or simply immerse yourself in the culinary wonders of West Africa, VAL Recipes is your definitive guide.

Visit our deployed site: [VAL Recipes](http://valrecipes.live/)

## Features

- **Recipe Management:** Seamlessly add, edit, and delete recipes.
- **Categorization:** Organize recipes by categories for effortless navigation.
- **Search Functionality:** Swiftly locate specific recipes using the search feature.
- **User-Friendly Interface:** Enjoy an intuitive design for a flawless user experience.
- **Journey Through West Africa:** Explore and celebrate the diverse culinary heritage of West Africa.

## Technologies Used

### Backend

- **Express.js:** A robust Node.js web framework for building scalable web applications.
- **Sequelize:** An ORM for Node.js, facilitating efficient database management.
- **MySQL:** A powerful relational database management system for storing recipe data.

### Frontend

- **HTML, CSS, JavaScript (Vanilla JS):** Cutting-edge frontend technologies for crafting an engaging user interface.

### Version Control

- **Git and GitHub:** State-of-the-art version control system and collaboration platform for seamless development workflows.

## Usage

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/val-recipes.git
   ```

2. **Install Dependencies:**
   ```bash
   cd val-recipes
   npm install
   ```

3. **Set Up the Database:**
   - Ensure MySQL is installed and running on your system.
   - Create a `.env` file in the root directory and configure the following variables:
     ```
     DB_HOST=localhost
     DB_USER=your_mysql_username
     DB_PASSWORD=your_mysql_password
     DB_NAME=val_recipes
     ```
   - Run the following command to initialize the database schema:
     ```bash
     npm run db:init
     ```

4. **Start the Server:**
   ```bash
   npm start
   ```

5. **Navigate to the Home Page:**
   Open your web browser and visit `http://localhost:5006` to access the list of recipes.

6. **Explore and Contribute:**
   - Explore different categories or utilize the search feature to discover recipes.
   - To contribute, follow the Contribution Guidelines outlined below.

## API Documentation

The API provides detailed documentation for recipe management. [Link to API documentation]

## Database Schema

Explore the database schema, including tables for recipes and categories. [Link to database schema]

## Frontend

The frontend components are meticulously crafted using HTML, CSS, and Vanilla JavaScript. Navigate to the frontend directory for further insights.

## Contributing

We warmly welcome contributions from the community! If you're interested in contributing to VAL Recipes, kindly adhere to the following guidelines:

1. Fork the repository on GitHub.
2. Create a new branch for your feature or bug fix: `git checkout -b feature/your-feature`.
3. Make your modifications and ensure they align with the project's coding conventions.
4. Commit your changes: `git commit -am 'Add new feature'`.
5. Push to your branch: `git push origin feature/your-feature`.
6. Submit a pull request detailing your changes and their significance.

## License

This project is licensed under the MIT License - see the LICENSE.md file for further details.

## Acknowledgments

Special gratitude to Veronica Gyasi, Agnes Narh, and Lebene Gbebleou-Sleem for their invaluable contributions. Our endeavor is inspired by the vibrant and delectable culinary traditions of West Africa.

## LinkedIn

- Veronica Gyasi - [LinkedIn](https://www.linkedin.com/in/veronica-gyasi-5353a51a2)
- Agnes Narh - [LinkedIn](https://www.linkedin.com/in/agnes-buabeng-22198b140)
- Lebene Gbebleou-Sleem - [LinkedIn](https://www.linkedin.com/in/lebene-gbebleou-sleem-b0609514a)

## Screenshot of Website