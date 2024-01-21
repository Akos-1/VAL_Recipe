import React, { useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

const SignUp = ({ onSignUpSuccess }) => {
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSignUp = async () => {
    try {
      const { email, password } = newUser;
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      alert('User registered successfully!');
      onSignUpSuccess(); // Trigger the parent component to perform any necessary actions after signup
    } catch (error) {
      console.error('Error signing up:', error.message);
      alert('Error signing up. Please try again.');
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        name="email"
        value={newUser.email}
        onChange={handleInputChange}
        required
      />

      <label htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        name="password"
        value={newUser.password}
        onChange={handleInputChange}
        required
      />

      <button type="button" onClick={handleSignUp}>
        Sign Up
      </button>
    </div>
  );
};

export default SignUp;

