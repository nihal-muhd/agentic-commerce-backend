# FastAPI Quick Reference

A small reference guide for working with the FastAPI `agent-service`, written for someone coming from an Express.js / Node.js background.

---

## 1. How to Run the Project

### Project location

Run commands from the `agent-service` root:

Expected structure:

```text
agent-service/
├── app/
│   ├── routers/
│   ├── schemas/
│   ├── __init__.py
│   └── main.py
└── requirements.txt
```

### Check Python

```bash
python --version
```

### Recommended: create a virtual environment

```bash
python -m venv .venv
```

Activate it in Git Bash on Windows:

```bash
source .venv/Scripts/activate
```

After activation, the terminal usually shows:

```text
(.venv)
```

### Install dependencies

```bash
python -m pip install -r requirements.txt
```

Example `requirements.txt`:

```txt
fastapi
uvicorn[standard]
```

### Start FastAPI

Recommended command:

```bash
python -m uvicorn app.main:app --reload
```

You can also use:

```bash
uvicorn app.main:app --reload
```

but this only works when the `uvicorn` executable is available in your shell `PATH`.

If this fails:

```text
bash: uvicorn: command not found
```

but this works:

```bash
python -m uvicorn app.main:app --reload
```

it means Python can find the installed `uvicorn` module, but your shell cannot find the standalone `uvicorn` executable.

### Development URLs

FastAPI server:

```text
http://127.0.0.1:8000
```

Swagger API documentation:

```text
http://127.0.0.1:8000/docs
```

ReDoc documentation:

```text
http://127.0.0.1:8000/redoc
```

---

## 2. Understanding the Uvicorn Command

```bash
python -m uvicorn app.main:app --reload
```

Breakdown:

```text
app.main:app
│   │    │
│   │    └── FastAPI variable named `app`
│   └────── main.py
└────────── app folder/package
```

Example `app/main.py`:

```python
from fastapi import FastAPI

app = FastAPI()
```

`--reload` automatically restarts the server when files change during development.

This is similar to using `nodemon` in Node.js.

```text
Node.js / Express
nodemon server.js

FastAPI
python -m uvicorn app.main:app --reload
```

---

## 3. Express.js vs FastAPI

| Express / Node.js           | FastAPI / Python                       |
| --------------------------- | -------------------------------------- |
| `server.js` / `app.js`      | `main.py`                              |
| `express()`                 | `FastAPI()`                            |
| `express.Router()`          | `APIRouter()`                          |
| `routes/`                   | `routers/`                             |
| Joi / Zod                   | Pydantic                               |
| `npm`                       | `pip`                                  |
| `npm install package-name`  | `python -m pip install package-name`   |
| `package.json` dependencies | `requirements.txt` or `pyproject.toml` |
| `node_modules/`             | `.venv/`                               |
| `req.params`                | Path parameter                         |
| `req.query`                 | Query parameter                        |
| `req.body`                  | Pydantic request model                 |
| `res.json()`                | `return {...}`                         |
| `nodemon`                   | `uvicorn --reload`                     |
| Middleware                  | Middleware                             |
| `async/await`               | `async/await`                          |

---

## 4. Entry File: `main.py`

`main.py` is similar to `server.js` or `app.js` in Express.

### Express

```javascript
import express from 'express';

const app = express();

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(3000);
```

### FastAPI

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok"}
```

One important difference is that FastAPI normally does not start the HTTP server itself.

Uvicorn runs the FastAPI application:

```bash
python -m uvicorn app.main:app --reload
```

---

## 5. Project Structure

Current structure:

```text
agent-service/
│
├── app/
│   ├── routers/
│   │   ├── __init__.py
│   │   └── health.py
│   │
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── health.py
│   │
│   ├── __init__.py
│   └── main.py
│
└── requirements.txt
```

### `app/main.py`

Main FastAPI application.

Responsibilities usually include:

- Creating the FastAPI app
- Registering routers
- Registering middleware
- Startup configuration
- Application-level settings

Example:

```python
from fastapi import FastAPI
from app.routers.health import router as health_router

app = FastAPI()

app.include_router(health_router)
```

---

## 6. `routers/`

The `routers` folder is similar to Express route files.

### Express

```javascript
import { Router } from 'express';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});
```

### FastAPI

```python
from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
def health():
    return {"status": "ok"}
```

Then register the router in `main.py`:

```python
from fastapi import FastAPI
from app.routers.health import router as health_router

app = FastAPI()

app.include_router(health_router)
```

You can also add a prefix:

```python
app.include_router(
    health_router,
    prefix="/api"
)
```

Then:

```text
GET /api/health
```

This is similar to:

```javascript
app.use('/api', healthRouter);
```

---

## 7. `APIRouter`

FastAPI:

```python
router = APIRouter()
```

is conceptually similar to:

```javascript
const router = express.Router();
```

FastAPI route:

```python
@router.get("/users")
def get_users():
    return []
```

The `@router.get(...)` syntax is a Python decorator.

It tells FastAPI:

```text
Register this function as the handler for GET /users
```

---

## 8. `schemas/`

FastAPI usually uses Pydantic models for request and response validation.

Think of a FastAPI schema as approximately:

```text
TypeScript interface + runtime validation
```

### Express example

```javascript
app.post('/users', (req, res) => {
  const { name, email, age } = req.body;
});
```

Express does not validate these values automatically.

You might normally use:

```text
Zod
Joi
Yup
```

### FastAPI / Pydantic

```python
from pydantic import BaseModel

class CreateUserRequest(BaseModel):
    name: str
    email: str
    age: int
```

Use it in a route:

```python
@router.post("/users")
def create_user(user: CreateUserRequest):
    return user
```

If invalid data is sent, FastAPI and Pydantic automatically return a validation error.

Example invalid request:

```json
{
  "name": "Nihal",
  "email": "test@example.com",
  "age": "hello"
}
```

`age` expects an integer, so validation fails.

---

## 9. Response Schemas

Schemas can also define response shapes.

```python
from pydantic import BaseModel

class HealthResponse(BaseModel):
    status: str
```

Route:

```python
@router.get(
    "/health",
    response_model=HealthResponse
)
def health():
    return {
        "status": "ok"
    }
```

This gives FastAPI information about the expected response and helps generate API documentation.

---

## 10. `__init__.py`

You may see:

```text
app/__init__.py
app/routers/__init__.py
app/schemas/__init__.py
```

`__init__.py` is commonly used to make a directory behave as a Python package.

That allows imports such as:

```python
from app.routers.health import router
```

The file can be completely empty.

```python
# __init__.py
```

It can also re-export items, but you do not need to do that while learning.

---

## 11. Are These Default FastAPI Files?

No.

FastAPI does not require this structure:

```text
routers/
schemas/
services/
models/
```

A minimal FastAPI project can be:

```text
agent-service/
└── main.py
```

with:

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"hello": "world"}
```

Folders like:

```text
routers/
schemas/
services/
models/
repositories/
```

are organizational conventions.

This is similar to Express, where Express itself does not force:

```text
controllers/
services/
routes/
models/
middleware/
```

Developers create these structures to keep larger applications organized.

---

## 12. Installing Packages

### Node.js

```bash
npm install express
npm install axios
```

### Python

```bash
python -m pip install fastapi
python -m pip install httpx
```

Check installed Python packages:

```bash
python -m pip list
```

Check one package:

```bash
python -m pip show uvicorn
```

---

## 13. `.venv` vs `node_modules`

Node projects normally contain:

```text
project/
├── node_modules/
└── package.json
```

Python projects commonly use:

```text
project/
├── .venv/
└── requirements.txt
```

They are not technically the same thing, but they solve a similar project-isolation problem.

The virtual environment stores a separate Python environment and installed packages for that project.

Create one:

```bash
python -m venv .venv
```

Activate in Git Bash:

```bash
source .venv/Scripts/activate
```

Usually add this to `.gitignore`:

```gitignore
.venv/
```

---

## 14. Why Use a Virtual Environment?

Without a virtual environment:

```text
Global Python
├── FastAPI
├── Uvicorn
├── project A packages
├── project B packages
└── project C packages
```

Different projects can eventually require conflicting package versions.

With virtual environments:

```text
project-a/
└── .venv/
    └── project A dependencies

project-b/
└── .venv/
    └── project B dependencies
```

This keeps dependencies isolated.

---

## 15. `requirements.txt`

Example:

```txt
fastapi
uvicorn[standard]
httpx
```

Install everything using:

```bash
python -m pip install -r requirements.txt
```

This is conceptually similar to:

```bash
npm install
```

using the dependencies defined by the project.

### Important Difference From npm

Running:

```bash
npm install axios
```

normally updates `package.json`.

Running:

```bash
python -m pip install httpx
```

does not automatically update `requirements.txt`.

A common older workflow is:

```bash
python -m pip freeze > requirements.txt
```

Be careful: this records all packages installed in the current environment, including transitive dependencies.

Modern Python projects may also use `pyproject.toml`, Poetry, PDM, or `uv`.

---

## 16. `uvicorn[standard]`

This requirement:

```txt
uvicorn[standard]
```

means:

```text
Install Uvicorn
+
install its recommended optional dependencies
```

The `[standard]` part is called a Python package extra.

Install it directly with:

```bash
python -m pip install "uvicorn[standard]"
```

---

## 17. Path Parameters

### Express

```javascript
app.get('/users/:id', (req, res) => {
  const id = req.params.id;
});
```

### FastAPI

```python
@router.get("/users/{user_id}")
def get_user(user_id: int):
    return {
        "user_id": user_id
    }
```

Request:

```text
GET /users/123
```

FastAPI converts `123` to an integer because of:

```python
user_id: int
```

---

## 18. Query Parameters

### Express

```javascript
app.get('/users', (req, res) => {
  const search = req.query.search;
});
```

Request:

```text
GET /users?search=nihal
```

### FastAPI

```python
@router.get("/users")
def get_users(search: str | None = None):
    return {
        "search": search
    }
```

FastAPI automatically treats `search` as a query parameter because it is not part of the URL path.

---

## 19. Request Body

### Express

```javascript
app.post('/users', (req, res) => {
  const data = req.body;
});
```

### FastAPI

```python
from pydantic import BaseModel

class CreateUser(BaseModel):
    name: str
    email: str


@router.post("/users")
def create_user(user: CreateUser):
    return user
```

Flow:

```text
JSON request
    ↓
Pydantic
    ↓
Validation
    ↓
Python object
    ↓
Route handler
```

---

## 20. Returning JSON

### Express

```javascript
res.json({
  status: 'ok',
});
```

### FastAPI

```python
return {
    "status": "ok"
}
```

FastAPI automatically converts the Python dictionary into JSON.

---

## 21. Async / Await

### Express

```javascript
router.get('/users', async (req, res) => {
  const users = await getUsers();

  res.json(users);
});
```

### FastAPI

```python
@router.get("/users")
async def get_users():
    users = await get_users_from_db()

    return users
```

The internal runtime models are different, but the programming model is familiar if you already use `async/await` in Node.js.

---

## 22. Service Layer

A larger FastAPI project may become:

```text
app/
├── main.py
├── routers/
│   └── agents.py
├── schemas/
│   └── agents.py
└── services/
    └── agent_service.py
```

Router:

```python
from fastapi import APIRouter
from app.services.agent_service import run_agent

router = APIRouter()

@router.post("/agent")
async def execute_agent():
    result = await run_agent()

    return result
```

Service:

```python
async def run_agent():
    return {
        "result": "Agent executed"
    }
```

This follows the same general architecture you may already use in Express:

```text
Route / Controller
        ↓
Service
        ↓
Database / External API / AI model
```

---

## 23. Typical Request Flow

For the current project:

```text
HTTP Request
     ↓
Uvicorn
     ↓
FastAPI
app/main.py
     ↓
Router
app/routers/*.py
     ↓
Pydantic Schema
app/schemas/*.py
     ↓
Service
     ↓
Database / LLM / External API
     ↓
JSON Response
```

Example health request:

```text
GET /health
    ↓
Uvicorn
    ↓
FastAPI app
    ↓
health router
    ↓
health_check()
    ↓
HealthResponse
    ↓
JSON
```

---

## 24. FastAPI in the Microservice Architecture

A possible architecture for this project:

```text
Frontend
    ↓
NestJS Main Backend
    ↓ HTTP / Internal API
FastAPI Agent Service
    ↓
Agent Logic
    ↓
LLM / Vector DB / External AI Services
```

NestJS can handle the main application/business backend while FastAPI handles Python/AI-specific workloads.

---

## 25. What to Learn First

Recommended order:

1. Python imports, functions, classes and type hints
2. `main.py` and `FastAPI()`
3. Uvicorn
4. `APIRouter`
5. Pydantic schemas
6. Path parameters
7. Query parameters
8. Request body
9. Response models
10. `async` / `await`
11. `Depends()` dependency injection
12. Services
13. Error handling with `HTTPException`
14. Middleware
15. Database integration
16. Testing

---

## Quick Commands

```bash
# Create virtual environment
python -m venv .venv

# Activate it in Git Bash
source .venv/Scripts/activate

# Install dependencies
python -m pip install -r requirements.txt

# Show installed packages
python -m pip list

# Check Uvicorn
python -m pip show uvicorn

# Start development server
python -m uvicorn app.main:app --reload
```

---

## Quick Mental Model

```text
Express                    FastAPI

server.js              →   main.py
express()              →   FastAPI()
express.Router()       →   APIRouter()
routes/                →   routers/
Zod / Joi              →   Pydantic
npm                    →   pip
package.json           →   requirements.txt / pyproject.toml
node_modules           →   .venv
nodemon                →   Uvicorn --reload
req.params             →   Path parameters
req.query              →   Query parameters
req.body               →   Pydantic model
res.json()             →   return dict
```
