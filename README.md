# CrowdShip

<img src="product-page/images/banner.png" align="center" width="1000" />

#

CrowdShip is an inter-island package delivery app that connects individuals seeking affordable, reliable delivery with commuters and gig workers already traveling to that destination. By leveraging existing routes, CrowdShip reduces delivery costs and minimizes environmental impact, making it ideal for users needing quick, secure, and budget-friendly out-of-town package delivery. The platform enables senders to post delivery requests and match with trusted, verified commuters, who earn extra income with minimal effort.

**Product page:** [https://webhome.csc.uvic.ca/~amanpalod/](https://webhome.csc.uvic.ca/~amanpalod/).  
**Demo video:** [https://www.youtube.com/watch?v=TxOBn6cbAII](https://www.youtube.com/watch?v=TxOBn6cbAII).  
**Wiki:** [https://drive.google.com/drive/folders/1qSe8aqg4Xu0syk7wau58o0o3b7cBdhXS?usp=sharing](https://drive.google.com/drive/folders/1qSe8aqg4Xu0syk7wau58o0o3b7cBdhXS?usp=sharing).

## Features

Below is a brief overview of all the features in our app and their status at the end of milestone 3. Any feature that are marked as incomplete will be worked on in the future. For further details on features, see this [document](https://docs.google.com/document/d/1b9FrmSNGkEhcOvePmVpHOdPgPnyCju_JA-OCCkgSVtI/edit?usp=sharing).

| Feature                             | Description                                                                                    | Implementation Status |
| ----------------------------------- | ---------------------------------------------------------------------------------------------- | --------------------- |
| **(1 & 2) Sign up & Login**         | Ensures secure access to the app for authenticated users.                                      | Complete              |
| **(3) Authorization**               | Provides users with a way to securely log in using email and password authentication.          | Complete              |
| **(4) Navigation Bar**              | Navigate between the profile, chat, accept delivery, and request delivery pages.               | Complete              |
| **(5) Request Delivery Page**       | Allows senders to put their packages out to be delivered.                                      | Complete              |
| **(6) Chat**                        | Enables communication between the sender and driver.                                           | Complete              |
| **(7) Accept Delivery Page**        | Allows drivers to see the deliveries closest to their destination and accept/decline requests. | Complete              |
| **(8) Profile Page**                | Displays user-specific information that they can update.                                       | Complete              |
| **(9) Review**                      | Allows drivers and senders to leave reviews on each other.                                     | Complete              |
| **(10) Splash Screen**              | Transition screen between login/sign up and the app’s terms and conditions.                    | Complete              |
| **(11) Terms & Conditions**         | Transition screen between login/sign up and the app’s terms and conditions.                    | Complete              |
| **(12) Real Time Tracking**         | Allows senders to track their deliveries in real time                                          | Incomplete            |
| **(13) Orders Dashboard**           | Allows users to view their current/past deliveries and current/past delivery requests.         | Complete              |
| **(14) Payment**                    | Allows drivers to receive payment and allow senders to securely send money.                    | Incomplete            |
| **(15) Submit Feedback/Bug Report** | Provides users with an option to submit feedback or report bugs directly through the app.      | Complete              |

## Deployment Status
We attempted to deploy the application, but currently, its functionality is limited. While users can sign in and access the splash screen, navigation beyond that point is not working in the deployed version. 

This issue may stem from one of two causes:

- A recent Expo update, which has been causing issues for many in the development community.
- A potential problem specific to our deployment process.
  
At this time, we are uncertain about the exact cause and are actively investigating the matter. To view the deployed app, download the [ExpoGo](https://apps.apple.com/us/app/expo-go/id982107779) app on your phone, then scan the QR code in this [link](https://expo.dev/preview/update?message=Merge%20pull%20request%20%23107%20from%20palodaman%2F95-align-product-page%0A%0A95%20align%20product%20page&updateRuntimeVersion=1.0.0&createdAt=2024-12-06T21%3A43%3A34.777Z&slug=exp&projectId=6b144803-eb7e-4365-8db6-5968bd10ab07&group=130a108e-77c1-495a-8624-4abd95f678b4).

In the meantime, we recommend referring to the [Product Page](https://webhome.csc.uvic.ca/~amanpalod/) or [User Guide](https://docs.google.com/document/d/1lQs_EjnXZZy8dGen3CaqMke09BjaLN4GbLe6EabGFcw/edit?tab=t.0#heading=h.pmwhfur6usos) for more detailed information on the app. Alternatively, you can install and run the app locally to experience its full functionality. We deeply apologize for the inconvenience and appreciate your understanding as we work toward resolving this issue.

For testing purposes, please feel free to use the following test accounts:

**Account 1:**

- email: omar.madhani@outlook.com
- password: test123
   
**Account 2:**

- email: neerajnand911@gmail.com
- password: 12345678

## Project Setup

### Development Prerequisites

Before you begin, ensure that the following are installed:

- [XCode with IOS package](https://apps.apple.com/ca/app/xcode/id497799835?mt=12)
- [Node](https://nodejs.org/en/download/package-manager)
- [ExpoGo app](https://apps.apple.com/us/app/expo-go/id982107779)

### Running The App

**1. Clone the repository**

   ```bash
   git clone https://github.com/palodaman/crowdship.git
   cd crowdship-app
   ```

**2. Install dependencies**

   ```bash
   npm install
   ```

**3. Launch the app**:

   ```bash
    npm run start
   ```
   Once you launch the app, you can either run is using the ExpoGo app **or** on a simulator.

**Run the app on your phone (Expo Go - IOS Only)**:

1. Scan the QR code displayed in the terminal.
2. Follow the notification from the Expo Go app to open the project.
3. Start using the app!

**Note:**
   - UVic wifi may be too slow and the connection request may time out
   - Make sure that any firewalls are disabled on your computer
   - Ensure that your phone and computer are on the same network

**Run the app in IOS simulator**:
   ```bash
    i
   ```

## Team Members

CrowdShip is a collaborative effort by a dedicated team of six individuals from UVic, consisting of four developers and two business students. Each member has contributed their unique skills and expertise to bring this project to life.

- **Aman Palod** - palod.aman@gmail.com
- **Ethan Moore** - Ethanmoore2323@gmail.com
- **Isabella Tsui** - isabellacmtsui@gmail.com
- **Neeraj Nandakumar** - neerajnand911@gmail.com
- **Omar Madhani** - https://github.com/OmarMadhani - omar.madhani@outlook.com
- **Stella Yan** - stella.yanjingyan@gmail.com

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
