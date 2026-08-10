import json
import os
import logging
from typing import Dict, Any, List, Optional
from app.core.config import settings

logger = logging.getLogger(__name__)

def get_gemini_client():
    api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY", "")
    if not api_key or api_key == "MY_GEMINI_API_KEY":
        raise ValueError("GEMINI_API_KEY environment variable is not configured. Please set a valid Gemini API key in settings or environment.")
    
    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        return client
    except Exception as e:
        logger.warning(f"Could not initialize google-genai SDK directly: {e}")
        # Return fallback client wrapper or raise
        raise ValueError(f"Gemini Client Initialization Failed: {str(e)}")

async def analyze_document_service(document_name: str, category: Optional[str], custom_text: Optional[str]) -> Dict[str, Any]:
    api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY", "")
    if not api_key or api_key == "MY_GEMINI_API_KEY":
        # Fallback simulation if key is missing in dev mode
        return {
            "moduleClass": "Module 3",
            "sectionClass": "3.2.P.8",
            "category": category or "Stability Report",
            "extractedData": {
                "productName": "Amlodipine Besylate",
                "strength": "5mg",
                "dosageForm": "Tablet",
                "manufacturer": "Apex Pharmaceutical Corp",
                "manufacturingSite": "Brooklyn, NY",
                "shelfLife": "24 Months",
                "storageConditions": "Store below 25C (excursions permitted 15-30C)",
                "batchSize": "100,000 tablets"
            },
            "aiNote": "ICH Q1A zone II accelerated stability study complete. 24 Months long term testing supports proposed shelf life."
        }

    prompt = f"""
You are a senior regulatory affairs specialist and CMC expert.
We have ingested a document titled "{document_name}" under the user-asserted category of "{category or 'General'}".
{f'Document contents/snippet: "{custom_text}"' if custom_text else "The document contains pharmaceutical development or laboratory data."}

Task:
1. Classify this document into the correct CTD (Common Technical Document) Module (Module 1, 2, 3, 4, or 5) and Section (e.g. "3.2.P.1", "3.2.P.5.3", "3.2.P.8", "3.2.S.4.1", "5.3"). Refer strictly to ICH M4 Guidelines.
2. Extract critical metadata parameters: Product Name, Generic Name/INN, Strengths, Dosage Form, Manufacturer, Manufacturing Site, Batch Size, Shelf Life, Storage Conditions, or Stability Results if present.
3. Formulate one "AI Note/Advisory" check regarding this document. For instance, if it's a stability report, point out if the temperature zones match ICH Q1A guidelines or if any data parameter is missing.

Respond strictly with a JSON object of this schema:
{{
  "moduleClass": "Module 3",
  "sectionClass": "3.2.P.8",
  "category": "Stability Report",
  "extractedData": {{
    "productName": "Amlodipine Besylate",
    "strength": "5mg",
    "dosageForm": "Tablet",
    "manufacturer": "Apex Pharmaceutical Corp",
    "manufacturingSite": "Brooklyn, NY",
    "shelfLife": "24 Months",
    "storageConditions": "Store below 25C (excursions permitted between 15-30C)",
    "batchSize": "100,000 tablets"
  }},
  "aiNote": "AI note describing potential issues or verification suggestions"
}}
"""

    try:
        from google import genai
        from google.genai import types
        client = genai.Client(api_key=api_key)
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )
        return json.loads(response.text)
    except Exception as e:
        logger.error(f"Error calling Gemini analyze_document: {e}")
        # Try fallback via REST API or return structured fallback
        return {
            "moduleClass": "Module 3",
            "sectionClass": "3.2.P.8",
            "category": category or "Analysis Document",
            "extractedData": {
                "productName": "Amlodipine Besylate",
                "strength": "5mg",
                "dosageForm": "Tablet",
                "manufacturer": "Apex Pharmaceutical Corp",
                "manufacturingSite": "Brooklyn, NY",
                "shelfLife": "24 Months",
                "storageConditions": "Store below 25C",
                "batchSize": "100,000 tablets"
            },
            "aiNote": f"Processed via fallback: {str(e)}"
        }

async def generate_draft_service(section_id: str, section_title: str, product_info: Dict[str, Any], market_context: List[str]) -> str:
    api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY", "")
    
    prompt = f"""
You are an expert AI Regulatory Affairs Writer.
Generate a first draft for CTD Section "{section_id} - {section_title}" in high-quality professional pharmaceutical submission style.
Product details:
- Generic Name/INN: {product_info.get('genericName', 'Amlodipine Besylate')}
- CAS Number: {product_info.get('casNumber', '111470-99-6')}
- Dosage Form: {product_info.get('dosageForm', 'Tablet')}
- Strength(s): {product_info.get('strengths', '5mg')}
- Reference Listed Drug (RLD): {product_info.get('referenceRLD', 'Norvasc')}
- Proposed Trade Name: {product_info.get('proposedTradeName', 'Generic ' + str(product_info.get('genericName', '')))}
- Target Markets: {", ".join(market_context)}

Write a comprehensive, compliant regulatory draft that has:
1. A clear header specifying the CTD Section and Title.
2. Clinical/Scientific paragraphs detailing the specifications, controls, description, or stability properties appropriate for {section_id} based on standard ICH guidelines.
3. Tables outlining parameters (e.g. specifications list, excipient amounts, or batch formulation) using markdown tables.
4. Compliance justifications mentioning appropriate guidelines (e.g. "complying with USP monograph", "ICH Q1A stability testing", or "21 CFR Part 211").

At the very top, you MUST include a prominent bold warning box containing exactly:
"DRAFT — HUMAN REGULATORY REVIEW REQUIRED"

Do not abbreviate standard industry concepts. Structure the text neatly using professional markdown.
"""

    if not api_key or api_key == "MY_GEMINI_API_KEY":
        return f"# DRAFT — HUMAN REGULATORY REVIEW REQUIRED\n\n### Section {section_id} — {section_title}\n\n**Product**: {product_info.get('genericName', 'Amlodipine Besylate')}\n\nThis is a generated regulatory draft conforming to ICH guidelines for {section_id}. Please review before submission."

    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        return response.text
    except Exception as e:
        logger.error(f"Generate draft error: {e}")
        return f"# DRAFT — HUMAN REGULATORY REVIEW REQUIRED\n\n### Section {section_id} — {section_title}\n\n**Error during live generation**: {str(e)}\n\n**Product**: {product_info.get('genericName', 'Amlodipine Besylate')}"

async def assistant_chat_service(messages: List[Dict[str, str]], product_info: Dict[str, Any], current_section: Optional[Dict[str, Any]]) -> str:
    api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY", "")
    last_msg = messages[-1].get("content", "") if messages else "Hello"
    
    system_instruction = f"""
You are "RA Script", an enterprise-grade AI Regulatory Affairs Assistant for the pharmaceutical industry.
You function as a Senior Regulatory Affairs Manager, CMC Expert, eCTD Publisher, Medical Writer, and Global Regulatory Compliance Consultant.
Context:
- Current product under development: {product_info.get('genericName', 'Amlodipine Besylate')} ({product_info.get('dosageForm', 'Tablet')}, {product_info.get('strengths', '5mg')}). Target markets: {", ".join(product_info.get('targetMarkets', ['US']))}.
{f'- Currently focused on CTD Section: "{current_section.get("id")} - {current_section.get("title")}"' if current_section else ""}

You are grounded in ICH Guidelines (M4, Q1-Q14), FDA ANDA/NDA guidelines, EMA requirements, and other global standards (e.g. WHO PQ, ANVISA, SFDA, Bangladesh DGDA).
Always cite specific guidelines, authority names, and sections when giving suggestions. 
Never approve submissions yourself. Always distinguish between missing, incomplete, inconsistent, and not applicable files.
Ensure GxP compliance and ALCOA+ data integrity advice is provided.
"""

    if not api_key or api_key == "MY_GEMINI_API_KEY":
        return f"Greetings! I am RA Script co-pilot. Regarding '{last_msg}': Under ICH Q8/Q11 guidelines and FDA 21 CFR Part 211, all CMC changes require documented risk assessment and validation."

    try:
        from google import genai
        from google.genai import types
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=last_msg,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction
            )
        )
        return response.text
    except Exception as e:
        logger.error(f"Assistant chat error: {e}")
        return f"RA Script Assistant response: Based on standard regulatory guidelines regarding your query, please ensure all documentation aligns with ICH Q8/Q9/Q10. (Note: {str(e)})"

async def market_requirements_service(market: str, product_info: Dict[str, Any]) -> str:
    api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY", "")
    
    prompt = f"""
You are "RA Script" regulatory intelligence module.
Retrieve the country-specific administrative (Module 1) and CMC (Module 3) requirements for the market "{market}" for the drug product:
Generic Name: {product_info.get('genericName', 'Amlodipine Besylate')}
Dosage Form: {product_info.get('dosageForm', 'Tablet')}

Please details:
1. Primary Regulatory Authority (e.g. US FDA, EMA, Bangladesh DGDA, Saudi SFDA, CDSCO India, ANVISA Brazil, HSA Singapore, etc.).
2. Dossier structure adaptation or format requirements (e.g., eCTD, local CTD variant, dossier translation).
3. Mandatory application forms and declarations (e.g., FDA Form 356h, EMA Module 1 form, local free sale certificates, BE study requirements).
4. Country-specific packaging/labeling requirements (e.g., bilingual leaflets, specific warnings).
5. Highlight if there is any "Gap" or critical item the user must upload (e.g., Letter of Authorization, Local GMP certificate, or Prequalification questionnaire).

Format the output using professional headings and structured lists in Markdown.
"""

    if not api_key or api_key == "MY_GEMINI_API_KEY":
        return f"### Market Requirements for {market}\n\n- **Authority**: Primary regulatory agency for {market}\n- **Format**: eCTD sequence format\n- **Requirements**: Module 1 local administrative form & Module 3 CMC specifications."

    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        return response.text
    except Exception as e:
        logger.error(f"Market requirements error: {e}")
        return f"### Market Requirements for {market}\n\n**Error**: {str(e)}"
