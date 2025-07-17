// app/admin/services/page.tsx
"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
	ArrowLeft,
	Plus,
	Edit,
	Trash2,
	Loader2,
	AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog";
import {
	getServices,
	createService,
	updateService,
	deleteService,
} from "@/features/services/lib/actions";

// This interface must match the prisma model
interface Service {
	id: string;
	title: string;
	description: string;
	icon: string;
	order: number;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export default function ManageServices() {
	const router = useRouter();
	const [services, setServices] = useState<Service[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// State for the form dialog
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [currentService, setCurrentService] = useState<Partial<Service>>({});

	useEffect(() => {
		const loadServices = async () => {
			try {
				setIsLoading(true);
				const servicesData = await getServices();
				setServices(servicesData);
			} catch (err) {
				setError("Failed to load services. Please try refreshing the page.");
			} finally {
				setIsLoading(false);
			}
		};
		loadServices();
	}, []);

	const openNewDialog = () => {
		setIsEditing(false);
		setCurrentService({
			title: "",
			description: "",
			icon: "",
			order: services.length + 1,
		});
		setIsDialogOpen(true);
	};

	const openEditDialog = (service: Service) => {
		setIsEditing(true);
		setCurrentService(service);
		setIsDialogOpen(true);
	};

	const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsSubmitting(true);
		setError(null);

		const formData = new FormData(event.currentTarget);
		const action = isEditing ? updateService : createService;

		try {
			const result = await action(formData);
			if (result?.message) {
				setError(result.message);
			} else {
				setIsDialogOpen(false);
				// Manually refresh data after submission
				const updatedServices = await getServices();
				setServices(updatedServices);
			}
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "An unknown error occurred."
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this service?")) {
			return;
		}

		try {
			const result = await deleteService(id);
			if (result?.message) {
				setError(result.message);
			} else {
				// Manually refresh data after deletion
				const updatedServices = await getServices();
				setServices(updatedServices);
			}
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "An unknown error occurred."
			);
		}
	};

	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	return (
		<div className="container mx-auto p-4 md:p-8">
			<Button
				variant="ghost"
				onClick={() => router.push("/admin")}
				className="mb-6"
			>
				<ArrowLeft className="mr-2 h-4 w-4" />
				Back to Dashboard
			</Button>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle>Manage Services</CardTitle>
					<Button onClick={openNewDialog}>
						<Plus className="mr-2 h-4 w-4" /> Add New Service
					</Button>
				</CardHeader>
				<CardContent>
					{error && (
						<div className="mb-4 flex items-center rounded-md border border-red-500 bg-red-50 p-3 text-red-700">
							<AlertCircle className="mr-2 h-4 w-4" />
							<span>{error}</span>
						</div>
					)}
					<div className="space-y-4">
						{services.map((service) => (
							<div
								key={service.id}
								className="flex items-center justify-between rounded-lg border p-4"
							>
								<div>
									<h3 className="font-semibold">
										{service.order}. {service.title}
									</h3>
									<p className="text-sm text-muted-foreground">
										{service.description}
									</p>
									<p className="text-xs text-muted-foreground">
										Icon: {service.icon}
									</p>
								</div>
								<div className="flex items-center gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => openEditDialog(service)}
									>
										<Edit className="h-4 w-4" />
									</Button>
									<Button
										variant="destructive"
										size="sm"
										onClick={() => handleDelete(service.id)}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							</div>
						))}
					</div>
					{services.length === 0 && !isLoading && (
						<p className="py-8 text-center text-muted-foreground">
							No services found. Click "Add New Service" to begin.
						</p>
					)}
				</CardContent>
			</Card>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{isEditing ? "Edit Service" : "Add New Service"}
						</DialogTitle>
						<DialogDescription>
							{isEditing
								? "Update the details of your service."
								: "Fill in the details for the new service."}
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleFormSubmit} className="space-y-4">
						{isEditing && (
							<input type="hidden" name="id" value={currentService.id} />
						)}
						<div>
							<label htmlFor="title" className="mb-2 block text-sm font-medium">
								Title
							</label>
							<Input
								id="title"
								name="title"
								defaultValue={currentService.title}
								required
							/>
						</div>
						<div>
							<label
								htmlFor="description"
								className="mb-2 block text-sm font-medium"
							>
								Description
							</label>
							<Textarea
								id="description"
								name="description"
								defaultValue={currentService.description}
								required
							/>
						</div>
						<div>
							<label htmlFor="icon" className="mb-2 block text-sm font-medium">
								Icon Name
							</label>
							<Input
								id="icon"
								name="icon"
								defaultValue={currentService.icon}
								placeholder="e.g., 'Code'"
								required
							/>
						</div>
						<div>
							<label htmlFor="order" className="mb-2 block text-sm font-medium">
								Order
							</label>
							<Input
								id="order"
								name="order"
								type="number"
								defaultValue={currentService.order}
								required
							/>
						</div>
						<DialogFooter>
							<DialogClose asChild>
								<Button type="button" variant="secondary">
									Cancel
								</Button>
							</DialogClose>
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting ? (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								) : null}
								{isEditing ? "Save Changes" : "Create Service"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
