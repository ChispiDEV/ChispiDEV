import kaggle
import os
import json

# Cargar credenciales de Kaggle
KAGGLE_USERNAME = os.getenv("KAGGLE_USERNAME")
KAGGLE_KEY = os.getenv("KAGGLE_KEY")

# Configurar la API de Kaggle
api = kaggle.KaggleApi()
api.authenticate()

# Obtener datos del usuario
user_metadata = api.metadata("users", KAGGLE_USERNAME)
user_info = json.loads(user_metadata)

# Extraer estadísticas relevantes
stats = {
    "Name": user_info["displayName"],
    "Followers": user_info["followers"],
    "Following": user_info["following"],
    "Datasets": user_info["totalDatasets"],
    "Notebooks": user_info["totalScripts"],
    "Competitions": user_info["totalCompetitions"],
    "Medals": user_info["totalMedals"]
}

stats_esp = {
    "Nombre": user_info["displayName"],
    "Seguidores": user_info["followers"],
    "Siguiendo": user_info["following"],
    "Datasets": user_info["totalDatasets"],
    "Cuadernos": user_info["totalScripts"],
    "Competiciones": user_info["totalCompetitions"],
    "Medallas": user_info["totalMedals"]
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