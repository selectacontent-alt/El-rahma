# Visual Branding & Identity DRF Backend

Production-ready Django REST Framework module for the `/api/branding/` surface.

## Setup

```powershell
cd backend_drf
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
python manage.py makemigrations branding
python manage.py migrate
python manage.py check
```

Set `MYSQL_*` and `REDIS_URL` in `.env` before running migrations in a shared environment.

## Endpoints

- `GET /api/branding/blueprints/`
- `GET /api/branding/blueprints/{slug}/`
- `GET /api/branding/blueprint-steps/{id}/`
- `GET /api/branding/palettes/`
- `GET /api/branding/palettes/{slug}/mockup-map/`
- `GET /api/branding/portfolio/`
- `GET /api/branding/packages/`
- `POST /api/branding/packages/{slug}/inquire/`
- `POST /api/branding/inquiries/`
- `GET /api/branding/inquiries/{public_id}/`
- `PATCH /api/branding/inquiries/{public_id}/transition/`

All responses are rendered as:

```json
{
  "status": "success",
  "data": {},
  "meta": {},
  "errors": []
}
```
