"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const HeroSchema = z.object({
	id: z.string().optional(),
	title: z.string().min(1, "Title is required."),
	subtitle: z.string().min(1, "Subtitle is required."),
	description: z.string().min(1, "Description is required."),
	imageUrl: z.string().optional(),
});

/**
 * Fetches the active hero content from the database.
 */
export async function getHeroContent() {
	try {
		const hero = await prisma.heroContent.findFirst({
			where: { isActive: true },
			orderBy: { createdAt: "desc" },
		});
		return hero;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch hero content.");
	}
}

/**
 * Updates the hero content in the database.
 * This is a Server Action that can be used in a form.
 */
export async function updateHeroContent(formData: FormData) {
	const validatedFields = HeroSchema.safeParse(
		Object.fromEntries(formData.entries())
	);

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

	const { id, ...dataToUpdate } = validatedFields.data;

	try {
		// Deactivate all other hero content first
		await prisma.heroContent.updateMany({
			where: { isActive: true },
			data: { isActive: false },
		});

		// Create the new active hero content
		await prisma.heroContent.create({
			data: {
				...dataToUpdate,
				isActive: true,
			},
		});
	} catch (error) {
		return {
			message: "Database Error: Failed to update hero content.",
		};
	}

	// Revalidate the home page to show the new content
	revalidatePath("/");
}
