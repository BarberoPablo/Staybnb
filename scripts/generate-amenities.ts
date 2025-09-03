import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import { AMENITY_ICON_MAPPINGS } from "./amenity-icon-mappings";

const prisma = new PrismaClient();

async function generateAmenitiesConstants() {
  try {
    console.log("Fetching amenities from database...");

    const amenities = await prisma.amenities.findMany({
      orderBy: { id: "asc" },
    });

    console.log(`Found ${amenities.length} amenities`);

    const serializedAmenities = amenities.map((amenity) => {
      // Get icon mapping for this amenity, fallback to default if not found
      const iconMapping = AMENITY_ICON_MAPPINGS[amenity.name] || AMENITY_ICON_MAPPINGS.default;

      return {
        ...amenity,
        id: amenity.id.toString(),
        icon: iconMapping,
      };
    });

    const constantsContent = `// Auto-generated file - do not edit manually
    // Generated on: ${new Date().toISOString()}
    // Total amenities: ${amenities.length}

    export const AMENITIES = ${JSON.stringify(serializedAmenities, null, 2)} as const;

    export type AmenityId = typeof AMENITIES[number]['id'];

    export type Amenity = typeof AMENITIES[number];

    export type AmenityIcon = {
      name: string;
      library: string;
    };
    `;

    const outputPath = path.join(__dirname, "../src/lib/constants/amenities.ts");

    // Ensure the directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write the file
    fs.writeFileSync(outputPath, constantsContent);

    console.log(`✅ Amenities constants generated at: ${outputPath}`);
    console.log(`📊 Generated ${amenities.length} amenities with IDs: ${amenities.map((a: { id: bigint }) => a.id.toString()).join(", ")}`);
  } catch (error) {
    console.error("❌ Error generating amenities constants:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
generateAmenitiesConstants();
