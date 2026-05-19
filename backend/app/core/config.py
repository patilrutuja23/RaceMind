from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "RaceMind AI"
    app_version: str = "1.0.0"
    debug: bool = False
    allowed_origins: str = "http://localhost:5173"
    csv_path: str = "data/telemetry.csv"

    # IBM watsonx.ai (legacy — kept for reference)
    ibm_api_key: str = "mock"
    ibm_wx_url: str = "https://us-south.ml.cloud.ibm.com"
    ibm_project_id: str = "mock-project-id"

    # Hugging Face Inference API
    hf_api_key: str = "mock"
    hf_model_id: str = "ibm-granite/granite-3.3-8b-instruct"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def origins_list(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",")]


settings = Settings()
