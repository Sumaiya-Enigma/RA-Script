from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import or_
import httpx
import logging

from app.db.session import get_db
from app.models.user import UserModel
from app.schemas.user import (
    UserCreate, UserLogin, GoogleAuthRequest, UserResponse,
    Token, UserUpdate, PasswordChange
)
from app.core.security import (
    get_password_hash, verify_password, create_access_token,
    create_refresh_token, get_current_user
)

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/auth/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
async def signup(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    # Check if username or email already exists
    result = await db.execute(
        select(UserModel).where(
            or_(UserModel.username == user_in.username, UserModel.email == user_in.email)
        )
    )
    existing_user = result.scalars().first()
    if existing_user:
        if existing_user.username == user_in.username:
            raise HTTPException(status_code=400, detail="Username already registered")
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = UserModel(
        username=user_in.username,
        email=user_in.email.lower(),
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name or user_in.username,
        role=user_in.role or "Senior Regulatory Affairs Manager",
        avatar_url=user_in.avatar_url,
        is_active=True
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    access_token = create_access_token(new_user.id)
    refresh_token = create_refresh_token(new_user.id)

    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        user=UserResponse.model_validate(new_user)
    )

@router.post("/auth/login", response_model=Token)
async def login(user_in: UserLogin, db: AsyncSession = Depends(get_db)):
    # Query user by username or email
    result = await db.execute(
        select(UserModel).where(
            or_(
                UserModel.username == user_in.username_or_email,
                UserModel.email == user_in.username_or_email.lower()
            )
        )
    )
    user = result.scalars().first()
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username/email or password")

    if not user.is_active:
        raise HTTPException(status_code=400, detail="User account is deactivated")

    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)

    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )

@router.post("/auth/google", response_model=Token)
async def google_auth(req: GoogleAuthRequest, db: AsyncSession = Depends(get_db)):
    user_email = req.email
    user_name = req.name or "Google User"
    user_picture = req.picture
    google_id = req.token[:32] if req.token else "google-id"

    # Verify ID Token with Google if token present
    if req.token and len(req.token) > 50:
        try:
            async with httpx.AsyncClient() as client:
                res = await client.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={req.token}")
                if res.status_code == 200:
                    data = res.json()
                    user_email = data.get("email", user_email)
                    user_name = data.get("name", user_name)
                    user_picture = data.get("picture", user_picture)
                    google_id = data.get("sub", google_id)
        except Exception as e:
            logger.warning(f"Google token verification failed, using token payload: {e}")

    if not user_email:
        raise HTTPException(status_code=400, detail="Google authentication failed: Email missing")

    user_email = user_email.lower()

    # Find existing user by google_id or email
    result = await db.execute(
        select(UserModel).where(
            or_(UserModel.google_id == google_id, UserModel.email == user_email)
        )
    )
    user = result.scalars().first()

    if not user:
        # Auto signup Google user
        base_username = user_email.split("@")[0]
        username = base_username
        counter = 1
        while True:
            uname_check = await db.execute(select(UserModel).where(UserModel.username == username))
            if not uname_check.scalars().first():
                break
            username = f"{base_username}{counter}"
            counter += 1

        user = UserModel(
            username=username,
            email=user_email,
            full_name=user_name,
            role="Senior Regulatory Affairs Manager",
            avatar_url=user_picture,
            google_id=google_id,
            is_active=True
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
    else:
        # Link google_id or update picture
        if not user.google_id:
            user.google_id = google_id
        if user_picture and not user.avatar_url:
            user.avatar_url = user_picture
        await db.commit()
        await db.refresh(user)

    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)

    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )

@router.get("/auth/me", response_model=UserResponse)
async def get_me(current_user: UserModel = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)

@router.put("/users/profile", response_model=UserResponse)
async def update_profile(
    user_update: UserUpdate,
    current_user: UserModel = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if user_update.username and user_update.username != current_user.username:
        result = await db.execute(select(UserModel).where(UserModel.username == user_update.username))
        if result.scalars().first():
            raise HTTPException(status_code=400, detail="Username already in use")
        current_user.username = user_update.username

    if user_update.email and user_update.email != current_user.email:
        result = await db.execute(select(UserModel).where(UserModel.email == user_update.email.lower()))
        if result.scalars().first():
            raise HTTPException(status_code=400, detail="Email already in use")
        current_user.email = user_update.email.lower()

    if user_update.full_name is not None:
        current_user.full_name = user_update.full_name
    if user_update.role is not None:
        current_user.role = user_update.role
    if user_update.avatar_url is not None:
        current_user.avatar_url = user_update.avatar_url

    await db.commit()
    await db.refresh(current_user)
    return UserResponse.model_validate(current_user)

@router.put("/users/change-password")
async def change_password(
    pwd_in: PasswordChange,
    current_user: UserModel = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if not current_user.hashed_password:
        raise HTTPException(status_code=400, detail="OAuth users cannot change password directly")

    if not verify_password(pwd_in.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect current password")

    current_user.hashed_password = get_password_hash(pwd_in.new_password)
    await db.commit()
    return {"message": "Password updated successfully"}
