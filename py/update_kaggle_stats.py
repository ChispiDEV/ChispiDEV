import os
import json
import requests
from kaggle.api.kaggle_api_extended import KaggleApi

# Leer kaggle.json manualmente
kaggle_path = os.path.expanduser("~/.kaggle/kaggle.json")

if not os.path.exists(kaggle_path):
    print("❌ ERROR: El archivo kaggle.json no existe.")
    exit(1)

with open(kaggle_path, "r") as f:
    creds = json.load(f)

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
profile_url = f"https://www.kaggle.com/{creds['username']}"
response = requests.get(profile_url)

if response.status_code == 200:
    print(f"✅ Perfil de usuario Kaggle disponible: {profile_url}")
else:
    print(f"❌ ERROR: No se pudo acceder a {profile_url}")
    exit(1)


# Formatear salida en Markdown
stats_md = f"## 📊 Kaggle Statistics\n- **Perfil**: [Ver perfil]({profile_url})\n"
stats_esp_md = f"## 📊 Estadísticas de Kaggle\n- **Perfil**: [Ver perfil]({profile_url})\n"

# Escribir resultados en un archivo Markdown
with open("kaggle_stats.md", "w", encoding="utf-8") as file:
    file.write(stats_md)

with open("kaggle_stats_esp.md", "w", encoding="utf-8") as file:
    file.write(stats_esp_md)

print("✅ Kaggle stats actualizadas correctamente.")