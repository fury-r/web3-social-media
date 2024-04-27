# Web3 Social Media POC App

Welcome to our Proof of Concept (POC) Web3 Social Media application! This application allows users to interact in a decentralized social media environment, leveraging blockchain technology for enhanced security and decentralization. Users can send messages, upload photos, follow other users, edit their profile details, like and comment on posts, search for users and posts, block other users, and even send non-fungible tokens (NFTs) to each other.

## Features


- ** 📨 Messaging:** Users can send messages to each other securely using blockchain technology.
- ** 📸 Photo Upload:** Upload photos to share with your followers.
- ** 👥Follow/Unfollow:** Follow other users to keep up with their posts.
- ** ✏️Profile Editing:** Edit your profile details such as bio, profile picture, etc.
- **❤️Like and Comment:** Interact with posts by liking and commenting on them.
- **🔍Search:** Search for other users and posts within the platform.
- **🚫Blocking:** Block other users to prevent interactions with them.
- **💸NFT Transactions:** Send non-fungible tokens to other users.

## Technologies Used

- **Frontend:** Built using Next.js for the user interface.
- **Backend:** Powered by Flask, a Python micro-framework, for handling server-side logic.
- **Blockchain Integration:** Utilizes Solidity for smart contracts to interact with the Ethereum blockchain.
- **Database:** MongoDB is used as the primary database for storing user data.
- **Authentication:** MoralisDB is used for managing user authentication and authorization securely.


### Setting Up the UI (Frontend)

1. **Clone the Repository**: 
    ```bash
    git clone <repository-url>
    ```
2. **Navigate to the Frontend Directory**:
    ```bash
    cd frontend
    ```
3. **Install Dependencies**:
    ```bash
    npm install
    ```
    or
    ```bash
    npm install --legacy-peer-deps
    ```
    ```bash
    npm install --legacy-peer-deps sass
    ```
4. **Set Environment Variables**:
    - Check if there's an `.env.example` file provided. If yes, duplicate it and rename the copy to `.env`. Fill in the required environment variables such as API endpoints, etc.
    - If there's no `.env.example` file, check the documentation or ask the team for the required environment variables.
5. **Start the Development Server**:
    ```bash
    npm run dev
    ```
6. **Access the Application**:
    Open your web browser and navigate to `http://localhost:3000` to access the application.

### Setting Up the Backend

1. **Navigate to the Backend Directory**:
    ```bash
    cd backend
    ```
2. **Create a Virtual Environment**:
    ```bash
    python -m venv venv
    ```
   This command creates a new directory named `venv` which will contain all the necessary packages for the backend.

3. **Activate the Virtual Environment**:
    - On Windows:
        ```bash
        venv\Scripts\activate
        ```
    - On Unix or MacOS:
        ```bash
        source venv/bin/activate
        ```
   Once activated, you will see `(venv)` in your terminal prompt, indicating that the virtual environment is active.

4. **Install Python Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

5. **Set Environment Variables**:
    - Similar to the previous setup, set up the environment variables by copying the `.env.example` file to `.env` and filling in the required details.

6. **Start the Flask Server**:
    ```bash
    python app.py
    ```

7. **Verify Backend Connectivity**:
   Once the Flask server is running, verify its connectivity by sending requests to the defined endpoints using tools like Postman or by integrating the frontend with the backend APIs.

### Additional Notes

- **Deactivating the Virtual Environment**: To deactivate the virtual environment, simply type `deactivate` in the terminal.
- **Updating Requirements**: If you need to add or remove dependencies, do so within the virtual environment, and then update the `requirements.txt` file using:
    ```bash
    pip freeze > requirements.txt
    ```
- **Cleaning Up**: If you wish to delete the virtual environment later, simply delete the `venv` directory.



## Contributing

I  welcome contributions from the community to improve and extend the functionality of our Web3 Social Media application. If you'd like to contribute, please fork the repository, make your changes, and submit a pull request. I  appreciate your contributions!


## Acknowledgements

I would like to thank the following technologies and communities for their invaluable contributions to this project:

- Next.js
- Flask
- Solidity
- MongoDB
- MoralisDB
- Ethereum Blockchain
