import kaggle
import os
import json


# Crear el directorio de Kaggle si no existe
os.makedirs(os.path.expanduser("~/.kaggle"), exist_ok=True)

# Cargar credenciales desde una variable de entorno
kaggle_json = os.getenv("KAGGLE_JSON")

if not kaggle_json:
    raise ValueError("❌ ERROR: La variable de entorno 'KAGGLE_JSON' no está configurada.")

# Guardar `kaggle.json` en la ubicación correcta
kaggle_json_path = os.path.expanduser("~/.kaggle/kaggle.json")

with open(kaggle_json_path, "w") as f:
    f.write(kaggle_json)

# Asegurar permisos correctos
os.chmod(kaggle_json_path, 0o600)

# Inicializar la API de Kaggle
api = kaggle.KaggleApi()
api.authenticate() 

print("✅ Autenticación en Kaggle completada correctamente.")

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