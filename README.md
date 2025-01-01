# **Waste Zero Bangladesh**

> **An AI-powered waste management system to foster a sustainable future for Bangladesh.**

---

## **Overview**

**Waste Zero Bangladesh** is an innovative application that leverages AI and cutting-edge technologies to reduce waste and promote sustainable practices. It aims to revolutionize waste management by enabling users to report, collect, recycle, and reuse waste while minimizing environmental impact.

---

## **Key Features**

1. **Report Waste**:
   - Users can upload pictures of waste in their location.
   - AI analyzes the image to determine the type and approximate weight of the waste.
   - Simplifies the waste reporting process for citizens.

2. **Collect Waste**:
   - Users can collect reported waste from various locations.
   - AI ensures that collected waste matches the original report for verification.

3. **Recycle and Reuse**:
   - AI provides recommendations for recycling waste based on type.
   - Encourages reducing single-use items and opting for reusable alternatives.

4. **Certification**:
   - Promotes composting of organic waste to reduce landfill contributions.
   - Users earn certifications for adopting sustainable practices.

5. **Community Engagement**:
   - Leaderboards and reward systems encourage users to participate in waste management.
   - Notifications keep users updated about tasks, rewards, and achievements.

---

## **Tech Stack**

| Component            | Technology                                                                 |
|----------------------|-----------------------------------------------------------------------------|
| **Frontend**         | [Next.js 14](https://nextjs.org/), [TailwindCSS](https://tailwindcss.com/) |
| **Backend**          | [Node.js](https://nodejs.org/), [Drizzle ORM](https://orm.drizzle.team/)   |
| **AI Tool**          | [Google Gemini AI](https://ai.google.dev/)                                |
| **Database**         | [Neon Database](https://neon.tech/)                                       |
| **Authentication**   | [Web3Auth](https://web3auth.io/)                                          |

---

## **Project Structure**

```
waste-zero-bangladesh/
│
├── src/
│   ├── components/         # Reusable React components
│   ├── pages/              # Next.js pages for routing
│   ├── styles/             # TailwindCSS custom styles
│   ├── utils/              # Helper functions and utilities
│   ├── db/                 # Database schema and action files
│   └── ai/                 # AI integration logic for waste analysis
│
├── public/                 # Static assets (images, icons, etc.)
├── .env.local              # Environment variables
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # TailwindCSS configuration
├── README.md               # Project documentation
└── package.json            # Project dependencies and scripts
```

---

## **Installation**

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/waste-zero-bangladesh.git
   cd waste-zero-bangladesh
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env.local` file in the root directory and add the following variables:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
   GOOGLE_GEMINI_API_KEY=your_google_gemini_api_key
   NEON_DATABASE_URL=your_neon_database_url
   WEB3AUTH_CLIENT_ID=your_web3auth_client_id
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## **Usage**

### **1. Reporting Waste**
- Navigate to the "Report Waste" page.
- Upload a picture of waste from your location.
- Submit the form to report waste details.

### **2. Collecting Waste**
- Visit the "Collect Waste" page.
- Choose a reported waste task and mark it as collected.
- AI verifies the match between collected and reported waste.

### **3. Recycling Recommendations**
- Use the "Recycle Waste" page to get AI-generated suggestions for recycling specific waste types.
- Download recommendations as a PDF.

### **4. Viewing Leaderboard**
- Check your ranking and points earned in the community on the leaderboard page.

---

## **API Endpoints**

| Endpoint                             | Method | Description                           |
|--------------------------------------|--------|---------------------------------------|
| `/api/reports`                       | POST   | Submit a new waste report            |
| `/api/collect`                       | POST   | Mark waste as collected              |
| `/api/recycling-recommendations`     | POST   | Generate recycling suggestions       |
| `/api/reports/recent`                | GET    | Fetch recent reports                 |
| `/api/leaderboard`                   | GET    | Fetch the top users                  |

---

## **Contributing**

We welcome contributions to **Waste Zero Bangladesh**! To contribute:
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Add feature"
   ```
4. Push to your fork and submit a pull request.

---

## **License**

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## **Contact**

For queries or suggestions, please contact the project maintainers:

- **Email**: your_email@example.com
- **GitHub**: [yourusername](https://github.com/yourusername)

---

Let me know if you'd like any further adjustments to this README!
