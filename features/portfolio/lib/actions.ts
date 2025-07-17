// features/portfolio/lib/actions.ts
"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Schema for validating portfolio data
const PortfolioSchema = z.object({
	id: z.string().cuid().optional(),
	title: z.string().min(1, "Title is required."),
	description: z.string().min(1, "Description is required."),
	category: z.string().min(1, "Category is required."),
	imageUrl: z.string().url("Must be a valid URL.").optional().or(z.literal("")),
	order: z.coerce.number().int("Order must be a whole number."),
});

// Action to get all portfolio items
export async function getPortfolioItems() {
	try {
		const items = await prisma.portfolio.findMany({
			orderBy: { order: "asc" },
		});
		return items;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch portfolio items.");
	}
}

// Action to create a new portfolio item
export async function createPortfolioItem(formData: FormData) {
	const validatedFields = PortfolioSchema.safeParse({
		title: formData.get("title"),
		description: formData.get("description"),
		category: formData.get("category"),
		imageUrl: formData.get("imageUrl"),
		order: formData.get("order"),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: "Invalid fields. Failed to create portfolio item.",
		};
	}

	const { title, description, category, imageUrl, order } =
		validatedFields.data;

	try {
		await prisma.portfolio.create({
			data: { title, description, category, imageUrl, order },
		});
	} catch (error) {
		return { message: "Database Error: Failed to create portfolio item." };
	}

	revalidatePath("/admin/portfolio");
}

// Action to update an existing portfolio item
export async function updatePortfolioItem(formData: FormData) {
	const validatedFields = PortfolioSchema.safeParse({
		id: formData.get("id"),
		title: formData.get("title"),
		description: formData.get("description"),
		category: formData.get("category"),
		imageUrl: formData.get("imageUrl"),
		order: formData.get("order"),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: "Invalid fields. Failed to update portfolio item.",
		};
	}

	const { id, title, description, category, imageUrl, order } =
		validatedFields.data;

	if (!id) {
		return { message: "Portfolio ID is missing. Failed to update." };
	}

	try {
		await prisma.portfolio.update({
			where: { id },
			data: { title, description, category, imageUrl, order },
		});
	} catch (error) {
		return { message: "Database Error: Failed to update portfolio item." };
	}

	revalidatePath("/admin/portfolio");
}

// Action to delete a portfolio item
export async function deletePortfolioItem(id: string) {
	if (!id) {
		return { message: "Portfolio ID is missing. Failed to delete." };
	}
	try {
		await prisma.portfolio.delete({
			where: { id },
		});
	} catch (error) {
		return { message: "Database Error: Failed to delete portfolio item." };
	}

	revalidatePath("/admin/portfolio");
}
