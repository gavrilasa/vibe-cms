// features/services/lib/actions.ts
"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Schema for validating service data
const ServiceSchema = z.object({
	id: z.string().cuid().optional(), // CUID for existing services
	title: z.string().min(1, "Title is required."),
	description: z.string().min(1, "Description is required."),
	icon: z.string().min(1, "Icon name is required."),
	order: z.coerce.number().int("Order must be a whole number."),
	isActive: z.boolean().default(true),
});

// Action to get all services
export async function getServices() {
	try {
		const services = await prisma.service.findMany({
			orderBy: { order: "asc" },
		});
		return services;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch services.");
	}
}

// Action to create a new service
export async function createService(formData: FormData) {
	const validatedFields = ServiceSchema.safeParse({
		title: formData.get("title"),
		description: formData.get("description"),
		icon: formData.get("icon"),
		order: formData.get("order"),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: "Invalid fields. Failed to create service.",
		};
	}

	const { title, description, icon, order, isActive } = validatedFields.data;

	try {
		await prisma.service.create({
			data: { title, description, icon, order, isActive },
		});
	} catch (error) {
		return { message: "Database Error: Failed to create service." };
	}

	revalidatePath("/admin/services"); // Invalidate cache for the services page
}

// Action to update an existing service
export async function updateService(formData: FormData) {
	const validatedFields = ServiceSchema.safeParse({
		id: formData.get("id"),
		title: formData.get("title"),
		description: formData.get("description"),
		icon: formData.get("icon"),
		order: formData.get("order"),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: "Invalid fields. Failed to update service.",
		};
	}

	const { id, title, description, icon, order, isActive } =
		validatedFields.data;

	if (!id) {
		return { message: "Service ID is missing. Failed to update." };
	}

	try {
		await prisma.service.update({
			where: { id },
			data: { title, description, icon, order, isActive },
		});
	} catch (error) {
		return { message: "Database Error: Failed to update service." };
	}

	revalidatePath("/admin/services");
}

// Action to delete a service
export async function deleteService(id: string) {
	if (!id) {
		return { message: "Service ID is missing. Failed to delete." };
	}
	try {
		await prisma.service.delete({
			where: { id },
		});
	} catch (error) {
		return { message: "Database Error: Failed to delete service." };
	}

	revalidatePath("/admin/services");
}
