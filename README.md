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

## Run locally

**Prerequisites:** Node.js/npm and a running PostgreSQL installation.

### 1. Clone and install

```bash
git clone https://github.com/Nabiha072005/SWN-SKIN.git
cd SWN-SKIN
npm install
```

### 2. Set up PostgreSQL

Create a PostgreSQL database and a database user with permissions to create and access tables. The project expects a table named `questionnaire_results`.

The following is an **example schema compatible with the shared controller**; verify it against the original database definition before using it as the project's canonical schema:

```sql
CREATE TABLE IF NOT EXISTS questionnaire_results (
    id SERIAL PRIMARY KEY,
    skin_type TEXT NOT NULL,
    concerns TEXT[] NOT NULL,
    acne_type TEXT NOT NULL,
    recommended_ingredients TEXT[] NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Run the SQL in your chosen PostgreSQL database (for example, with `psql`). The database does **not** need any previous users' questionnaire records to generate new recommendations.

### 3. Configure environment variables

Copy the included example configuration:

```bash
cp .env.example .env
```

Set the database connection variables in your local `.env` file to match your PostgreSQL installation. Generate your own session secret. Configure email-service credentials only if you want to test outgoing newsletter emails. **Never commit real credentials or database backups.**

### 4. Start the server

```bash
npm start
```

Or, for automatic restarts during development:

```bash
npm run dev
```

Open the local URL printed by the server (the port depends on your configuration). Complete the questionnaire to test both the PostgreSQL write and read paths.

### 5. Verify the database flow

In your browser's Developer Tools → Network tab, submit the questionnaire and look for:

- `POST /api/questionnaire` → `201 Created`
- `GET /api/questionnaire/<result-id>` → `200 OK`

The GET response contains `recommended_ingredients`, which the frontend displays.

## Project structure

```text
SWN-SKIN/
├── controllers/
│   └── questionnaireController.js   # Questionnaire API logic + SQL queries
├── db/
│   └── pool.js                      # PostgreSQL connection pool
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

## Future improvements

- Deploy the full-stack application using cloud hosting and managed PostgreSQL.
- Improve newsletter popup behavior by persisting dismissals between page visits.
- Add automated tests and clearer user-facing API error messages.
- Improve accessibility, validation, and mobile responsiveness.
- Evaluate secure email delivery options for hosted environments.

---

*SWN-SKIN is an educational project and not a substitute for professional skincare advice.*
