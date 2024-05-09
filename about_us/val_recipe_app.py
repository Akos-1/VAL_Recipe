class VALRecipeApp:
    def __init__(self, name, mission, features, team, story, values, social_proof):
        self.name = name
        self.mission = mission
        self.features = features
        self.team = team
        self.story = story
        self.values = values
        self.social_proof = social_proof

    def generate_about_us(self):
        about_us_section = f"Welcome to {self.name}!\n\n"
        about_us_section += f"Our Mission: {self.mission}\n\n"
        about_us_section += "Key Features:\n"
        for feature in self.features:
            about_us_section += f"- {feature}\n"
        about_us_section += "\nMeet Our Team:\n"
        for member in self.team:
            about_us_section += f"- {member}\n"
        about_us_section += f"\nOur Story: {self.story}\n\n"
        about_us_section += f"Our Values: {self.values}\n\n"
        about_us_section += "Social Proof:\n"
        for proof in self.social_proof:
            about_us_section += f"- {proof}\n"
        return about_us_section
