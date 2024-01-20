# Sample test using unittest
import unittest
from backend.app import app

class TestFlaskRoutes(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()

    def test_get_recipes_route(self):
        response = self.app.get('/recipes')
        self.assertEqual(response.status_code, 200)
        # Add more assertions as needed

