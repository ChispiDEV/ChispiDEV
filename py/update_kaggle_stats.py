import kaggle
import os

# Cargar credenciales de Kaggle
KAGGLE_USERNAME = os.getenv("KAGGLE_USERNAME")
KAGGLE_KEY = os.getenv("KAGGLE_KEY")
kaggle.api.authenticate()

# Obtener datos del perfil
user_data = kaggle.api.user_profile(KAGGLE_USERNAME)

# Extraer estadísticas relevantes
medals = user_data["totalMedals"]
datasets = user_data["datasets"]
notebooks = user_data["scripts"]
rank = user_data["competitionRank"]

# Crear contenido actualizado
stats_content = f"""
📊 **Kaggle Stats:**  
- 🏅 Medallas: {medals}  
- 📊 Datasets: {datasets}  
- 📖 Notebooks: {notebooks}  
- 🏆 Rank en Competencias: {rank}
"""

# Guardar las estadísticas en `kaggle_stats.md`
with open("assets/kaggle_stats.md", "w", encoding="utf-8") as file:
    file.write(stats_content)

# Leer el README.md
with open("README.md", "r", encoding="utf-8") as file:
    readme = file.readlines()

# Encontrar la sección de estadísticas
start_marker = "<!-- KAGGLE_STATS_START -->"
end_marker = "<!-- KAGGLE_STATS_END -->"

start_idx = readme.index(start_marker + "\n") + 1
end_idx = readme.index(end_marker + "\n", start_idx)

# Reemplazar el contenido entre los marcadores
readme[start_idx:end_idx] = [stats_content + "\n"]

# Escribir los cambios en el README.md
with open("README.md", "w", encoding="utf-8") as file:
    file.writelines(readme)

print("✅ README actualizado con estadísticas de Kaggle.")
