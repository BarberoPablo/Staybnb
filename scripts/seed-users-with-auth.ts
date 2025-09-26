import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import { US_CITIES } from "./utils";

const prisma = new PrismaClient();

// Set seed for consistent results during development
faker.seed(123);

const password = "123456";

const MEN_PROFILE_IMAGES = [
  "https://mockmind-api.uifaces.co/content/human/222.jpg",
  "https://mockmind-api.uifaces.co/content/human/218.jpg",
  "https://mockmind-api.uifaces.co/content/human/215.jpg",
  "https://mockmind-api.uifaces.co/content/human/213.jpg",
  "https://mockmind-api.uifaces.co/content/human/211.jpg",
  "https://mockmind-api.uifaces.co/content/human/210.jpg",
  "https://mockmind-api.uifaces.co/content/human/201.jpg",
  "https://mockmind-api.uifaces.co/content/human/200.jpg",
  "https://mockmind-api.uifaces.co/content/human/198.jpg",
  "https://mockmind-api.uifaces.co/content/human/197.jpg",
  "https://mockmind-api.uifaces.co/content/human/196.jpg",
  "https://mockmind-api.uifaces.co/content/human/195.jpg",
  "https://mockmind-api.uifaces.co/content/human/185.jpg",
  "https://mockmind-api.uifaces.co/content/human/178.jpg",
  "https://mockmind-api.uifaces.co/content/human/177.jpg",
  "https://mockmind-api.uifaces.co/content/human/172.jpg",
  "https://mockmind-api.uifaces.co/content/human/171.jpg",
  "https://mockmind-api.uifaces.co/content/human/169.jpg",
  "https://mockmind-api.uifaces.co/content/human/168.jpg",
];

const WOMEN_PROFILE_IMAGES = [
  "https://mockmind-api.uifaces.co/content/human/221.jpg",
  "https://mockmind-api.uifaces.co/content/human/220.jpg",
  "https://mockmind-api.uifaces.co/content/human/219.jpg",
  "https://mockmind-api.uifaces.co/content/human/217.jpg",
  "https://mockmind-api.uifaces.co/content/human/216.jpg",
  "https://mockmind-api.uifaces.co/content/human/212.jpg",
  "https://mockmind-api.uifaces.co/content/human/209.jpg",
  "https://mockmind-api.uifaces.co/content/human/208.jpg",
  "https://mockmind-api.uifaces.co/content/human/207.jpg",
  "https://mockmind-api.uifaces.co/content/human/206.jpg",
  "https://mockmind-api.uifaces.co/content/human/205.jpg",
  "https://mockmind-api.uifaces.co/content/human/204.jpg",
  "https://mockmind-api.uifaces.co/content/human/203.jpg",
  "https://mockmind-api.uifaces.co/content/human/202.jpg",
  "https://mockmind-api.uifaces.co/content/human/199.jpg",
  "https://mockmind-api.uifaces.co/content/human/167.jpg",
  "https://mockmind-api.uifaces.co/content/human/166.jpg",
  "https://mockmind-api.uifaces.co/content/human/165.jpg",
  "https://mockmind-api.uifaces.co/content/human/164.jpg",
];

// Realistic bio templates
const BIO_TEMPLATES = [
  "Travel enthusiast who loves sharing beautiful spaces with fellow adventurers.",
  "Local host passionate about showing guests the best of {city}.",
  "Experienced traveler turned host, dedicated to creating memorable stays.",
  "Design lover who enjoys creating comfortable and stylish spaces for guests.",
  "Long-time resident of {city} who loves helping visitors discover hidden gems.",
  "Professional host committed to providing exceptional hospitality.",
  "Adventure seeker who believes great accommodations make great trips.",
  "Local expert who enjoys sharing insider tips and recommendations.",
  "Hospitality professional with a passion for creating welcoming spaces.",
  "World traveler who understands what makes a perfect stay.",
  "Art and culture enthusiast who loves connecting with people from around the world.",
  "Foodie and local guide who enjoys helping guests experience authentic {city}.",
  "Outdoor enthusiast who loves sharing the natural beauty of {city}.",
  "History buff and storyteller who enjoys sharing local knowledge.",
  "Photography lover who captures and shares the beauty of {city}.",
  "Music fan who curates playlists to enhance your stay experience.",
  "Eco-conscious host committed to sustainable and green hospitality.",
  "Yoga practitioner who creates peaceful and relaxing guest environments.",
  "Pet lover who welcomes furry friends with open arms.",
  "Book collector who offers a cozy reading nook for guests.",
  "Coffee aficionado who loves sharing the best local cafés.",
  "Craft enthusiast who enjoys decorating spaces with handmade touches.",
  "Tech-savvy host providing smart home comforts for modern travelers.",
  "Fitness lover who recommends the best local trails and gyms.",
  "Chef at heart who shares favorite recipes and cooking tips.",
  "Language lover eager to practice and share cultural exchange.",
  "Weekend adventurer who knows all the must-see spots in {city}.",
  "Family-friendly host who ensures a safe and fun stay for all ages.",
  "Nightlife connoisseur who guides guests through {city}'s vibrant scenes.",
  "Gardener who surrounds guests with greenery and fresh flowers.",
  "Wellness advocate who offers tips for relaxation and self-care.",
  "Artisan market regular who points guests to unique local crafts.",
  "Ski enthusiast welcoming fellow snow lovers in {city}.",
  "Festival fan who shares insider info on local events and celebrations.",
  "Cycling advocate who helps guests explore on two wheels.",
  "History major who loves sharing fascinating stories about {city}.",
  "Beach lover who knows the best hidden coastal spots.",
];

function generateRealisticBio(city: string, state: string, usedBios: Set<string>): string {
  let attempts = 0;
  let template;

  do {
    template = faker.helpers.arrayElement(BIO_TEMPLATES);
    attempts++;
  } while (usedBios.has(template) && attempts < 50);

  usedBios.add(template);
  return template.replace("{city}", city).replace("{state}", state);
}

function getProfileImage(gender: "male" | "female", usedImages: Set<string>): string {
  const imageArray = gender === "male" ? MEN_PROFILE_IMAGES : WOMEN_PROFILE_IMAGES;

  // Filter out already used images
  const availableImages = imageArray.filter((img) => !usedImages.has(img));

  // If all images are used, reset the used images for this gender
  if (availableImages.length === 0) {
    console.log(`⚠️  All ${gender} images have been used, resetting...`);
    imageArray.forEach((img) => usedImages.delete(img));
    return faker.helpers.arrayElement(imageArray);
  }

  const selectedImage = faker.helpers.arrayElement(availableImages);
  usedImages.add(selectedImage);
  return selectedImage;
}

function generateEmail(firstName: string, lastName: string): string {
  const domains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com"];
  const domain = faker.helpers.arrayElement(domains);
  const variations = [
    `${firstName.toLowerCase()}${lastName.toLowerCase()}${faker.number.int({ min: 1, max: 999 })}`,
    `${firstName.toLowerCase()}_${lastName.toLowerCase()}${faker.number.int({ min: 1, max: 999 })}`,
  ];
  const username = faker.helpers.arrayElement(variations);
  return `${username}@${domain}`;
}

async function generateUsersWithAuth() {
  try {
    console.log("🚀 Starting user generation with authentication...");
    console.log(" Email confirmation will be bypassed using Supabase Admin API");

    // Check environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SERVICE_ROLE) {
      throw new Error("Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SERVICE_ROLE");
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SERVICE_ROLE, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Check if users already exist
    const existingUsersCount = await prisma.users.count();
    if (existingUsersCount > 0) {
      console.log(`⚠️  Found ${existingUsersCount} existing users. This script will add 20 more users.`);
    }

    const createdUsers = [];
    const usedBios = new Set<string>(); // Track used bios to avoid repetition
    const usedImages = new Set<string>(); // Track used images to avoid repetition

    // ✅ Create exactly 50% men and 50% women (10 each)
    const genders: ("male" | "female")[] = [...Array(10).fill("male"), ...Array(10).fill("female")];

    // Shuffle the genders array to randomize the order
    faker.helpers.shuffle(genders);

    for (let i = 0; i < 20; i++) {
      // ✅ Use predetermined gender distribution
      const gender = genders[i];
      const firstName = faker.person.firstName(gender);
      const lastName = faker.person.lastName();
      const email = generateEmail(firstName, lastName);
      const city = faker.helpers.arrayElement(US_CITIES);
      const avatarUrl = getProfileImage(gender, usedImages);

      // Create timestamps (users created over the past 12 months)
      const createdAt = faker.date.between({
        from: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
        to: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
      });

      try {
        // Create user in Supabase Auth with proper metadata structure
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: email,
          password: firstName + lastName + password,
          email_confirm: true, // ✅ This bypasses email confirmation
          user_metadata: {
            email: email,
            email_verified: true,
            phone_verified: false,
            first_name: firstName,
            last_name: lastName,
          },
          app_metadata: {
            // ✅ Match the structure from your manual user
            provider: "email",
            providers: ["email"],
          },
        });

        if (authError) {
          console.error(`❌ Error creating auth user ${i + 1}:`, authError.message);
          continue;
        }

        if (!authData.user) {
          console.error(`❌ No user data returned for user ${i + 1}`);
          continue;
        }

        const userId = authData.user.id;

        // Create profile in database
        const profileData = {
          id: userId,
          first_name: firstName,
          last_name: lastName,
          avatar_url: avatarUrl, // ✅ Now using gender-based profile images with no repetition
          role: "user" as const,
          bio: Math.random() > 0.3 ? generateRealisticBio(city.name, city.state, usedBios) : null, // 70% have bios, no repetition
          created_at: createdAt,
          updated_at: createdAt,
        };

        await prisma.profiles.create({
          data: profileData,
        });

        createdUsers.push({
          email,
          password: firstName + lastName + password,
          firstName,
          lastName,
          bio: profileData.bio,
          userId,
          gender,
          avatarUrl,
        });

        console.log(`✅ Created user ${i + 1}/20: ${firstName} ${lastName} (${email})`);
        console.log(`   User ID: ${userId}`);
        console.log(`   Gender: ${gender}`);
        console.log(`   Avatar: ${avatarUrl}`);
        console.log(`   Email confirmed: true`);
        console.log(`   Profile created: true`);
      } catch (error) {
        console.error(`❌ Error creating user ${i + 1}:`, error);
        continue;
      }
    }

    // Verify the creation
    const totalUsers = await prisma.users.count();
    const totalProfiles = await prisma.profiles.count();

    // Count genders
    const maleCount = createdUsers.filter((user) => user.gender === "male").length;
    const femaleCount = createdUsers.filter((user) => user.gender === "female").length;

    console.log("\n🎉 User generation with authentication completed successfully!");
    console.log(`📊 Total users in database: ${totalUsers}`);
    console.log(`📊 Total profiles in database: ${totalProfiles}`);
    console.log(`📊 Successfully created ${createdUsers.length} users with authentication`);
    console.log(`👨 Male users: ${maleCount} (${Math.round((maleCount / createdUsers.length) * 100)}%)`);
    console.log(`👩 Female users: ${femaleCount} (${Math.round((femaleCount / createdUsers.length) * 100)}%)`);
    console.log("✅ All users have been automatically confirmed (no email confirmation required)");

    // Show login credentials
    console.log("\n🔐 Login Credentials (all users use password: 'firstName + lastName + 123456'):");
    console.log("=".repeat(80));
    createdUsers.slice(0, 10).forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email} | Password: ${user.password} | Name: ${user.firstName} ${user.lastName} (${user.gender})`);
    });

    if (createdUsers.length > 10) {
      console.log(`... and ${createdUsers.length - 10} more users`);
    }

    console.log("\n📋 Sample generated profiles:");
    const sampleProfiles = await prisma.profiles.findMany({
      take: 5,
      orderBy: { created_at: "desc" },
      select: {
        first_name: true,
        last_name: true,
        bio: true,
        role: true,
        created_at: true,
        avatar_url: true,
      },
    });

    sampleProfiles.forEach((profile, index) => {
      console.log(`${index + 1}. ${profile.first_name} ${profile.last_name} (${profile.role})`);
      if (profile.bio) {
        console.log(`   Bio: ${profile.bio.substring(0, 80)}...`);
      }
      console.log(`   Avatar: ${profile.avatar_url}`);
      console.log(`   Created: ${profile.created_at?.toISOString().split("T")[0]}`);
    });

    console.log("\n✨ Ready for next phase: Listing generation!");
    console.log("\n💡 You can now log in to your app using any of the email/password combinations above!");
    console.log("🚀 No email confirmation needed - users are ready to use immediately!");
  } catch (error) {
    console.error("❌ Error generating users with authentication:", error);

    if (error instanceof Error) {
      console.error("Error message:", error.message);
      if (error.stack) {
        console.error("Stack trace:", error.stack);
      }
    }

    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
if (require.main === module) {
  generateUsersWithAuth();
}

export { generateUsersWithAuth };
