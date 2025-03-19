import os
import requests

# Obtener credenciales de Kaggle desde las variables de entorno
KAGGLE_USERNAME = os.getenv("KAGGLE_USERNAME")
KAGGLE_KEY = os.getenv("KAGGLE_KEY")

if not KAGGLE_USERNAME or not KAGGLE_KEY:
    raise ValueError("❌ Error: No se encontraron las credenciales de Kaggle en las variables de entorno.")

# Endpoint de la API de Kaggle para obtener datos del usuario
KAGGLE_API_URL = f"https://www.kaggle.com/api/v1/users/{KAGGLE_USERNAME}.json"

# Autenticación con la API de Kaggle
response = requests.get(KAGGLE_API_URL, auth=(KAGGLE_USERNAME, KAGGLE_KEY))

if response.status_code != 200:
    raise Exception(f"❌ Error al obtener datos de Kaggle: {response.status_code} - {response.text}")

# Procesar la respuesta JSON
user_info = response.json()

# Extraer estadísticas relevantes
stats = {
    "Name": user_info.get("displayName", "N/A"),
    "Followers": user_info.get("followers", 0),
    "Following": user_info.get("following", 0),
    "Datasets": user_info.get("totalDatasets", 0),
    "Notebooks": user_info.get("totalScripts", 0),
    "Competitions": user_info.get("totalCompetitions", 0),
    "Medals": user_info.get("totalMedals", 0)
}

stats_esp = {
    "Nombre": user_info.get("displayName", "N/A"),
    "Seguidores": user_info.get("followers", 0),
    "Siguiendo": user_info.get("following", 0),
    "Datasets": user_info.get("totalDatasets", 0),
    "Cuadernos": user_info.get("totalScripts", 0),
    "Competiciones": user_info.get("totalCompetitions", 0),
    "Medallas": user_info.get("totalMedals", 0)
}

# Formatear salida en Markdown
stats_md = "\n".join([f"- **{key}**: {value}" for key, value in stats.items()])
stats_esp_md = "\n".join([f"- **{key}**: {value}" for key, value in stats_esp.items()])

# Escribir resultados en un archivo Markdown
with open("kaggle_stats.md", "w", encoding="utf-8") as file:
    file.write("## 📊 Kaggle Statistics\n")
    file.write(stats_md)
    file.write("\n")

with open("kaggle_stats_esp.md", "w", encoding="utf-8") as file:
    file.write("## 📊 Estadísticas de Kaggle\n")
    file.write(stats_esp_md)
    file.write("\n")

print("✅ Kaggle stats actualizadas correctamente.")