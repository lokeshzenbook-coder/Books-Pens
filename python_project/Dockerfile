FROM python:3.12-slim

WORKDIR /app

COPY python_project/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY python_project/ ./

EXPOSE 8000

CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
