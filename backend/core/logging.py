import logging
import sys

def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(name)s - %(message)s",
        handlers=[
            logging.StreamHandler(sys.stdout),
            # You can add FileHandler here for logging to file
            # logging.FileHandler("app.log")
        ]
    )

    logger = logging.getLogger("backend")
    return logger

logger = setup_logging()

def log_login(user_email: str):
    logger.info(f"User login: {user_email}")

def log_resume_creation(user_id: str, resume_id: str):
    logger.info(f"Resume created: {resume_id} by User: {user_id}")

def log_ai_request(user_id: str, feature: str):
    logger.info(f"AI Request: {feature} by User: {user_id}")

def log_error(error_msg: str, context: dict = None):
    logger.error(f"Error: {error_msg} | Context: {context}")
