const GEMINI_API_KEY = 'AIzaSyAO2d0TBweeQjBla7VsIiwf_ABHNez6s64';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

// Drop-in replacement for base44.integrations.Core.InvokeLLM
export async function InvokeLLM({ prompt, response_json_schema, file_urls }) {
  const parts = [];

  // Add image parts if file_urls provided
  if (file_urls && file_urls.length > 0) {
    for (const url of file_urls) {
      if (url) {
        try {
          const res = await fetch(url);
          const blob = await res.blob();
          const base64 = await blobToBase64(blob);
          parts.push({
            inline_data: {
              mime_type: blob.type || 'image/jpeg',
              data: base64.split(',')[1]
            }
          });
        } catch (e) {
          console.warn('Could not load image for Gemini:', url);
        }
      }
    }
  }

  parts.push({ text: prompt });

  const body = {
    contents: [{ parts }],
    generationConfig: {
      responseMimeType: 'application/json',
    }
  };

  if (response_json_schema) {
    body.generationConfig.responseSchema = response_json_schema;
  }

  const res = await fetch(
    `${GEMINI_BASE_URL}/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error: ${err}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// Drop-in replacement for base44.integrations.Core.GenerateImage
// Uses Imagen 3 via Gemini API
export async function GenerateImage({ prompt, existing_image_urls }) {
  const body = {
    instances: [{ prompt }],
    parameters: { sampleCount: 1 }
  };

  const res = await fetch(
    `${GEMINI_BASE_URL}/models/imagen-3.0-generate-002:predict?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }
  );

  if (!res.ok) {
    // Fallback: return a placeholder sketch URL if Imagen fails
    console.warn('Imagen API failed, using placeholder');
    return { url: null };
  }

  const data = await res.json();
  const base64Image = data.predictions?.[0]?.bytesBase64Encoded;

  if (base64Image) {
    const dataUrl = `data:image/png;base64,${base64Image}`;
    return { url: dataUrl };
  }

  return { url: null };
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
