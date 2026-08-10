from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from app.core.config import settings

# Create async engine with fallback to SQLite if PostgreSQL fails during local standalone testing
database_url = settings.DATABASE_URL
if database_url.startswith("sqlite"):
    engine = create_async_engine(database_url, echo=False)
else:
    engine = create_async_engine(database_url, pool_pre_ping=True, echo=False)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
