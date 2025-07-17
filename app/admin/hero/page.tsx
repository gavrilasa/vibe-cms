"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { updateHeroContent, getHeroContent } from "@/features/hero/lib/actions";

interface HeroContent {
	id: string;
	title: string;
	subtitle: string;
	description: string;
	imageUrl?: string | null;
}

export default function HeroEditor() {
	const router = useRouter();
	const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [message, setMessage] = useState("");

	useEffect(() => {
		// We can still use a client-side check for auth if needed
		// or handle this in middleware
		const checkAuth = async () => {
			try {
				const response = await fetch("/api/auth/verify"); // Assuming this remains
				if (!response.ok) {
					router.push("/admin/login");
				}
			} catch (error) {
				router.push("/admin/login");
			}
		};
		checkAuth();

		const fetchInitialContent = async () => {
			const content = await getHeroContent();
			if (content) {
				setHeroContent(content);
			}
			setIsLoading(false);
		};

		fetchInitialContent();
	}, [router]);

	const handleFormAction = async (formData: FormData) => {
		setIsSaving(true);
		setMessage("");

		const result = await updateHeroContent(formData);

		if (result?.errors) {
			// Handle validation errors if you add them to the action
			setMessage("Error: Please check the form fields.");
		} else if (result?.message) {
			// Handle database errors
			setMessage(result.message);
		} else {
			setMessage("Hero content updated successfully!");
		}

		setIsSaving(false);
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<div className="bg-white shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<div className="flex items-center">
							<button
								onClick={() => router.push("/admin")}
								className="flex items-center space-x-2 text-gray-500 hover:text-gray-700"
							>
								<ArrowLeft size={20} />
								<span>Back to Dashboard</span>
							</button>
						</div>
						<h1 className="text-xl font-semibold text-gray-900">
							Edit Hero Section
						</h1>
					</div>
				</div>
			</div>

			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{message && (
					<div
						className={`mb-6 p-4 rounded-lg ${
							message.includes("successfully")
								? "bg-green-50 text-green-700"
								: "bg-red-50 text-red-700"
						}`}
					>
						{message}
					</div>
				)}

				<div className="bg-white rounded-lg shadow p-6">
					<form action={handleFormAction}>
						<div className="space-y-6">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Subtitle
								</label>
								<input
									type="text"
									name="subtitle"
									defaultValue={heroContent?.subtitle || ""}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									placeholder="CV Reswara Praptama"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Title
								</label>
								<input
									type="text"
									name="title"
									defaultValue={heroContent?.title || ""}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									placeholder="Engineering Excellence"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Description
								</label>
								<textarea
									rows={4}
									name="description"
									defaultValue={heroContent?.description || ""}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									placeholder="Delivering innovative engineering solutions..."
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Image URL (optional)
								</label>
								<input
									type="url"
									name="imageUrl"
									defaultValue={heroContent?.imageUrl || ""}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									placeholder="https://example.com/image.jpg"
								/>
							</div>

							<div className="flex justify-end">
								<button
									type="submit"
									disabled={isSaving}
									className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
								>
									<Save size={16} />
									<span>{isSaving ? "Saving..." : "Save Changes"}</span>
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
