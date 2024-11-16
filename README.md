# Contable - Contact Management Web Application

This is a simple contact management application built with **React** and **Material-UI (MUI) Components**. The application allows users to view, edit, and delete contact information seamlessly.

---

## 🚀 Features

- View a table of contacts.
- Edit a  contact details with a responsive dialog.
- Delete contacts with confirmation.
- Snackbar feedback for user actions.

---

## 🛠️ Technologies Used

- React
- Material-UI (MUI)
- Fetch API for data handling
- CircularProgress for loading indicators
- Snackbar for user feedback

---

## 📂 Project Structure
Root Directory|-- backend
              |-- frontend

## To run locally on your machine
1. Clone the Repository:
  ```bash
   git clone https://github.com/ahmed20455/contact_Form.git
   cd your-repo-name

2. Install Dependencies:
   ```bash
      npm install
3. First start the backend
   ```bash
      cd backend
      node index.js
4. Now start the frontend
   ```bash
      cd frontend
      npm start
Now, you can access the application in local host:3000  in your device.

## Database- MongoDb
I choosed mongodb over other databases, because this can handle the unstructured data in a very effective manner, if in future, we were extending the app to add a picture of a contact, it can be in a good way in mongodb.

## Challenges
During the development, I faced a challenge in the editing functionality and to check that user doesn't enter empty fields, I resolved this by going through GFG articles and through some youtube videos.