# app/services/epa_data.py
import httpx
from typing import Dict, List, Optional
import json

class EPADataService:
    def __init__(self):
        self.base_url = "https://data.epa.gov/efservice"

    async def get_location_data(self, zip_code: str) -> Dict:
        """Fetch environmental data for a specific ZIP code"""
        try:
            # Get geo data for the ZIP code
            geo_data = await self._fetch_geo_data(zip_code)
            
            # Get facilities and environmental data
            facilities = await self._fetch_facilities(zip_code)
            air_quality = await self._fetch_air_quality(zip_code)
            water_quality = await self._fetch_water_quality(zip_code)
            
            return {
                "geo_data": geo_data,
                "facilities": facilities,
                "air_quality": air_quality,
                "water_quality": water_quality
            }
        except Exception as e:
            print(f"Error fetching EPA data: {str(e)}")
            raise

    async def _fetch_geo_data(self, zip_code: str) -> Dict:
        """Fetch geographical data for ZIP code"""
        url = f"{self.base_url}/lookups.mv_new_geo_best_picks/postal_code/equals/{zip_code}"
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            if response.status_code == 200:
                return response.json()
            return {}

    async def _fetch_facilities(self, zip_code: str) -> List:
        """Fetch nearby facilities and their environmental data"""
        url = f"{self.base_url}/frs.frs_facility_site/zip/equals/{zip_code}"
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            if response.status_code == 200:
                return response.json()
            return []

    async def _fetch_air_quality(self, zip_code: str) -> Dict:
        """Fetch air quality data for ZIP code area"""
        # Using EPA's Air Quality System data
        url = f"{self.base_url}/icis.icis_comp_monitor/comp_monitor_category_code/equals/AIR/zip/equals/{zip_code}"
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            if response.status_code == 200:
                return self._process_air_quality_data(response.json())
            return {}

    async def _fetch_water_quality(self, zip_code: str) -> Dict:
        """Fetch water quality data for ZIP code area"""
        url = f"{self.base_url}/sdw.water_system/zip/equals/{zip_code}"
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            if response.status_code == 200:
                return self._process_water_quality_data(response.json())
            return {}

    def _process_air_quality_data(self, data: List) -> Dict:
        """Process raw air quality data into a usable format"""
        if not data:
            return {}

        return {
            "measurements": data,
            "summary": {
                "total_facilities": len(data),
                "compliance_status": self._calculate_compliance_status(data)
            }
        }

    def _process_water_quality_data(self, data: List) -> Dict:
        """Process raw water quality data into a usable format"""
        if not data:
            return {}

        return {
            "systems": data,
            "summary": {
                "total_systems": len(data),
                "compliance_status": self._calculate_compliance_status(data)
            }
        }

    def _calculate_compliance_status(self, data: List) -> Dict:
        """Calculate compliance statistics from facility data"""
        total = len(data)
        if total == 0:
            return {"compliant": 0, "non_compliant": 0, "percent_compliant": 0}

        compliant = sum(1 for item in data if self._is_compliant(item))
        return {
            "compliant": compliant,
            "non_compliant": total - compliant,
            "percent_compliant": round((compliant / total) * 100, 2)
        }

    def _is_compliant(self, facility: Dict) -> bool:
        """Determine if a facility is compliant based on its data"""
        # This would need to be customized based on actual EPA data structure
        return True  # Placeholder