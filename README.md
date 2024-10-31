# CrowdShip

This repository contains the source code for **CrowdShip**, a delivery management system that allows users to send and receive packages easily. The app offers features for both senders and drivers, including package requests, delivery acceptance, and communication between parties. The following sections describe the current state of the app, its features, and implementation status.

Visit our product page here: https://webhome.csc.uvic.ca/~amanpalod/

## Features

| Feature                       | Description                                                                                   | Implemented | Workload (hrs) |
| ----------------------------- | --------------------------------------------------------------------------------------------- | ----------- | -------------- |
| **Sign up & Login**            | Ensures secure access to the app for authenticated users.                                      | Yes         | 10             |
| **Nav Bar**                    | Navigate between the profile, chat, accept delivery, and request delivery pages.               | Yes         | 5              |
| **Accept Delivery Page**       | Allows drivers to see the deliveries closest to their destination and accept/decline requests. | Yes         | 24             |
| **Request Delivery Page**      | Allows senders to put their packages out to be delivered.                                      | Yes         | 10             |
| **Profile Page**               | Displays user-specific information that they can update.                                       | WIP         | 10             |
| **Chat**                       | Enables communication between the sender and driver.                                           | No          | 20             |
| **Splash & Terms Conditions**  | Transition screen between login/sign up and the app’s terms and conditions.                    | No          | 3              |
| **Sender and Driver Review**   | After each delivery is completed, both sender and driver can review each other.                | No          | 15             |

## Project Setup

To run this project, follow the steps below:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/palodaman/crowdship.git
    cd crowdship-app
    ```

2. **Install dependencies**:
    Run the following command to install the necessary packages:
    ```bash
    npm install
    ```

3. **Run the app**:
    Launch the app in development mode by running:
    ```bash
    npm run start
    ```
Note: Ensure you have Xcode installed on your system with the IOS package.

## Technologies Used

- **React Native** for building the mobile application.
- **Supabase** for authentication and database services.
- **Expo** for handling image uploads and mobile app testing.
- **JavaScript/TypeScript** for the primary programming language.
- **Node.js** for the development environment.

## Feature Implementation

### 1. **Sign up & Login**
   - Fully implemented and ensures secure authentication for users.
   - Workload: 10 hours.

### 2. **Nav Bar**
   - In progress. This feature enables users to navigate between different pages, including Profile, Chat, Accept Delivery, and Request Delivery pages.
   - Workload: 5 hours.

### 3. **Accept Delivery Page**
   - Fully implemented. This allows drivers to accept delivery requests that match their routes.
   - Workload: 24 hours.

### 4. **Request Delivery Page**
   - Fully implemented. Senders can request deliveries by entering details about their package, pickup, and drop-off points.
   - Workload: 10 hours.

### 5. **Profile Page**
   - Not implemented yet. Users will be able to view and update their profile information.
   - Workload: 10 hours.

### 6. **Chat**
   - Not implemented yet. This will allow real-time communication between senders and drivers.
   - Workload: 20 hours.

### 7. **Splash & Terms and Conditions Screen**
   - Not implemented yet. This screen will display the app's terms and conditions after login.
   - Workload: 3 hours.

### 8. **Sender and Driver Review Page**
   - Not implemented yet. Both senders and drivers will be able to review each other after a delivery is completed.
   - Workload: 15 hours.


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
