
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Helper function to convert File to a base64 string and format it for the API
const fileToGenerativePart = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      if (!base64Data) {
        reject(new Error("Failed to read file as base64."));
        return;
      }
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type
        }
      });
    };
    reader.onerror = (error) => reject(error);
  });
};


const buildPrompt = (tlfShell?: string): string => {
    const coreInstructions = `You are an expert senior clinical SAS programmer with over 20 years of experience in the pharmaceutical industry. 
Your task is to generate a complete, high-quality, and ready-to-run SAS starter program.

The generated SAS program MUST adhere to the following best practices:
1.  **Header Documentation Block:** Include a comprehensive header with sections for Program Name, Project, Author, Date, Purpose, and Input/Output Datasets. Use placeholder values where appropriate.
2.  **Macro-Based Parameters:** Use macro variables for key parameters like study ID, analysis dataset name, and output path to make the program flexible and easy to update.
3.  **Dataset Validation:** Include a preliminary step to check for the existence of the input dataset and key variables.
4.  **Traceability Comments:** Add comments throughout the code to link specific programming steps back to the requirements in the mock shell.
5.  **Clear Structure:** Organize the code into logical sections (e.g., Initialization, Data Import/Preparation, Data Manipulation, PROC REPORT/GPLOT, Output Generation).
6.  **Readable and Well-Formatted:** Use proper indentation, spacing, and clear variable names.
7.  **No Placeholder Logic:** Generate actual, runnable SAS code for the described manipulations and procedures. Do not use comments like '/* Add logic here */'. Infer the logic from the shell description. The code should be complete and executable assuming the input data exists.`;

    if (tlfShell) {
        return `${coreInstructions}

The program should be based on the provided Table, Listing, or Figure (TLF) mock shell:
---
${tlfShell}
---

Generate the complete SAS program now.`;
    }

    return `${coreInstructions}

First, analyze the provided image, which is a screenshot or picture of a Table, Listing, or Figure (TLF) mock shell. Perform OCR to accurately extract all text and structural information from the image.

After extracting the requirements from the image, generate the SAS program based on those extracted specifications.

Analyze the image and generate the complete SAS program now.`;
}

interface GenerateSasCodeParams {
    tlfShell: string;
    file: File | null;
}

export async function* generateSasCode({ tlfShell, file }: GenerateSasCodeParams): AsyncGenerator<string> {
    // Switched to gemini-2.5-flash for faster responses
    const model = 'gemini-2.5-flash';
    try {
        let stream;
        if (file) {
            const imagePart = await fileToGenerativePart(file);
            const promptPart = { text: buildPrompt() };
            stream = await ai.models.generateContentStream({
                model,
                contents: { parts: [promptPart, imagePart] },
            });
        } else {
            const prompt = buildPrompt(tlfShell);
            stream = await ai.models.generateContentStream({
                model,
                contents: prompt,
            });
        }
        
        for await (const chunk of stream) {
            yield chunk.text;
        }

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate SAS code from Gemini API.");
    }
};
