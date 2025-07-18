// app/admin/portfolio/page.tsx
"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
	ArrowLeft,
	Plus,
	Edit,
	Trash2,
	Loader2,
	AlertCircle,
	Image as ImageIcon,
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
	getPortfolioItems,
	createPortfolioItem,
	updatePortfolioItem,
	deletePortfolioItem,
} from "@/features/portfolio/lib/actions";

// This interface must match the prisma model
interface PortfolioItem {
	id: string;
	title: string;
	description: string;
	category: string;
	imageUrl: string | null;
	order: number;
	createdAt: Date;
	updatedAt: Date;
}

export default function ManagePortfolio() {
	const router = useRouter();
	const [items, setItems] = useState<PortfolioItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// State for the form dialog
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [currentItem, setCurrentItem] = useState<Partial<PortfolioItem>>({});

	useEffect(() => {
		const loadItems = async () => {
			try {
				setIsLoading(true);
				const itemsData = await getPortfolioItems();
				setItems(itemsData);
			} catch (err) {
				setError(
					"Failed to load portfolio items. Please try refreshing the page."
				);
			} finally {
				setIsLoading(false);
			}
		};
		loadItems();
	}, []);

	const openNewDialog = () => {
		setIsEditing(false);
		setCurrentItem({
			title: "",
			description: "",
			category: "",
			imageUrl: "",
			order: items.length + 1,
		});
		setIsDialogOpen(true);
	};

	const openEditDialog = (item: PortfolioItem) => {
		setIsEditing(true);
		setCurrentItem(item);
		setIsDialogOpen(true);
	};

	const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsSubmitting(true);
		setError(null);

		const formData = new FormData(event.currentTarget);
		const action = isEditing ? updatePortfolioItem : createPortfolioItem;

		try {
			const result = await action(formData);
			if (result?.message) {
				setError(result.message);
			} else {
				setIsDialogOpen(false);
				const updatedItems = await getPortfolioItems();
				setItems(updatedItems);
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
		if (!confirm("Are you sure you want to delete this item?")) {
			return;
		}

		try {
			const result = await deletePortfolioItem(id);
			if (result?.message) {
				setError(result.message);
			} else {
				const updatedItems = await getPortfolioItems();
				setItems(updatedItems);
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
					<CardTitle>Manage Portfolio</CardTitle>
					<Button onClick={openNewDialog}>
						<Plus className="mr-2 h-4 w-4" /> Add New Item
					</Button>
				</CardHeader>
				<CardContent>
					{error && (
						<div className="mb-4 flex items-center rounded-md border border-red-500 bg-red-50 p-3 text-red-700">
							<AlertCircle className="mr-2 h-4 w-4" />
							<span>{error}</span>
						</div>
					)}
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{items.map((item) => (
							<Card key={item.id} className="flex flex-col">
								<CardHeader>
									<div className="relative h-40 w-full overflow-hidden rounded-t-lg bg-muted">
										{item.imageUrl ? (
											<Image
												src={item.imageUrl}
												alt={item.title}
												layout="fill"
												objectFit="cover"
											/>
										) : (
											<div className="flex h-full items-center justify-center">
												<ImageIcon className="h-12 w-12 text-muted-foreground" />
											</div>
										)}
									</div>
								</CardHeader>
								<CardContent className="flex flex-1 flex-col justify-between">
									<div>
										<h3 className="font-bold">{item.title}</h3>
										<p className="text-sm text-muted-foreground">
											{item.category}
										</p>
										<p className="mt-2 text-sm">{item.description}</p>
									</div>
									<div className="mt-4 flex items-center justify-end gap-2">
										<Button
											variant="outline"
											size="sm"
											onClick={() => openEditDialog(item)}
										>
											<Edit className="h-4 w-4" />
										</Button>
										<Button
											variant="destructive"
											size="sm"
											onClick={() => handleDelete(item.id)}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
					{items.length === 0 && !isLoading && (
						<p className="py-8 text-center text-muted-foreground">
							No portfolio items found. Click "Add New Item" to begin.
						</p>
					)}
				</CardContent>
			</Card>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{isEditing ? "Edit Portfolio Item" : "Add New Item"}
						</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleFormSubmit} className="space-y-4">
						{isEditing && (
							<input type="hidden" name="id" value={currentItem.id} />
						)}
						<div>
							<label htmlFor="title" className="mb-2 block text-sm font-medium">
								Title
							</label>
							<Input
								id="title"
								name="title"
								defaultValue={currentItem.title}
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
								defaultValue={currentItem.description}
								required
							/>
						</div>
						<div>
							<label
								htmlFor="category"
								className="mb-2 block text-sm font-medium"
							>
								Category
							</label>
							<Input
								id="category"
								name="category"
								defaultValue={currentItem.category}
								required
							/>
						</div>
						<div>
							<label
								htmlFor="imageUrl"
								className="mb-2 block text-sm font-medium"
							>
								Image URL
							</label>
							<Input
								id="imageUrl"
								name="imageUrl"
								type="url"
								defaultValue={currentItem.imageUrl ?? ""}
								placeholder="https://example.com/image.png"
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
								defaultValue={currentItem.order}
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
								{isEditing ? "Save Changes" : "Create Item"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
