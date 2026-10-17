# SWN-SKIN

**A full-stack skincare website with personalized ingredient recommendations, product browsing, and a simulated shopping experience. It is pronounced as "Swn Skin".**

SWN-SKIN is a collaborative course project designed to help users explore skincare products and discover ingredients suited to their skin type and concerns. The website combines a multi-step questionnaire with a rule-based recommendation engine, a Node.js/Express API, and PostgreSQL persistence.

> **Project status:** Source code available; a public live deployment is planned. The product recommendation page is a general product guide, while the questionnaire produces personalized **ingredient** recommendations. Checkout is a demonstration interface, not a live payment integration.

## Features

- **Personalized skincare questionnaire:** Collects skin type, multiple skin concerns, and acne type, with input validation and illustrative popups.
- **Rule-based ingredient recommendation engine:** Maps questionnaire responses to ingredient suggestions such as hyaluronic acid, ceramides, niacinamide, and salicylic acid. Uses a JavaScript `Set` to avoid duplicates.
- **Full-stack data flow:** Express routes process questionnaire submissions; PostgreSQL stores answers and generated ingredients; a GET endpoint retrieves saved results by ID for frontend display.
- **Product catalog:** Browse skincare items across shop pages, with client-side text search and shopping bag controls.
- **Shopping experience:** Add and remove items, view a subtotal, and navigate to a checkout demonstration.
- **Account interface:** Sign-in and account-creation screens.
- **Newsletter discount signup:** Backend signup handling and optional email delivery through Nodemailer when mail credentials are configured.
- **Theme preference:** Light/dark theme selection stored in browser `localStorage`.
- **Informational pages:** About, FAQ, and a standardized product recommendation guide.

## Tech stack

| Layer | Technologies |
| --- | --- |
| Frontend | HTML5, CSS3, JavaScript, Fetch API |
| Backend | Node.js, Express.js |
| Recommendation logic | JavaScript (rule-based conditions and `Set`) |
| Database | PostgreSQL, `pg` connection pool, parameterized SQL |
| Email | Nodemailer (requires separately configured email service) |
| Development | Ubuntu Linux VM, Oracle VirtualBox, VS Code Remote-SSH, Git, GitHub |

## How the recommendation engine works

1. A user completes the questionnaire and submits their skin type, concerns, and acne type.
2. The frontend sends a `POST` request to `/api/questionnaire`.
3. The Express controller validates the request and calls `generateRecommendations()` on the backend.
4. The backend uses a parameterized PostgreSQL `INSERT` to store the questionnaire answers **and** generated ingredient recommendations together, returning a new record ID.
5. The frontend uses that ID to request `GET /api/questionnaire/:id`.
6. The backend runs a PostgreSQL `SELECT` and returns the saved record as JSON.
7. The frontend renders the retrieved ingredient list on the questionnaire's thank-you screen.

```text
Questionnaire (browser)
        |
        | POST /api/questionnaire
        v
Express controller --> Recommendation engine (JavaScript)
        |
        | INSERT answers + ingredients
        v
     PostgreSQL
        ^
        | SELECT by result ID
        |
GET /api/questionnaire/:id (Express)
        |
        | JSON response
        v
Personalized ingredient list (browser)
```

The recommendation logic runs in the **Node.js backend**, not in the browser. PostgreSQL is required for the current end-to-end questionnaire flow because the API writes and reads saved results.

### API endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/questionnaire` | Validate answers, generate recommendations, save the result, and return its ID |
| `GET` | `/api/questionnaire/:id` | Retrieve a saved questionnaire and its recommended ingredients |

**Example request:**

```json
{
  "skinType": "dry",
  "concerns": ["dryness", "pores"],
  "acneType": "comedonal"
}
```

The recommendation engine produces a unique list of relevant ingredients. This is a rules-based demonstration, not a medical diagnosis or individualized dermatological advice.

## Run Locally

**Prerequisites:** Node.js, npm, and PostgreSQL.

### 1. Clone and Install

Clone the repository and install the required dependencies:

```bash
git clone https://github.com/Nabiha072005/SWN-SKIN.git
cd SWN-SKIN
npm install
```

### 2. Set Up PostgreSQL

Install PostgreSQL locally and ensure the database service is running.

On Ubuntu, open the PostgreSQL terminal:

```bash
sudo -u postgres psql
```

Create a database user and database:

```sql
CREATE USER swn_user WITH PASSWORD 'choose_a_strong_local_password';
CREATE DATABASE swn_skin OWNER swn_user;
```

Exit PostgreSQL:

```sql
\q
```

Initialize the database tables using the provided SQL schema:

```bash
psql -h localhost -U swn_user -d swn_skin -f db/schema.sql
```

This creates the database structure required for the recommendation engine. No existing questionnaire records are needed.

**Note:** The commands above are intended for Ubuntu. PostgreSQL installation and administration commands may differ on macOS or Windows.

### 3. Configure Environment Variables

Copy the provided example configuration:

```bash
cp .env.example .env
```

Update the database connection settings in `.env` to match your local PostgreSQL installation.

Generate your own session secret. Email-service credentials are only required if you want to test outgoing newsletter emails.

**Never commit real credentials or database backups to GitHub.**

### 4. Start the Server

Run:

```bash
node server.js
```

Open the local URL displayed in your terminal.

You can now explore the website, complete the skincare questionnaire, and receive personalized ingredient recommendations.

### 5. Verify the Database Integration

To verify the full-stack recommendation workflow, open your browser's **Developer Tools → Network** tab and submit the questionnaire.

You should observe:

| Request | Expected Response | Purpose |
|---|---|---|
| `POST /api/questionnaire` | `201 Created` | Generates and stores questionnaire results |
| `GET /api/questionnaire/:id` | `200 OK` | Retrieves saved recommendations from PostgreSQL |

The GET endpoint returns the saved `recommended_ingredients`, which the frontend dynamically renders on the questionnaire results screen.

This demonstrates the complete **frontend → backend → recommendation engine → PostgreSQL write → PostgreSQL read → frontend rendering** workflow.

## Project structure

```text
SWN-SKIN/
├── controllers/
│   └── questionnaireController.js   # Questionnaire API logic + SQL queries
├── db/
│   └── pool.js                      # PostgreSQL connection pool
    └── schema.sql
├── public/
│   ├── images/
│   ├── pages/                       # Shop, quiz, FAQ, checkout, etc.
│   ├── index.html
│   ├── script.js                     # UI events, questionnaire fetch calls
│   ├── shop.js
│   └── style.css
├── routes/
│   └── questionnaireRoutes.js       # POST and GET endpoints
├── utils/
│   └── recommendationEngine.js      # Rule-based ingredient selection
├── .env.example                     # Placeholder configuration only
├── .gitignore
├── package.json
└── server.js                         # Express application entry point
```

## My contribution

My primary contribution was the **full-stack personalized ingredient recommendation feature**: developing the rule-based recommendation logic, connecting the questionnaire to Express API endpoints, and implementing PostgreSQL persistence and retrieval for questionnaire results. This includes asynchronous `fetch()` requests, backend validation, parameterized SQL, and rendering saved recommendations in the frontend.

## Team and attribution

Originally developed as a **collaborative course project** by **Safa, Najah, Waslat, and Nabiha**. The website contains shared work; this repository is a personal portfolio copy for continued learning and development. The description of my contribution above is not a claim of sole authorship of the entire website.
