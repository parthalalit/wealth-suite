import os
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

# Supabase HS256 JWT Secret is provided in env in production
JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "mock_secret_for_local_dev")

def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """
    Validates the bearer token issued by Supabase.
    If running locally in mock dev environment, fails back gracefully to local test UUID.
    """
    token = credentials.credentials
    try:
        # Standard Supabase tokens use HS256
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"], options={"verify_aud": False})
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token payload is missing user identification identifier 'sub'"
            )
        return user_id
    except jwt.PyJWTError as e:
        # If running in local mockup configuration without a configured Supabase secret,
        # failback gracefully to a test customer UUID so the team can build without blockers.
        if JWT_SECRET == "mock_secret_for_local_dev":
            # Return a consistent test customer UUID for rapid local developers
            return "00000000-0000-0000-0000-000000000001"
        
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid secure session validation credentials: {str(e)}"
        )
