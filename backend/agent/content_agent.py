
import json
import os

from dotenv import load_dotenv
from groq import Groq

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")
MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")

if not api_key:
    raise ValueError("GROQ_API_KEY is missing from backend/.env")

client = Groq(api_key=api_key)


def generate_carousel_content(
    topic: str,
    platform: str = "Instagram",
    audience: str = "General audience",
    tone: str = "Educational",
    slide_count: int = 6,
):
    if not topic.strip():
        raise ValueError("Topic cannot be empty.")

    if not 3 <= slide_count <= 10:
        raise ValueError("Slide count must be between 3 and 10.")

    system_prompt = """
You are an expert social media content strategist.

Your task is to create high-quality Instagram and LinkedIn carousel content.

Follow these rules:
- Create engaging, clear and useful content.
- Start with a strong hook.
- Keep each slide concise and readable.
- Maintain a logical flow between slides.
- Include practical and actionable information.
- End with a relevant call to action.
- Do not invent statistics, studies, sources or factual claims.
- If information requires external verification, mention it in research_notes.

Return ONLY valid JSON in this format:

{
  "title": "Carousel title",
  "topic": "Topic",
  "platform": "Platform",
  "audience": "Target audience",
  "slides": [
    {
      "slide_number": 1,
      "headline": "Slide headline",
      "body": "Slide content",
      "visual_direction": "Suggested visual layout"
    }
  ],
  "caption": "Social media caption",
  "hashtags": ["hashtag1", "hashtag2"],
  "cta": "Final call to action",
  "research_notes": [
    "Information that should be verified externally"
  ]
}
"""

    user_prompt = f"""
Create a {slide_count}-slide social media carousel.

Topic: {topic}
Platform: {platform}
Target audience: {audience}
Tone: {tone}

Generate exactly {slide_count} slides.
Make the content relevant to the platform and audience.
"""

    completion = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        response_format={"type": "json_object"},
        temperature=0.7,
        max_completion_tokens=4000,
    )

    response = completion.choices[0].message.content

    if not response:
        raise RuntimeError("Groq returned an empty response.")

    result = json.loads(response)

    if len(result.get("slides", [])) != slide_count:
        raise RuntimeError("AI did not generate the requested number of slides.")

    return result
