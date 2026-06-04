/**
 * Script to analyze images using Gemini API and update data.ts
 *
 * Usage:
 * 1. Set NEXT_PUBLIC_GEMINI_API_KEY in .env.local
 * 2. Run: npx tsx scripts/analyze-images.ts
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from "fs";
import * as path from "path";

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || "",
);

interface ImageInfo {
  id: string;
  imageUrl: string;
  currentData: any;
}

async function analyzeImage(imagePath: string, imageInfo: ImageInfo) {
  try {
    console.log(
      `\n📸 Analyzing image: ${imageInfo.id} - ${imageInfo.currentData.title || "Untitled"}`,
    );

    // Read image file
    const imageBuffer = fs.readFileSync(
      path.join(process.cwd(), "public", imagePath),
    );
    const base64Image = imageBuffer.toString("base64");

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Analyze this historical image from Myanmar and provide detailed information in the following JSON format:

{
  "title": "A descriptive title for the image",
  "description": "A detailed description of what is shown in the image (2-3 sentences)",
  "year": estimated year (number, if visible or can be inferred),
  "decade": "decade like 1950s, 1960s, etc.",
  "era": "one of: Pre-Colonial, Colonial Era, Post-Independence, Socialist Era, Modern Era",
  "location": "location name if visible (e.g., Yangon, Mandalay, Bagan, Rangoon)",
  "category": "one of: Urban Life, Rural Life, Fashion, Commerce, Transportation, Architecture, Entertainment, Education, Religion, Other",
  "tags": ["array", "of", "relevant", "tags", "5-8", "tags"],
  "historicalContext": "Detailed historical context and significance of this image (2-3 sentences)"
}

Focus on:
- What is shown in the image (people, buildings, objects, activities)
- Time period indicators (clothing, vehicles, architecture style, technology, documents)
- Location indicators (signs, architecture, landscape, text)
- Historical significance
- Cultural context

Respond ONLY with valid JSON, no additional text or markdown.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: "image/jpeg",
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();

    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const analysis = JSON.parse(jsonMatch[0]);

    // Display results
    console.log("✅ Analysis complete:");
    console.log(`   Title: ${analysis.title}`);
    console.log(`   Year: ${analysis.year || "Unknown"}`);
    console.log(`   Location: ${analysis.location || "Unknown"}`);
    console.log(`   Category: ${analysis.category}`);
    console.log(`   Tags: ${analysis.tags?.join(", ") || "None"}`);

    return analysis;
  } catch (error: any) {
    console.error(`❌ Error analyzing image ${imageInfo.id}:`, error.message);
    return null;
  }
}

async function main() {
  console.log("🚀 Starting image analysis with Gemini API...\n");

  // Check API key
  if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
    console.error(
      "❌ Error: NEXT_PUBLIC_GEMINI_API_KEY not found in environment variables",
    );
    console.log("\nPlease create a .env.local file with:");
    console.log("NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here\n");
    process.exit(1);
  }

  // Read current data
  const dataPath = path.join(process.cwd(), "lib", "data.ts");
  const dataContent = fs.readFileSync(dataPath, "utf-8");

  // Extract image URLs from data.ts
  const imageMatches = dataContent.matchAll(
    /id:\s*['"]([^'"]+)['"].*?imageUrl:\s*['"]([^'"]+)['"]/gs,
  );
  const images: ImageInfo[] = [];

  for (const match of imageMatches) {
    const id = match[1];
    const imageUrl = match[2];

    // Skip placeholder images
    if (imageUrl.startsWith("data:image")) {
      continue;
    }

    // Extract current data for this image
    const idRegex = new RegExp(`id:\\s*['"]${id}['"][\\s\\S]*?\\},`, "g");
    const imageDataMatch = dataContent.match(idRegex);

    images.push({
      id,
      imageUrl,
      currentData: imageDataMatch ? {} : {},
    });
  }

  if (images.length === 0) {
    console.log("No images found to analyze.");
    return;
  }

  console.log(`Found ${images.length} images to analyze.\n`);

  // Analyze each image
  const results: Array<{ id: string; analysis: any }> = [];

  for (const imageInfo of images) {
    const imagePath = imageInfo.imageUrl.replace(/^\//, ""); // Remove leading slash

    // Check if file exists
    const fullPath = path.join(process.cwd(), "public", imagePath);
    if (!fs.existsSync(fullPath)) {
      console.log(
        `⚠️  Skipping ${imageInfo.id}: File not found at ${imagePath}`,
      );
      continue;
    }

    const analysis = await analyzeImage(imagePath, imageInfo);
    if (analysis) {
      results.push({ id: imageInfo.id, analysis });
    }

    // Rate limiting - wait 1 second between requests
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // Display summary
  console.log("\n📊 Analysis Summary:");
  console.log(`   Total analyzed: ${results.length}`);
  console.log(
    "\n💡 Copy the analysis results and update lib/data.ts manually, or use the web interface at /image/[id]",
  );
}

main().catch(console.error);
