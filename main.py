from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import date
from typing import Optional
import pyodbc

app = FastAPI(title="API Auditorías Automotriz")

# Configurar CORS para permitir peticiones desde tu frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especifica tu dominio
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuración de conexión a SQL Server
SERVER = 'ASISTENTE-TEC'  # Ajusta según tu servidor
DATABASE = 'Automotriz'
USERNAME = ''  # Déjalo vacío si usas autenticación de Windows
PASSWORD = ''  # Déjalo vacío si usas autenticación de Windows

def get_db_connection():
    """Crea conexión a SQL Server"""
    try:
        if USERNAME and PASSWORD:
            # Autenticación SQL Server
            conn_str = f'DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={SERVER};DATABASE={DATABASE};UID={USERNAME};PWD={PASSWORD}'
        else:
            # Autenticación Windows
            conn_str = f'DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={SERVER};DATABASE={DATABASE};Trusted_Connection=yes;'
        
        conn = pyodbc.connect(conn_str)
        return conn
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error de conexión: {str(e)}")

# =============================================
# MODELOS PYDANTIC
# =============================================
class AuditoriaCreate(BaseModel):
    empresa_id: int
    marca_id: int
    local_id: int
    evaluacion_id: int
    auditor: str
    fecha: date
    estado: str = "Pendiente"

class AuditoriaUpdate(BaseModel):
    empresa_id: Optional[int] = None
    marca_id: Optional[int] = None
    local_id: Optional[int] = None
    evaluacion_id: Optional[int] = None
    auditor: Optional[str] = None
    fecha: Optional[date] = None
    estado: Optional[str] = None

class RespuestaCreate(BaseModel):
    pregunta_id: int
    respuesta: int  # 1 = Sí, 0 = No
    comentario: Optional[str] = None
    como_valido: Optional[str] = None

class EmpresaCreate(BaseModel):
    nombre: str

class MarcaCreate(BaseModel):
    nombre: str

class LocalCreate(BaseModel):
    nombre: str
    direccion: Optional[str] = None

# =============================================
# ENDPOINTS PRINCIPALES
# =============================================

@app.get("/")
def read_root():
    return {"message": "API de Auditorías Automotriz - Funcionando ✅"}

# -------- EMPRESAS --------
@app.get("/empresas")
def get_empresas():
    """Obtener todas las empresas usando SP"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("EXEC sp_ListarEmpresas")
        empresas = []
        for row in cursor.fetchall():
            empresas.append({
                "id": row.id,
                "nombre": row.nombre
            })
        return empresas
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener empresas: {str(e)}")
    finally:
        conn.close()

@app.post("/empresas")
def create_empresa(empresa: EmpresaCreate):
    """Crear nueva empresa usando SP"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("EXEC sp_CrearEmpresa @nombre=?", empresa.nombre)
        cursor.execute("SELECT @@IDENTITY")
        new_id = cursor.fetchone()[0]
        conn.commit()
        return {"message": "Empresa creada exitosamente", "id": int(new_id)}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Error al crear empresa: {str(e)}")
    finally:
        conn.close()

# -------- MARCAS --------
@app.get("/marcas")
def get_marcas():
    """Obtener todas las marcas usando SP"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("EXEC sp_ListarMarcas")
        marcas = []
        for row in cursor.fetchall():
            marcas.append({
                "id": row.id,
                "nombre": row.nombre
            })
        return marcas
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener marcas: {str(e)}")
    finally:
        conn.close()

@app.post("/marcas")
def create_marca(marca: MarcaCreate):
    """Crear nueva marca usando SP"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("EXEC sp_CrearMarca @nombre=?", marca.nombre)
        cursor.execute("SELECT @@IDENTITY")
        new_id = cursor.fetchone()[0]
        conn.commit()
        return {"message": "Marca creada exitosamente", "id": int(new_id)}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Error al crear marca: {str(e)}")
    finally:
        conn.close()

# -------- LOCALES --------
@app.get("/locales")
def get_locales():
    """Obtener todos los locales usando SP"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("EXEC sp_ListarLocales")
        locales = []
        for row in cursor.fetchall():
            locales.append({
                "id": row.id,
                "nombre": row.nombre,
                "direccion": row.direccion
            })
        return locales
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener locales: {str(e)}")
    finally:
        conn.close()

@app.post("/locales")
def create_local(local: LocalCreate):
    """Crear nuevo local usando SP"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("EXEC sp_CrearLocal @nombre=?, @direccion=?", 
                      local.nombre, local.direccion)
        cursor.execute("SELECT @@IDENTITY")
        new_id = cursor.fetchone()[0]
        conn.commit()
        return {"message": "Local creado exitosamente", "id": int(new_id)}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Error al crear local: {str(e)}")
    finally:
        conn.close()

# -------- TIPOS DE EVALUACIÓN --------
@app.get("/tipos-evaluacion")
def get_tipos_evaluacion():
    """Obtener todos los tipos de evaluación usando SP"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("EXEC sp_ListarTiposEvaluacion")
        tipos = []
        for row in cursor.fetchall():
            tipos.append({
                "id": row.id,
                "nombre": row.nombre,
                "descripcion": row.descripcion
            })
        return tipos
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener tipos de evaluación: {str(e)}")
    finally:
        conn.close()

# -------- AUDITORÍAS --------
@app.get("/auditorias")
def get_auditorias():
    """Obtener todas las auditorías usando SP"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("EXEC sp_ListarAuditorias")
        auditorias = []
        for row in cursor.fetchall():
            auditorias.append({
                "id": row.id,
                "empresa_id": row.empresa_id,
                "marca_id": row.marca_id,
                "local_id": row.local_id,
                "evaluacion_id": row.evaluacion_id,
                "empresa": row.empresa,
                "marca": row.marca,
                "local": row.local,
                "evaluacion": row.evaluacion,
                "auditor": row.auditor,
                "fecha": str(row.fecha),
                "estado": row.estado,
                "cumplimiento_porcentaje": float(row.cumplimiento_porcentaje) if row.cumplimiento_porcentaje else None,
                "fecha_creacion": str(row.fecha_creacion)
            })
        return auditorias
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener auditorías: {str(e)}")
    finally:
        conn.close()

@app.get("/auditorias/{auditoria_id}")
def get_auditoria(auditoria_id: int):
    """Obtener una auditoría específica usando SP"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("EXEC sp_ObtenerAuditoria @id=?", auditoria_id)
        row = cursor.fetchone()
        
        if not row:
            raise HTTPException(status_code=404, detail="Auditoría no encontrada")
        
        return {
            "id": row.id,
            "empresa_id": row.empresa_id,
            "marca_id": row.marca_id,
            "local_id": row.local_id,
            "evaluacion_id": row.evaluacion_id,
            "empresa": row.empresa,
            "marca": row.marca,
            "local": row.local,
            "evaluacion": row.evaluacion,
            "auditor": row.auditor,
            "fecha": str(row.fecha),
            "estado": row.estado,
            "cumplimiento_porcentaje": float(row.cumplimiento_porcentaje) if row.cumplimiento_porcentaje else None,
            "fecha_creacion": str(row.fecha_creacion)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener auditoría: {str(e)}")
    finally:
        conn.close()

@app.post("/auditorias")
def create_auditoria(auditoria: AuditoriaCreate):
    """Crear nueva auditoría usando SP"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute(
            "EXEC sp_CrearAuditoria @empresa_id=?, @marca_id=?, @local_id=?, @evaluacion_id=?, @auditor=?, @fecha=?, @estado=?",
            auditoria.empresa_id,
            auditoria.marca_id,
            auditoria.local_id,
            auditoria.evaluacion_id,
            auditoria.auditor,
            auditoria.fecha,
            auditoria.estado
        )
        
        # Obtener el ID insertado
        row = cursor.fetchone()
        new_id = int(row[0]) if row else None
        
        conn.commit()
        return {"message": "Auditoría creada exitosamente", "id": new_id}
    except pyodbc.Error as e:
        conn.rollback()
        error_message = str(e)
        if "no existe o está inactiva" in error_message or "no existe o está inactivo" in error_message:
            raise HTTPException(status_code=400, detail=error_message)
        raise HTTPException(status_code=500, detail=f"Error al crear auditoría: {error_message}")
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Error al crear auditoría: {str(e)}")
    finally:
        conn.close()

@app.put("/auditorias/{auditoria_id}")
def update_auditoria(auditoria_id: int, auditoria: AuditoriaUpdate):
    """Actualizar auditoría usando SP"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute(
            """EXEC sp_ActualizarAuditoria 
               @id=?, @empresa_id=?, @marca_id=?, @local_id=?, 
               @evaluacion_id=?, @auditor=?, @fecha=?, @estado=?""",
            auditoria_id,
            auditoria.empresa_id,
            auditoria.marca_id,
            auditoria.local_id,
            auditoria.evaluacion_id,
            auditoria.auditor,
            auditoria.fecha,
            auditoria.estado
        )
        
        row = cursor.fetchone()
        filas_afectadas = row[0] if row else 0
        
        if filas_afectadas == 0:
            raise HTTPException(status_code=404, detail="Auditoría no encontrada")
        
        conn.commit()
        return {"message": "Auditoría actualizada exitosamente"}
    except HTTPException:
        raise
    except pyodbc.Error as e:
        conn.rollback()
        error_message = str(e)
        if "no existe" in error_message:
            raise HTTPException(status_code=404, detail=error_message)
        raise HTTPException(status_code=500, detail=f"Error al actualizar auditoría: {error_message}")
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Error al actualizar auditoría: {str(e)}")
    finally:
        conn.close()

@app.delete("/auditorias/{auditoria_id}")
def delete_auditoria(auditoria_id: int):
    """Eliminar auditoría usando SP"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("EXEC sp_EliminarAuditoria @id=?", auditoria_id)
        
        row = cursor.fetchone()
        filas_eliminadas = row[0] if row else 0
        
        if filas_eliminadas == 0:
            raise HTTPException(status_code=404, detail="Auditoría no encontrada")
        
        conn.commit()
        return {"message": "Auditoría eliminada exitosamente"}
    except HTTPException:
        raise
    except pyodbc.Error as e:
        conn.rollback()
        error_message = str(e)
        if "no existe" in error_message:
            raise HTTPException(status_code=404, detail=error_message)
        raise HTTPException(status_code=500, detail=f"Error al eliminar auditoría: {error_message}")
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Error al eliminar auditoría: {str(e)}")
    finally:
        conn.close()

# =============================================
# ENDPOINTS PARA PREGUNTAS Y RESPUESTAS
# =============================================

@app.get("/auditorias/{auditoria_id}/preguntas")
def get_preguntas_auditoria(auditoria_id: int):
    """Obtener todas las preguntas con sus respuestas para una auditoría"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("EXEC sp_ObtenerPreguntasAuditoria @auditoria_id=?", auditoria_id)
        preguntas = []
        for row in cursor.fetchall():
            preguntas.append({
                "categoria_id": row.categoria_id,
                "categoria_nombre": row.categoria_nombre,
                "pregunta_id": row.pregunta_id,
                "pregunta": row.pregunta,
                "orden": row.orden,
                "respuesta_id": row.respuesta_id,
                "respuesta": bool(row.respuesta) if row.respuesta is not None else None,
                "comentario": row.comentario,
                "como_valido": row.como_valido
            })
        return preguntas
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener preguntas: {str(e)}")
    finally:
        conn.close()

@app.post("/auditorias/{auditoria_id}/respuestas")
def guardar_respuesta(auditoria_id: int, respuesta: RespuestaCreate):
    """Guardar o actualizar respuesta de una pregunta"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute(
            """EXEC sp_GuardarRespuesta 
               @auditoria_id=?, @pregunta_id=?, @respuesta=?, @comentario=?, @como_valido=?""",
            auditoria_id,
            respuesta.pregunta_id,
            respuesta.respuesta,
            respuesta.comentario,
            respuesta.como_valido
        )
        
        row = cursor.fetchone()
        respuesta_id = int(row[0]) if row else None
        
        conn.commit()
        return {"message": "Respuesta guardada exitosamente", "id": respuesta_id}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Error al guardar respuesta: {str(e)}")
    finally:
        conn.close()

@app.post("/auditorias/{auditoria_id}/calcular-cumplimiento")
def calcular_cumplimiento(auditoria_id: int):
    """Calcular el porcentaje de cumplimiento de una auditoría"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("EXEC sp_CalcularCumplimiento @auditoria_id=?", auditoria_id)
        row = cursor.fetchone()
        
        if not row:
            raise HTTPException(status_code=404, detail="No se pudo calcular el cumplimiento")
        
        conn.commit()
        
        return {
            "total_preguntas": row.total_preguntas,
            "respuestas_positivas": row.respuestas_positivas,
            "cumplimiento_porcentaje": float(row.cumplimiento_porcentaje)
        }
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Error al calcular cumplimiento: {str(e)}")
    finally:
        conn.close()

@app.get("/auditorias/{auditoria_id}/resumen")
def get_resumen_auditoria(auditoria_id: int):
    """Obtener resumen de resultados por categoría"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("EXEC sp_ObtenerResumenAuditoria @auditoria_id=?", auditoria_id)
        resumen = []
        for row in cursor.fetchall():
            resumen.append({
                "categoria": row.categoria,
                "total_preguntas": row.total_preguntas,
                "respuestas_si": row.respuestas_si,
                "porcentaje_cumplimiento": float(row.porcentaje_cumplimiento) if row.porcentaje_cumplimiento else 0
            })
        return resumen
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener resumen: {str(e)}")
    finally:
        conn.close()

# =============================================
# ENDPOINT DE SALUD
# =============================================
@app.get("/health")
def health_check():
    """Verificar que la API y la base de datos están funcionando"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        cursor.fetchone()
        conn.close()
        return {
            "status": "healthy",
            "database": "connected",
            "message": "API funcionando correctamente"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }

# Ejecutar con: uvicorn main:app --reload