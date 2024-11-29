# CrowdShip

CrowdShip is an innovative peer-to-peer package delivery platform designed to connect individuals who need affordable, reliable delivery with commuters and gig workers already traveling to their destination. This approach not only reduces delivery costs but also minimizes environmental impact by utilizing existing routes. CrowdShip is perfect for users looking to send packages out-of-town quickly, securely, and at a fraction of traditional courier costs.

With CrowdShip, senders can post a delivery request and find a trusted, verified commuter who can deliver their package along their route. Commuters benefit from earning additional income with minimal inconvenience, making it a win-win for all users. The platform is equipped with secure login, real-time package tracking, and a two-way rating system to build trust within the community.

## Product Page

Check out the app [here](https://webhome.csc.uvic.ca/~amanpalod/).

## Milestones

Check out the progress of the app:

- [Project Proposal](https://docs.google.com/presentation/d/1peil1iJRbVo_JsmiLLo1Ui51M7B2C_nOO8ybEi26i7I/edit?usp=sharing)
- [Milestone 1](https://www.canva.com/design/DAGTBPuQ0hA/XS5Hs-V7oXsaTxTl7JmsUg/view?utm_content=DAGTBPuQ0hA&utm_campaign=designshare&utm_medium=link&utm_source=editor)
- [Milestone 2](https://www.canva.com/design/DAGUn4-0RUc/vmg020h-dukKPFfQMnRNJg/view?utm_content=DAGUn4-0RUc&utm_campaign=designshare&utm_medium=link&utm_source=editor)
- [Milestone 3](https://docs.google.com/document/d/1b9FrmSNGkEhcOvePmVpHOdPgPnyCju_JA-OCCkgSVtI/edit?usp=sharing)

## Wiki

For comprehensive information about the CrowdShip project, including detailed documentation, user guides, and developer notes, please visit our wiki page.

You can access the wiki here: [CrowdShip Wiki](https://drive.google.com/drive/folders/1qSe8aqg4Xu0syk7wau58o0o3b7cBdhXS?usp=sharing)

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
| **(8)Profile Page**                 | Displays user-specific information that they can update.                                       | Complete              |
| **(9) Review**                      | Allows drivers and senders to leave reviews on each other.                                     | Complete              |
| **(10) Splash Screen**              | Transition screen between login/sign up and the app’s terms and conditions.                    | Complete              |
| **(11) Terms & Conditions**         | Transition screen between login/sign up and the app’s terms and conditions.                    | Complete              |
| **(12) Real Time Tracking**         | Allows senders to track their deliveries in real time                                          | Incomplete            |
| **(13) Orders Dashboard**           | Allows users to view their current/past deliveries and current/past delivery requests.         | Complete              |
| **(14) Payment**                    | Allows drivers to receive payment and allow senders to securely send money.                    | Incomplete            |
| **(15) Submit Feedback/Bug Report** | Provides users with an option to submit feedback or report bugs directly through the app.      | Complete              |

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

## Credits

CrowdShip is a collaborative effort by a dedicated team of six individuals, consisting of four developers and two business students. Each member has contributed their unique skills and expertise to bring this project to life.

### Developers

- **Aman Palod** - palod.aman@gmail.com
- **Isabella Tsui** - isabellacmtsui@gmail.com
- **Neeraj Nandakumar** - neerajnand911@gmail.com
- **Omar Madhani** - https://github.com/OmarMadhani - omar.madhani@outlook.com

### Business Students

- **Ethan Moore** - Ethanmoore2323@gmail.com
- **Stella Yan** - stella.yanjingyan@gmail.com

The combined efforts have made CrowdShip a robust and user-friendly delivery management system. To see the work distributions and contributions of each individual, refer to the work summaries in the Milestone deliverables in the [wiki](https://drive.google.com/drive/folders/1qSe8aqg4Xu0syk7wau58o0o3b7cBdhXS?usp=sharing) page.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
