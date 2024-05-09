from val_recipe_app import VALRecipeApp


def main():
    # Data
    app_name = "VAL Recipe App"
    app_mission = "To make cooking delicious and nutritious meals easy and accessible for everyone."
    app_features = ["Vast recipe database", "Meal planning tools", "Nutritional information", "User-friendly interface"]
    app_team = ["Veronica - Quality Control Scientist", "Agnes - Veterinarian", "Lebene - Tech enthusiast"]
    app_story = "Our journey began with a passion for food and a desire to share delicious recipes with the world."
    app_values = "We are committed to promoting healthy eating, supporting local producers, and reducing food waste."
    app_social_proof = ["Rated 5 stars by users on App Store", "Featured in Food Magazine's Top Apps of the Year"]

    # Create VALRecipeApp instance
    val_recipe_app = VALRecipeApp(app_name, app_mission, app_features, app_team, app_story, app_values, app_social_proof)

    # Generate "About Us" section
    about_us_text = val_recipe_app.generate_about_us()
    print(about_us_text)


if __name__ == "__main__":
    main()
