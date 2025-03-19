import os
import json
from kaggle.api.kaggle_api_extended import KaggleApi

# Leer kaggle.json manualmente
kaggle_path = os.path.expanduser("~/.kaggle/kaggle.json")

if not os.path.exists(kaggle_path):
    print("❌ ERROR: El archivo kaggle.json no existe.")
    exit(1)

with open(kaggle_path, "r") as f:
    creds = json.load(f)

# Depuración: Imprimir credenciales antes de la autenticación
print(f"🔍 Credenciales cargadas: {creds}")

# Verificar si el username y key existen
if "username" not in creds or "key" not in creds:
    print("❌ ERROR: El archivo kaggle.json no tiene username o key.")
    exit(1)

os.environ["KAGGLE_USERNAME"] = creds["username"]
os.environ["KAGGLE_KEY"] = creds["key"]

# Autenticar manualmente
api = KaggleApi()
api.authenticate()

print("✅ Autenticación en Kaggle completada correctamente.")

# Obtener información del usuario
user_info = api.user_details(creds["username"])
print(f"📊 Datos del usuario Kaggle: {user_info}")

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
    "Notebooks": user_info.get("totalScripts", 0),
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